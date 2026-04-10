import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = '/api/v1';

// ─── GET ALL PRODUCTS ──────────────────────────────────────────────────────
export const getProduct = createAsyncThunk(
  "products/getProduct",
  async ({ keyword = "", page = 1, category = "" }, { rejectWithValue }) => {
    try {
      let link = `/api/v1/products?page=${page}`;
      if (keyword)  link += `&keyword=${keyword}`;
      if (category) link += `&category=${category}`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ─── GET SINGLE PRODUCT DETAILS ────────────────────────────────────────────
export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// ─── SUBMIT REVIEW ─────────────────────────────────────────────────────────
export const submitReview = createAsyncThunk(
  'products/submitReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to submit review');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── SLICE ─────────────────────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products:       [],
    productCount:   0,
    loading:        false,
    reviewLoading:  false,
    error:          null,
    product:        null,
    resultsPerPage: 4,
    totalPages:     0,
  },

  reducers: {
    removeErrors: (state) => { state.error = null; },
  },

  extraReducers: (builder) => {
    builder
      // GET ALL PRODUCTS
      .addCase(getProduct.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading        = false;
        state.error          = null;
        state.products       = action.payload.products;
        state.productCount   = action.payload.productCount;
        state.resultsPerPage = action.payload.resultsPerPage;
        state.totalPages     = action.payload.totalPages;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload || 'Something went wrong';
      })

      // GET PRODUCT DETAILS
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload || 'Something went wrong';
      })

      // SUBMIT REVIEW
      .addCase(submitReview.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.reviewLoading = false;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;