import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

   addToCart: (state, action) => {

const item = action.payload;

const existItem = state.cartItems.find(
(x) => x._id === item._id
);

if (existItem) {

existItem.quantity = Math.min(item.quantity, item.stock);

} else {

state.cartItems.push({
...item,
quantity: Math.min(item.quantity || 1, item.stock)
});

}

localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

},

    removeFromCart: (state, action) => {

      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

   increaseQuantity: (state, action) => {

const item = state.cartItems.find(
(i) => i._id === action.payload
);

if (!item) return;

/* prevent exceeding stock */

if (item.quantity < item.stock) {
  item.quantity += 1;
}

localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

},

    decreaseQuantity: (state, action) => {

      const item = state.cartItems.find(
        (i) => i._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    }

  }
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
} = cartSlice.actions;

export default cartSlice.reducer;