import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/api';

export interface Order {
  _id?: string;
  customerName: string;
  email: string;
  contactNumber: string;
  shippingAddress: string;
  productName: string;
  quantity: number;
  productImage: {
    data: string;
    contentType: string;
  };
  createdAt?: string;
}

interface OrderState {
  loading: boolean;
  orders: Order[];
  error: string | null;
}

const initialState: OrderState = {
  loading: false,
  orders: [],
  error: null,
};

// Create Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: Order, { rejectWithValue }) => {
    try {
      const res = await axios.post('/orders', orderData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

// Fetch Orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// Update Order Quantity
export const updateOrderQuantity = createAsyncThunk(
  'order/updateOrderQuantity',
  async (
    { id, quantity }: { id: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(
        `/orders/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // ✅ Add to top of list
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })

      // UPDATE
      .addCase(updateOrderQuantity.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.orders.findIndex((o) => o._id === updated._id);
        if (index !== -1) {
          state.orders[index] = updated;
        }
      });
  },
});

export default orderSlice.reducer;
