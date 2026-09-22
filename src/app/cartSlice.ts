import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Load cart from sessionStorage
const savedCart = sessionStorage.getItem("cart");

const initialState: CartState = {
  items: savedCart
    ? JSON.parse(savedCart)
    : [],
};

// Save cart to sessionStorage
const saveCart = (items: CartItem[]) => {
  sessionStorage.setItem(
    "cart",
    JSON.stringify(items)
  );
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ADD PRODUCT TO CART
    addToCart(
      state,
      action: PayloadAction<CartItem>
    ) {
      const existing =
        state.items.find(
          (item) =>
            item.id === action.payload.id
        );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },

    // REMOVE PRODUCT FROM CART
    removeFromCart(
      state,
      action: PayloadAction<string>
    ) {
      state.items =
        state.items.filter(
          (item) =>
            item.id !== action.payload
        );

      saveCart(state.items);
    },

    // CLEAR CART
    clearCart(state) {
      state.items = [];

      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;