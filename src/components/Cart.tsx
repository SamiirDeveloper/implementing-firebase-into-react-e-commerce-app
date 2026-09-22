import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { RootState } from "../app/store";
import {
  removeFromCart,
  clearCart,
} from "../app/cartSlice";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Cart: React.FC = () => {
  console.log("NEW CART COMPONENT IS RUNNING");

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const dispatch = useDispatch();

  const { user } = useAuth();

  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

  const [checkoutMessage, setCheckoutMessage] =
    useState("");

  const [checkoutError, setCheckoutError] =
    useState("");

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const handleContinueShopping = () => {
    window.location.assign("/");
  };

  const handleCheckout = async () => {
    if (!user) {
      setCheckoutError(
        "Please log in before checking out."
      );

      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError(
        "Your cart is empty."
      );

      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutError("");
      setCheckoutMessage("");

      const orderReference = await addDoc(
        collection(db, "orders"),
        {
          userId: user.uid,
          userEmail: user.email || "",
          products: cartItems,
          totalItems: totalQuantity,
          totalPrice: totalPrice,
          createdAt: serverTimestamp(),
        }
      );

      console.log(
        "Order successfully created:",
        orderReference.id
      );

      setCheckoutMessage(
        `Order placed successfully! Order ID: ${orderReference.id}`
      );

      dispatch(clearCart());
    } catch (error) {
      console.error(
        "Error creating order:",
        error
      );

      setCheckoutError(
        "Unable to place your order. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="container py-5">

        {checkoutMessage && (
          <div
            className="alert alert-success"
            role="alert"
          >
            {checkoutMessage}
          </div>
        )}

        {checkoutError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {checkoutError}
          </div>
        )}

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">

            <div className="display-4 mb-3">
              🛒
            </div>

            <h3 className="fw-bold">
              Your cart is empty
            </h3>

            <p className="text-muted">
              Add some products to your cart to get started.
            </p>

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleContinueShopping}
            >
              ← Continue Shopping
            </button>

          </div>
        </div>

      </div>
    );
  }

  // CART WITH PRODUCTS
  return (
    <div className="container py-5">

      <div className="mb-4">
        <h2 className="fw-bold">
          TEST - NEW FIREBASE CART
        </h2>

        <p className="text-muted">
          Review your items before checkout.
        </p>
      </div>

      {checkoutError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {checkoutError}
        </div>
      )}

      <ul className="list-group mb-4">

        {cartItems.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center py-3"
          >

            <div className="d-flex align-items-center">

              <img
                src={item.image}
                alt={item.title}
                width={60}
                height={60}
                className="me-3"
                style={{
                  objectFit: "contain",
                }}
              />

              <div>
                <h6 className="mb-1 fw-bold">
                  {item.title}
                </h6>

                <span className="text-muted small">
                  Quantity: {item.quantity}
                </span>
              </div>

            </div>

            <div className="d-flex align-items-center">

              <span className="me-3 fw-semibold">
                $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </span>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                disabled={isCheckingOut}
                onClick={() =>
                  dispatch(
                    removeFromCart(item.id)
                  )
                }
              >
                Remove
              </button>

            </div>

          </li>
        ))}

      </ul>

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-3">
            Cart Summary
          </h4>

          <div className="d-flex justify-content-between mb-2">

            <span>
              Total Items
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>

          <div className="d-flex justify-content-between mb-4">

            <span>
              Total Price
            </span>

            <strong className="text-success fs-5">
              ${totalPrice.toFixed(2)}
            </strong>

          </div>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-outline-primary flex-grow-1"
              onClick={handleContinueShopping}
              disabled={isCheckingOut}
            >
              ← Continue Shopping
            </button>

            <button
              type="button"
              className="btn btn-success flex-grow-1"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut
                ? "Placing Order..."
                : "Checkout"}
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Cart;