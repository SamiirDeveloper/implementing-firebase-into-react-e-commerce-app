import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, deleteUser } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // READ - Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        setError("");

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setDisplayName(userData.displayName || "");
          setEmail(userData.email || user.email || "");
          setAddress(userData.address || "");
        } else {
          setDisplayName(user.displayName || "");
          setEmail(user.email || "");
        }
      } catch (error: any) {
        setError(
          error.message || "Failed to load profile."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // UPDATE - Update Firebase Auth + Firestore
  const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError("User not found.");
      return;
    }

    try {
      setLoading(true);

      // Update Firebase Authentication profile
      await updateProfile(user, {
        displayName: displayName,
      });

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        displayName: displayName,
        address: address,
      });

      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(
        error.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Delete Firestore document + Auth account
  const handleDeleteAccount = async () => {
    if (!user) {
      setError("User not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const userRef = doc(db, "users", user.uid);

      // Delete Firestore data first
      await deleteDoc(userRef);

      // Delete Firebase Authentication account
      await deleteUser(user);

      navigate("/register");
    } catch (error: any) {
      setError(
        error.message || "Failed to delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="mt-3 text-muted">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">

            {/* Profile Card */}
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Header */}
                <div className="text-center mb-4">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <span className="fs-1">👤</span>
                  </div>

                  <h1 className="h3 fw-bold mb-1">
                    Your Profile
                  </h1>

                  <p className="text-muted mb-0">
                    Manage your account information
                  </p>
                </div>

                {/* Success Message */}
                {success && (
                  <div
                    className="alert alert-success d-flex align-items-center"
                    role="alert"
                  >
                    <span className="me-2">✓</span>
                    <div>{success}</div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <span className="me-2">!</span>
                    <div>{error}</div>
                  </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleUpdateProfile}>

                  {/* Display Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="displayName"
                      className="form-label fw-semibold"
                    >
                      Display Name
                    </label>

                    <input
                      id="displayName"
                      type="text"
                      className="form-control form-control-lg"
                      value={displayName}
                      onChange={(e) =>
                        setDisplayName(e.target.value)
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg bg-light"
                      value={email}
                      disabled
                      readOnly
                    />

                    <div className="form-text">
                      Your email address cannot be changed here.
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="form-label fw-semibold"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      type="text"
                      className="form-control form-control-lg"
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* Update Button */}
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
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                {/* Danger Zone */}
                <div>
                  <h5 className="fw-bold text-danger mb-2">
                    Danger Zone
                  </h5>

                  <p className="text-muted small mb-3">
                    Deleting your account is permanent and cannot
                    be undone.
                  </p>

                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    Delete Account
                  </button>
                </div>

              </div>
            </div>

            <p className="text-center text-muted small mt-4">
              Keep your profile information up to date.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;