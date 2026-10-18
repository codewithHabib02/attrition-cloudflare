
from pathlib import Path
import os

import joblib
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client

# --------------------------------------------------
# 1. Load environment variables and trained model
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

MODEL_PATH = BASE_DIR / "attrition_model.pkl"
model = joblib.load(MODEL_PATH)

# --------------------------------------------------
# 2. Connect to Supabase
# --------------------------------------------------

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = None

if SUPABASE_URL and SUPABASE_SECRET_KEY:
    supabase = create_client(
        SUPABASE_URL,
        SUPABASE_SECRET_KEY
    )

# --------------------------------------------------
# 3. Create FastAPI application
# --------------------------------------------------

app = FastAPI(title="Employee Attrition Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# 4. Employee input fields
# --------------------------------------------------

class EmployeeData(BaseModel):
    OverTime: str
    JobLevel: int
    StockOptionLevel: int
    MaritalStatus: str
    YearsWithCurrManager: int
    YearsAtCompany: int
    MonthlyIncome: float
    EEAge: int
    JobRole: str


# --------------------------------------------------
# 5. Home endpoint
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Employee Attrition API is running",
        "model_connected": model is not None,
        "supabase_connected": supabase is not None,
    }


# --------------------------------------------------
# 6. Predict employee attrition and save to Supabase
# --------------------------------------------------

@app.post("/predict")
def predict(data: EmployeeData):

    employee = pd.DataFrame([{
        "OverTime": data.OverTime,
        "JobLevel": data.JobLevel,
        "StockOptionLevel": data.StockOptionLevel,
        "MaritalStatus": data.MaritalStatus,
        "YearsWithCurrManager": data.YearsWithCurrManager,
        "YearsAtCompany": data.YearsAtCompany,
        "MonthlyIncome": data.MonthlyIncome,
        "EEAge": data.EEAge,
        "JobRole": data.JobRole,
    }])

    # Generate prediction
    prediction = int(model.predict(employee)[0])

    result = {
        0: "No attrition predicted",
        1: "Attrition predicted",
    }

    response = {
        "prediction": prediction,
        "result": result.get(prediction, "Unknown"),
        "database_saved": False,
    }

    # Calculate probability when supported by the model
    probability = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(employee)[0]
        classes = list(model.classes_)

        if 1 in classes:
            probability = round(
                float(probabilities[classes.index(1)]), 4
            )
            response["attrition_probability"] = probability

    # Save prediction history to Supabase
    if supabase is not None:
        try:
            record = {
                "age": data.EEAge,
                "monthly_income": data.MonthlyIncome,
                "job_level": data.JobLevel,
                "years_at_company": data.YearsAtCompany,
                "years_with_manager": data.YearsWithCurrManager,
                "job_role": data.JobRole,
                "overtime": data.OverTime,
                "marital_status": data.MaritalStatus,
                "stock_option_level": data.StockOptionLevel,
                "prediction": prediction,
                "prediction_result": result.get(
                    prediction, "Unknown"
                ),
                "attrition_probability": probability,
            }

            supabase.table(
                "attrition_predictions"
            ).insert(record).execute()

            response["database_saved"] = True

        except Exception:
            # Do not expose database credentials or internal errors
            response["database_message"] = (
                "Prediction generated, but saving to "
                "Supabase failed. Check backend logs and table settings."
            )

    else:
        response["database_message"] = (
            "Supabase is not configured. Check the backend .env file."
        )

    return response
