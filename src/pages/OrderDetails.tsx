import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface OrderProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  products: OrderProduct[];
  totalItems: number;
  totalPrice: number;
  createdAt?: Timestamp;
}

const OrderDetails = () => {
  const { orderId } = useParams();

  const { user } = useAuth();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      // User must be logged in
      if (!user) {
        setLoading(false);
        return;
      }

      // Make sure an order ID exists
      if (!orderId) {
        setError("Order ID was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Get the specific order from Firestore
        const orderReference = doc(
          db,
          "orders",
          orderId
        );

        const orderSnapshot =
          await getDoc(orderReference);

        // Check if order exists
        if (!orderSnapshot.exists()) {
          setError("Order not found.");
          setOrder(null);
          return;
        }

        const data =
          orderSnapshot.data();

        // SECURITY CHECK:
        // Only show the order if it belongs
        // to the logged-in user.
        if (data.userId !== user.uid) {
          setError(
            "You do not have permission to view this order."
          );

          setOrder(null);
          return;
        }

        const loadedOrder: Order = {
          id: orderSnapshot.id,

          userId:
            data.userId,

          userEmail:
            data.userEmail || "",

          products:
            data.products || [],

          totalItems:
            data.totalItems || 0,

          totalPrice:
            Number(data.totalPrice) || 0,

          createdAt:
            data.createdAt,
        };

        setOrder(loadedOrder);

      } catch (error) {
        console.error(
          "Error loading order:",
          error
        );

        setError(
          "Unable to load this order."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [user, orderId]);

  // --------------------------------
  // NOT LOGGED IN
  // --------------------------------

  if (!user) {
    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Please log in to view this order.
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

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="container py-5">
        <p>
          Loading order...
        </p>
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error || !order) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error || "Order not found."}
        </div>

        <Link
          to="/orders"
          className="btn btn-primary"
        >
          ← Back to My Orders
        </Link>

      </div>
    );
  }

  // --------------------------------
  // ORDER DETAILS
  // --------------------------------

  return (
    <div className="container py-5">

      {/* BACK BUTTON */}

      <Link
        to="/orders"
        className="btn btn-outline-primary mb-4"
      >
        ← Back to My Orders
      </Link>

      {/* ORDER HEADER */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <h2 className="fw-bold mb-4">
            Order Details
          </h2>

          <p>
            <strong>
              Order ID:
            </strong>{" "}
            {order.id}
          </p>

          <p>
            <strong>
              Date:
            </strong>{" "}

            {order.createdAt
              ? order.createdAt
                  .toDate()
                  .toLocaleString()
              : "Processing"}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {order.userEmail}
          </p>

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            Products
          </h4>

          {order.products.map(
            (product) => (

              <div
                key={product.id}
                className="d-flex align-items-center border-bottom py-3"
              >

                {/* PRODUCT IMAGE */}

                <img
                  src={product.image}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="me-4"
                  style={{
                    objectFit: "contain",
                  }}
                />

                {/* PRODUCT INFORMATION */}

                <div className="flex-grow-1">

                  <h5 className="mb-1">
                    {product.title}
                  </h5>

                  <p className="text-muted mb-1">
                    Quantity:{" "}
                    {product.quantity}
                  </p>

                  <p className="mb-0">
                    Price: $
                    {product.price.toFixed(
                      2
                    )}
                  </p>

                </div>

                {/* ITEM TOTAL */}

                <div className="fw-bold">

                  $
                  {(
                    product.price *
                    product.quantity
                  ).toFixed(2)}

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* ORDER SUMMARY */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-3">
            Order Summary
          </h4>

          <div className="d-flex justify-content-between mb-2">

            <span>
              Total Items
            </span>

            <strong>
              {order.totalItems}
            </strong>

          </div>

          <div className="d-flex justify-content-between">

            <span>
              Total Price
            </span>

            <strong className="text-success fs-4">
              $
              {order.totalPrice.toFixed(
                2
              )}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;