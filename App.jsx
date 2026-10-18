
import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  Menu,
  Search,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react'

const initialForm = {
  age: '30',
  monthlyIncome: '5000',
  jobLevel: '2',
  yearsAtCompany: '3',
  yearsWithManager: '2',
  jobRole: 'Research Scientist',
  overtime: 'No',
  maritalStatus: 'Single',
  stockOptionLevel: '0',
}

const API_URL = 'http://127.0.0.1:8000/predict'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  async function assessRisk(event) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setResult(null)

    const employeeData = {
      OverTime: form.overtime,
      JobLevel: Number(form.jobLevel),
      StockOptionLevel: Number(form.stockOptionLevel),
      MaritalStatus: form.maritalStatus,
      YearsWithCurrManager: Number(form.yearsWithManager),
      YearsAtCompany: Number(form.yearsAtCompany),
      MonthlyIncome: Number(form.monthlyIncome),
      EEAge: Number(form.age),
      JobRole: form.jobRole,
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'The model could not generate a prediction.'
        )
      }

      setResult(data)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the model API. Make sure your FastAPI backend is running on port 8000.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Predict Attrition', icon: BrainCircuit },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={23} />
          </div>
          <div>
            <h2>
              Attrition<span>AI</span>
            </h2>
            <p>PEOPLE INTELLIGENCE</p>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? 'active' : ''
              }`}
              onClick={() => {
                setActivePage(name)
                setMenuOpen(false)
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === 'Predict Attrition' && (
                <ArrowRight size={15} className="nav-arrow" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={19} />
            </div>
            <strong>Need some help?</strong>
            <p>Explore your employee analytics workspace.</p>
            <button
              onClick={() =>
                alert('Add your help documentation here.')
              }
            >
              Help center <ArrowRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="avatar">AI</div>
            <div className="profile-info">
              <strong>HR Administrator</strong>
              <span>Workspace account</span>
            </div>
            <ChevronDown size={17} />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="system-status">
              <span />
              ML model API
            </span>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">HR</div>
          </div>
        </header>

        {activePage === 'Dashboard' ? (
          <section className="page">
            <div className="welcome-row">
              <div>
                <div className="eyebrow">
                  <Activity size={15} /> WORKFORCE ANALYTICS
                </div>
                <h1>Employee Intelligence</h1>
                <p className="subtitle">
                  Understand workforce trends and explore employee
                  attrition risk.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setActivePage('Predict Attrition')}
              >
                New assessment <ArrowRight size={17} />
              </button>
            </div>

            <div className="demo-banner">
              <div className="banner-icon">
                <ShieldAlert size={21} />
              </div>
              <div>
                <strong>Dashboard sample data</strong>
                <p>
                  Your trained machine learning model is available
                  on the Predict Attrition page. Dashboard statistics
                  below are illustrative.
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Employees assessed</span>
                  <Users size={19} />
                </div>
                <h2>1,248</h2>
                <p className="stat-note">
                  Illustrative dashboard figure
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>High-risk employees</span>
                  <ShieldAlert size={19} />
                </div>
                <h2>86</h2>
                <p className="stat-note">
                  Illustrative dashboard figure
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Average tenure</span>
                  <Clock3 size={19} />
                </div>
                <h2>
                  4.2 <small>years</small>
                </h2>
                <p className="stat-note">
                  Illustrative dashboard figure
                </p>
              </div>
            </div>

            <div className="content-grid">
              <div className="panel overview-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Workforce overview</h3>
                    <p>Illustrative employee distribution</p>
                  </div>
                  <span className="period-label">Sample data</span>
                </div>

                <div className="overview-number">
                  1,248 <span>employees</span>
                </div>

                <div className="distribution">
                  <div className="distribution-row">
                    <div className="distribution-label">
                      <span className="dot green" />
                      Low risk <strong>72%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill green-fill"
                        style={{ width: '72%' }}
                      />
                    </div>
                  </div>

                  <div className="distribution-row">
                    <div className="distribution-label">
                      <span className="dot amber" />
                      Moderate risk <strong>21%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill amber-fill"
                        style={{ width: '21%' }}
                      />
                    </div>
                  </div>

                  <div className="distribution-row">
                    <div className="distribution-label">
                      <span className="dot red" />
                      High risk <strong>7%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill red-fill"
                        style={{ width: '7%' }}
                      />
                    </div>
                  </div>
                </div>

                <p className="panel-footnote">
                  Sample visualization only — not connected to
                  employee records.
                </p>
              </div>

              <div className="panel action-panel">
                <div className="action-symbol">
                  <BrainCircuit size={25} />
                </div>
                <h3>Assess an employee</h3>
                <p>
                  Enter employee characteristics to receive a
                  prediction from your trained model.
                </p>
                <button
                  className="primary-button full-button"
                  onClick={() => setActivePage('Predict Attrition')}
                >
                  Start assessment <ArrowRight size={17} />
                </button>
                <div className="secure-note">
                  <CheckCircle2 size={15} />
                  Uses your trained ML model
                </div>
              </div>
            </div>

            <footer>
              AttritionAI <span>•</span> Employee Intelligence Platform
              <span className="footer-right">ML-powered assessment</span>
            </footer>
          </section>
        ) : (
          <section className="page">
            <div className="welcome-row">
              <div>
                <div className="eyebrow">
                  <BrainCircuit size={15} /> RISK ASSESSMENT
                </div>
                <h1>Predict Attrition</h1>
                <p className="subtitle">
                  Enter employee information to receive a prediction
                  from your trained machine learning model.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() => setActivePage('Dashboard')}
              >
                Back to dashboard
              </button>
            </div>

            <div className="demo-banner">
              <div className="banner-icon">
                <BrainCircuit size={21} />
              </div>
              <div>
                <strong>Trained ML model</strong>
                <p>
                  Predictions are generated by your saved model
                  through the FastAPI backend. Results are estimates,
                  not certainties.
                </p>
              </div>
            </div>

            <div className="form-layout">
              <form
                className="panel employee-form"
                onSubmit={assessRisk}
              >
                <div className="panel-heading">
                  <div>
                    <h3>Employee information</h3>
                    <p>Complete all nine required fields.</p>
                  </div>
                  <span className="required-label">* Required</span>
                </div>

                <div className="form-section-title">
                  PERSONAL INFORMATION
                </div>

                <div className="form-grid">
                  <label>
                    Age *
                    <input
                      type="number"
                      name="age"
                      min="18"
                      max="100"
                      required
                      value={form.age}
                      onChange={updateForm}
                    />
                  </label>

                  <label>
                    Marital status *
                    <select
                      name="maritalStatus"
                      value={form.maritalStatus}
                      onChange={updateForm}
                      required
                    >
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                    </select>
                  </label>
                </div>

                <div className="form-section-title">
                  JOB INFORMATION
                </div>

                <div className="form-grid">
                  <label>
                    Job role *
                    <select
                      name="jobRole"
                      value={form.jobRole}
                      onChange={updateForm}
                      required
                    >
                      <option>Research Scientist</option>
                      <option>Laboratory Technician</option>
                      <option>Manufacturing Director</option>
                      <option>Healthcare Representative</option>
                      <option>Sales Executive</option>
                      <option>Sales Representative</option>
                      <option>Human Resources</option>
                      <option>Research Director</option>
                      <option>Manager</option>
                    </select>
                  </label>

                  <label>
                    Job level *
                    <select
                      name="jobLevel"
                      value={form.jobLevel}
                      onChange={updateForm}
                      required
                    >
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                      <option value="4">Level 4</option>
                      <option value="5">Level 5</option>
                    </select>
                  </label>

                  <label>
                    Years at company *
                    <input
                      type="number"
                      name="yearsAtCompany"
                      min="0"
                      max="60"
                      required
                      value={form.yearsAtCompany}
                      onChange={updateForm}
                    />
                  </label>

                  <label>
                    Years with current manager *
                    <input
                      type="number"
                      name="yearsWithManager"
                      min="0"
                      max="60"
                      required
                      value={form.yearsWithManager}
                      onChange={updateForm}
                    />
                  </label>

                  <label>
                    Monthly income *
                    <input
                      type="number"
                      name="monthlyIncome"
                      min="0"
                      required
                      value={form.monthlyIncome}
                      onChange={updateForm}
                    />
                  </label>

                  <label>
                    Stock option level *
                    <select
                      name="stockOptionLevel"
                      value={form.stockOptionLevel}
                      onChange={updateForm}
                      required
                    >
                      <option value="0">Level 0</option>
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                    </select>
                  </label>

                  <label className="full-field">
                    Overtime *
                    <select
                      name="overtime"
                      value={form.overtime}
                      onChange={updateForm}
                      required
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </label>
                </div>

                <button
                  className="primary-button submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Predicting...'
                    : 'Predict employee attrition'}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <aside className="panel result-panel">
                <div className="result-icon">
                  <Activity size={24} />
                </div>
                <h3>Assessment result</h3>
                <p className="result-description">
                  The prediction from your trained model will appear
                  here after you submit the form.
                </p>

                {error && (
                  <div className="result-warning" role="alert">
                    {error}
                  </div>
                )}

                {result ? (
                  <div className="result-content">
                    <div
                      className={`risk-badge ${
                        result.prediction === 1 ? 'high' : 'low'
                      }`}
                    >
                      {result.result}
                    </div>

                    {result.attrition_probability !== undefined ? (
                      <>
                        <div className="score-number">
                          {(
                            result.attrition_probability * 100
                          ).toFixed(1)}
                          <span>%</span>
                        </div>

                        <p>Model-estimated attrition probability</p>

                        <div className="progress-track result-track">
                          <div
                            className={`progress-fill ${
                              result.prediction === 1
                                ? 'red-fill'
                                : 'green-fill'
                            }`}
                            style={{
                              width: `${
                                result.attrition_probability * 100
                              }%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <p>
                        Prediction class: {result.prediction}
                      </p>
                    )}

                    <p className="result-warning">
                      This prediction is an estimate from your trained
                      model. It should not be used alone to make
                      employment decisions.
                    </p>
                  </div>
                ) : (
                  <div className="empty-result">
                    <Search size={27} />
                    <span>
                      {loading
                        ? 'Generating prediction...'
                        : 'No prediction yet'}
                    </span>
                    <small>
                      {loading
                        ? 'Waiting for your trained model.'
                        : 'Submit the form to request a prediction.'}
                    </small>
                  </div>
                )}

                <div className="result-tip">
                  <CircleHelp size={17} />
                  <p>
                    The model estimates attrition using the nine
                    employee features provided. A prediction is not
                    a guarantee of future behavior.
                  </p>
                </div>
              </aside>
            </div>

            <footer>
              AttritionAI <span>•</span> Employee Intelligence Platform
              <span className="footer-right">ML-powered assessment</span>
            </footer>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
