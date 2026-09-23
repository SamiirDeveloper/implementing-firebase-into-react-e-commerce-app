import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../app/cartSlice";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

// Mock AuthContext because Cart uses useAuth()
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
  }),
}));

const product = {
  id: "1",
  title: "Integration Test Product",
  price: 25,
  category: "electronics",
  description: "Product used for integration testing",
  image: "test.jpg",
  rating: {
    rate: 4.5,
  },
};

test("updates the Cart when a product is added", () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  // ProductCard calls alert() after adding an item
  window.alert = jest.fn();

  render(
    <Provider store={store}>
      <ProductCard product={product} />
      <Cart />
    </Provider>
  );

  // Cart should start empty
  expect(
    screen.getByText("Your cart is empty")
  ).toBeTruthy();

  // User clicks Add to Cart
  fireEvent.click(
    screen.getByRole("button", {
      name: /add to cart/i,
    })
  );

  // Cart UI should now contain the added product
  expect(
    screen.getAllByText("Integration Test Product").length
  ).toBeGreaterThan(1);

  // Cart should show quantity 1
  expect(
    screen.getByText("Quantity: 1")
  ).toBeTruthy();

  // Cart should show the correct total
  expect(
    screen.getAllByText("$25.00")
  ).toHaveLength(3);
});