import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSubmitting: false,
  reviews: [],
  error: null
};

export const addReview = createAsyncThunk(
  "review/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/review/add",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true // Important for sending cookies
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to add review"
      );
    }
  }
);

export const getReviews = createAsyncThunk(
  "review/getReviews", 
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch reviews"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Review Cases
      .addCase(addReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.reviews = [action.payload.data, ...state.reviews];
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      
      // Get Reviews Cases
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;