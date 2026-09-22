import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface Order {
  id: string;
  totalItems: number;
  totalPrice: number;
  createdAt?: Timestamp;
}

const OrderHistory = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Find orders belonging to this user
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(
          ordersQuery
        );

        const userOrders: Order[] =
          snapshot.docs.map((orderDoc) => {
            const data = orderDoc.data();

            return {
              id: orderDoc.id,
              totalItems:
                data.totalItems || 0,
              totalPrice:
                Number(data.totalPrice) || 0,
              createdAt:
                data.createdAt,
            };
          });

        // Newest orders first
        userOrders.sort((a, b) => {
          const first =
            a.createdAt?.toMillis() || 0;

          const second =
            b.createdAt?.toMillis() || 0;

          return second - first;
        });

        setOrders(userOrders);

      } catch (error) {
        console.error(
          "Error loading orders:",
          error
        );

        setError(
          "Unable to load your orders."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // User isn't logged in
  if (!user) {
    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Please log in to view your orders.
        </div>

        <Link
          to="/login"
          className="btn btn-primary"
        >
          Login
        </Link>

      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="container py-5">
        <p>
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">
        My Orders
      </h1>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* NO ORDERS */}

      {!error && orders.length === 0 && (
        <div className="alert alert-info">
          You haven't placed any orders yet.
        </div>
      )}

      {/* ORDERS */}

      <div className="row g-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="col-md-6 col-lg-4"
          >

            <div className="card h-100 border-0 shadow-sm">

              <div className="card-body p-4">

                <h5 className="fw-bold">
                  Order
                </h5>

                <p className="text-muted small">
                  {order.id}
                </p>

                <hr />

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {order.createdAt
                    ? order.createdAt
                        .toDate()
                        .toLocaleDateString()
                    : "Processing"}
                </p>

                <p>
                  <strong>
                    Items:
                  </strong>{" "}
                  {order.totalItems}
                </p>

                <p>
                  <strong>
                    Total:
                  </strong>{" "}

                  <span className="text-success fw-bold">
                    $
                    {order.totalPrice.toFixed(
                      2
                    )}
                  </span>
                </p>

                <Link
                  to={`/orders/${order.id}`}
                  className="btn btn-outline-primary w-100"
                >
                  View Order
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default OrderHistory;