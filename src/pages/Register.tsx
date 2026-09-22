import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      // 1. Create user in Firebase Authentication
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // 2. Add the user's name to their Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName,
      });

      // 3. Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
        address: "",
        createdAt: serverTimestamp(),
      });

      // 4. Send the new user to their profile
      navigate("/profile");
    } catch (error: any) {
      setError(
        error.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            {/* Register Card */}
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Header */}
                <div className="text-center mb-4">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <span className="fs-2">👤</span>
                  </div>

                  <h1 className="h3 fw-bold mb-2">
                    Create Account
                  </h1>

                  <p className="text-muted mb-0">
                    Sign up to get started
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    <strong>Registration failed.</strong>
                    <div className="small mt-1">
                      {error}
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="displayName"
                      className="form-label fw-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      id="displayName"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your name"
                      value={displayName}
                      onChange={(e) =>
                        setDisplayName(e.target.value)
                      }
                      required
                      autoComplete="name"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />

                    <div className="form-text">
                      Password must be at least 6 characters.
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted small mb-0">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Login
                    </a>
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted small mt-4">
              © 2026 Samir Developer. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;