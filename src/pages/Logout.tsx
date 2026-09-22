import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (err: any) {
        setError(err.message || "Unable to log out.");
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-4">

            <div className="card border-0 shadow rounded-4">
              <div className="card-body text-center p-4 p-md-5">

                {error ? (
                  <>
                    {/* Error Icon */}
                    <div
                      className="bg-danger bg-opacity-10 text-danger rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                      }}
                    >
                      <span className="fs-1 fw-bold">!</span>
                    </div>

                    <h2 className="fw-bold mb-2">
                      Logout Failed
                    </h2>

                    <p className="text-muted mb-4">
                      We couldn't sign you out of your account.
                    </p>

                    <div className="alert alert-danger text-start small">
                      {error}
                    </div>

                    <button
                      className="btn btn-primary w-100 py-2 fw-semibold"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </>
                ) : (
                  <>
                    {/* Logout Icon */}
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                      }}
                    >
                      <span className="fs-1">👋</span>
                    </div>

                    <h2 className="fw-bold mb-2">
                      Logging Out
                    </h2>

                    <p className="text-muted mb-4">
                      Please wait while we securely sign you out.
                    </p>

                    {/* Spinner */}
                    <div
                      className="spinner-border text-primary"
                      style={{
                        width: "3rem",
                        height: "3rem",
                      }}
                      role="status"
                    >
                      <span className="visually-hidden">
                        Logging out...
                      </span>
                    </div>

                    <div className="mt-4">
                      <small className="text-muted">
                        Redirecting you to the login page...
                      </small>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted small mt-4">
              Thank you for visiting!
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
