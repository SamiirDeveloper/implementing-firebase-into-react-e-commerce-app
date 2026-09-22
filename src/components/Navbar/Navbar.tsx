import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        {/* STORE LOGO */}
        <Link
          to="/"
          className="navbar-brand fw-bold fs-4"
        >
          🛍️ My Store
        </Link>

        {/* MOBILE NAVBAR BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVBAR LINKS */}
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <div className="navbar-nav ms-auto align-items-lg-center">

            {/* HOME */}
            <Link
              to="/"
              className="nav-link px-lg-3"
            >
              Home
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="nav-link px-lg-3"
            >
              🛒 Cart
            </Link>

            {/* LOGGED-IN USER LINKS */}
            {user ? (
              <>
                {/* PROFILE */}
                <Link
                  to="/profile"
                  className="nav-link px-lg-3"
                >
                  👤 Profile
                </Link>

                {/* MANAGE PRODUCTS */}
                <Link
                  to="/products/manage"
                  className="nav-link px-lg-3"
                >
                  📦 Manage Products
                </Link>

                {/* MY ORDERS */}
                <Link
                  to="/orders"
                  className="nav-link px-lg-3"
                >
                  📋 My Orders
                </Link>

                {/* LOGOUT */}
                <Link
                  to="/logout"
                  className="nav-link px-lg-3"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                {/* REGISTER */}
                <Link
                  to="/register"
                  className="nav-link px-lg-3"
                >
                  Register
                </Link>

                {/* LOGIN */}
                <Link
                  to="/login"
                  className="btn btn-light text-primary fw-semibold ms-lg-2 px-3"
                >
                  Login
                </Link>
              </>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;