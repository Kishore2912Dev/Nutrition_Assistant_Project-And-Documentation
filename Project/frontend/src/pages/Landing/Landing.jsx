import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaAppleAlt, FaCalculator, FaChartLine, FaClipboardList, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page bg-light-bg">
      {/* Hero Section */}
      <header className="bg-dark-green text-white py-5 text-center text-lg-start" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3" style={{ lineHeight: '1.2' }}>
                Your Personalized <span className="text-primary-green">Nutrition</span> Assistant
              </h1>
              <p className="lead mb-4 text-light">
                Log meals, track metrics, calculate personalized macronutrient goals, and get assigned specialized diets from clinical dietitians. Start living healthier today.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary-green btn-lg px-4">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary-green btn-lg px-4">
                      Get Started Free
                    </Link>
                    <a href="#features" className="btn btn-outline-light btn-lg px-4">
                      Explore Features
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-4 bg-white rounded shadow-lg d-inline-block text-dark text-start" style={{ maxWidth: '420px', borderRadius: '16px' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaAppleAlt className="text-primary-green fs-4" />
                  <h5 className="m-0 fw-bold">Live Calorie Logger</h5>
                </div>
                <div className="mb-2 p-2 bg-light-bg rounded d-flex justify-content-between align-items-center">
                  <span>Apple (100g)</span>
                  <span className="badge bg-primary-green">52 kcal</span>
                </div>
                <div className="mb-2 p-2 bg-light-bg rounded d-flex justify-content-between align-items-center">
                  <span>Chicken Breast (150g)</span>
                  <span className="badge bg-primary-green">248 kcal</span>
                </div>
                <div className="p-2 bg-light-bg rounded d-flex justify-content-between align-items-center mb-3">
                  <span>White Rice (200g)</span>
                  <span className="badge bg-primary-green">260 kcal</span>
                </div>
                <div className="border-top pt-3 d-flex justify-content-between">
                  <div>
                    <small className="text-muted d-block">Total Consumed</small>
                    <strong className="fs-5">560 kcal</strong>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block">Daily Goal</small>
                    <strong className="text-primary-green fs-5">2,100 kcal</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="container py-5 my-3">
        <div className="text-center mb-5">
          <span className="text-primary-green fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Core Ecosystem</span>
          <h2 className="display-6 fw-bold mt-2">What NutriGuide Offers</h2>
          <p className="text-muted max-w-2xl mx-auto">
            A comprehensive suite of tools built for individuals, dietitians, and clinic managers.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="health-card h-100 text-center p-4">
              <div className="d-inline-flex p-3 bg-light-green text-primary-green rounded-circle mb-3 fs-3">
                <FaCalculator />
              </div>
              <h4 className="fw-bold mb-2">Food Database Search</h4>
              <p className="text-muted">
                Search through our catalog of foods to immediately fetch protein, carbs, fat, and fiber, and log them into your daily log.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="health-card h-100 text-center p-4">
              <div className="d-inline-flex p-3 bg-light-green text-primary-green rounded-circle mb-3 fs-3">
                <FaAppleAlt />
              </div>
              <h4 className="fw-bold mb-2">Nutrition Assistant</h4>
              <p className="text-muted">
                Input your weight, height, and goals, and let our custom algorithm construct a macro profile with suggested diet plans.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="health-card h-100 text-center p-4">
              <div className="d-inline-flex p-3 bg-light-green text-primary-green rounded-circle mb-3 fs-3">
                <FaChartLine />
              </div>
              <h4 className="fw-bold mb-2">Progress Tracking</h4>
              <p className="text-muted">
                Track your weight history, calorie trends, and water intake over weeks or months with beautifully rendered charts.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="health-card h-100 text-center p-4">
              <div className="d-inline-flex p-3 bg-light-green text-primary-green rounded-circle mb-3 fs-3">
                <FaClipboardList />
              </div>
              <h4 className="fw-bold mb-2">Dietitian Support</h4>
              <p className="text-muted">
                Connect with professional health coaches. Allow clinical dietitians to compile, assign, and customize meal plans directly for you.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="health-card h-100 text-center p-4">
              <div className="d-inline-flex p-3 bg-light-green text-primary-green rounded-circle mb-3 fs-3">
                <FaClipboardList />
              </div>
              <h4 className="fw-bold mb-2">Administrative Control</h4>
              <p className="text-muted">
                Admins have oversight of registered practitioners, clinical analytics, platform status, and user management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-light py-5 border-top border-bottom">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h3 className="fw-bold mb-3 text-dark-green">Healthy Eating Made Simple</h3>
              <p className="text-muted">
                NutriGuide takes the complexity out of tracking macronutrients. By dividing your needs into target percentages based on whether you want to lose weight, gain muscle, or manage a medical condition (like high blood pressure or diabetes), you get actionable, daily checklists that fit your schedule.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex align-items-center gap-2">
                  <span className="text-primary-green">✔</span> Low-carb, Keto, Vegan, and Vegetarian settings.
                </li>
                <li className="mb-2 d-flex align-items-center gap-2">
                  <span className="text-primary-green">✔</span> Instant adjustments for medical restrictions.
                </li>
                <li className="mb-2 d-flex align-items-center gap-2">
                  <span className="text-primary-green">✔</span> Automated water consumption logging.
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h4 className="fw-bold mb-3 text-dark-green text-center">Contact NutriGuide Support</h4>
                <p className="text-muted text-center mb-4">Have questions? Get in touch with our lead support division.</p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light-green rounded text-primary-green">
                      <FaEnvelope />
                    </div>
                    <div>
                      <small className="text-muted d-block">Email Address</small>
                      <a href="mailto:vanapallisuryaramakishore@gmail.com" className="text-decoration-none text-dark fw-semibold">
                        vanapallisuryaramakishore@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light-green rounded text-primary-green">
                      <FaPhone />
                    </div>
                    <div>
                      <small className="text-muted d-block">Phone Support</small>
                      <a href="tel:9391959683" className="text-decoration-none text-dark fw-semibold">
                        +91 9391959683
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light-green rounded text-primary-green">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <small className="text-muted d-block">Office Location</small>
                      <span className="text-dark fw-semibold">Kakinada, Andhra Pradesh, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-4 text-center">
        <div className="container">
          <p className="m-0">&copy; {new Date().getFullYear()} NutriGuide AI. All rights reserved.</p>
          <small className="text-muted">Empowering clinical health, meal logistics, and personal trackers.</small>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
