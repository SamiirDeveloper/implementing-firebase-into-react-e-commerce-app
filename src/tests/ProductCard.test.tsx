import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../app/cartSlice";
import ProductCard from "../components/ProductCard";

const product = {
  id: "1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "This is a test product",
  image: "test.jpg",
  rating: {
    rate: 4.5,
  },
};

test("renders product and adds it to the cart", () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  window.alert = jest.fn();

  render(
    <Provider store={store}>
      <ProductCard product={product} />
    </Provider>
  );

  // Check that the product renders
  expect(screen.getByText("Test Product")).toBeTruthy();
  expect(screen.getByText("$29.99")).toBeTruthy();

  // Simulate the user clicking Add to Cart
  fireEvent.click(
    screen.getByRole("button", { name: /add to cart/i })
  );

  // Check Redux state after the click
  const state = store.getState();

  expect(state.cart.items).toHaveLength(1);
  expect(state.cart.items[0].title).toBe("Test Product");

  // Check that your alert was triggered
  expect(window.alert).toHaveBeenCalledWith(
    "Your item has been added to cart!"
  );
});