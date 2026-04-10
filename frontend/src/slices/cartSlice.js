import { createSlice } from "@reduxjs/toolkit";

// Check if there is already a cart saved in the browser's memory
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" }; // If not, start with an empty array

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action 1: Add item to cart
    addToCart: (state, action) => {
      const item = action.payload; // The item being added

      // Check if this item is ALREADY in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If it exists, update it (e.g., if they changed the quantity)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x,
        );
      } else {
        // If it doesn't exist, push it to the end of the array
        state.cartItems = [...state.cartItems, item];
      }

      // Save the updated state to the browser's local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    // NEW: Remove item from cart
    removeFromCart: (state, action) => {
      // Filter out the item whose ID matches the one we want to remove
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      // Save the updated array to local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      // Save the updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      // Save the now-empty cart to local storage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
