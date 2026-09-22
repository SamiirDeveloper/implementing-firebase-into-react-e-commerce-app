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
  // Get cart items from Redux
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const dispatch = useDispatch();

  // Get logged-in Firebase user
  const { user } = useAuth();

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

  const [checkoutMessage, setCheckoutMessage] =
    useState("");

  const [checkoutError, setCheckoutError] =
    useState("");

  // --------------------------------
  // TOTAL ITEMS
  // --------------------------------

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // --------------------------------
  // TOTAL PRICE
  // --------------------------------

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // --------------------------------
  // CONTINUE SHOPPING
  // --------------------------------

  const handleContinueShopping = () => {
    window.location.assign("/");
  };

  // --------------------------------
  // CHECKOUT
  // --------------------------------

  const handleCheckout = async () => {
    // Make sure user is logged in
    if (!user) {
      setCheckoutError(
        "Please log in before checking out."
      );

      return;
    }

    // Make sure cart has products
    if (cartItems.length === 0) {
      setCheckoutError(
        "Your cart is empty."
      );

      return;
    }

    try {
      setIsCheckingOut(true);

      setCheckoutMessage("");
      setCheckoutError("");

      // --------------------------------
      // CREATE ORDER IN FIRESTORE
      // --------------------------------

      const orderReference = await addDoc(
        collection(db, "orders"),
        {
          userId: user.uid,

          userEmail:
            user.email || "",

          products:
            cartItems,

          totalItems:
            totalQuantity,

          totalPrice:
            totalPrice,

          createdAt:
            serverTimestamp(),
        }
      );

      // Log Firebase order ID
      console.log(
        "Firebase Order ID:",
        orderReference.id
      );

      // Display success message
      setCheckoutMessage(
        `Order placed successfully! Order ID: ${orderReference.id}`
      );

      // Clear cart ONLY after Firebase succeeds
      dispatch(clearCart());

    } catch (error) {
      console.error(
        "Error creating Firebase order:",
        error
      );

      setCheckoutError(
        "There was a problem creating your order."
      );

    } finally {
      setIsCheckingOut(false);
    }
  };

  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">

        {/* SUCCESS MESSAGE */}

        {checkoutMessage && (
          <div
            className="alert alert-success"
            role="alert"
          >
            <strong>
              Success!
            </strong>

            <div>
              {checkoutMessage}
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {checkoutError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {checkoutError}
          </div>
        )}

        {/* EMPTY CART CARD */}

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <div className="display-4 mb-3">
              🛒
            </div>

            <h3 className="fw-bold">
              Your cart is empty
            </h3>

            <p className="text-muted">
              Add some products to your cart
              to get started.
            </p>

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={
                handleContinueShopping
              }
            >
              ← Continue Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  // --------------------------------
  // CART WITH PRODUCTS
  // --------------------------------

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="fw-bold">
          Your Shopping Cart
        </h2>

        <p className="text-muted">
          Review your items before checkout.
        </p>

      </div>

      {/* ERROR MESSAGE */}

      {checkoutError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {checkoutError}
        </div>
      )}

      {/* CART ITEMS */}

      <ul className="list-group mb-4">

        {cartItems.map((item) => (

          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center py-3"
          >

            {/* PRODUCT INFO */}

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
                  Quantity:{" "}
                  {item.quantity}
                </span>

              </div>

            </div>

            {/* PRICE + REMOVE */}

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
                disabled={
                  isCheckingOut
                }
                onClick={() =>
                  dispatch(
                    removeFromCart(
                      item.id
                    )
                  )
                }
              >
                Remove
              </button>

            </div>

          </li>

        ))}

      </ul>

      {/* CART SUMMARY */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <h4 className="fw-bold mb-3">
            Cart Summary
          </h4>

          {/* TOTAL ITEMS */}

          <div className="d-flex justify-content-between mb-2">

            <span>
              Total Items
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>

          {/* TOTAL PRICE */}

          <div className="d-flex justify-content-between mb-4">

            <span>
              Total Price
            </span>

            <strong className="text-success fs-5">
              $
              {totalPrice.toFixed(2)}
            </strong>

          </div>

          {/* BUTTONS */}

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-outline-primary flex-grow-1"
              onClick={
                handleContinueShopping
              }
              disabled={
                isCheckingOut
              }
            >
              ← Continue Shopping
            </button>

            <button
              type="button"
              className="btn btn-success flex-grow-1"
              onClick={
                handleCheckout
              }
              disabled={
                isCheckingOut
              }
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