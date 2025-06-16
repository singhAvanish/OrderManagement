'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  deleteOrder,
  updateOrderQuantity,
} from '@/redux/orderSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.order);
  const [editId, setEditId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const router = useRouter();

  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      dispatch(fetchOrders());
    }
  }, [dispatch, router]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      dispatch(deleteOrder(id));
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newQuantity || newQuantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    try {
      const result = await dispatch(updateOrderQuantity({ id, quantity: newQuantity }));
      if (updateOrderQuantity.fulfilled.match(result)) {
        await dispatch(fetchOrders());
        setEditId(null);
      } else {
        alert("Failed to update quantity");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const getImageSrc = (image: { data: string; contentType: string }) => {
    if (image.data.startsWith('data:')) return image.data;
    return `data:${image.contentType};base64,${image.data}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  return (
    <div className="w-full px-4 md:px-8 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        📋 Admin Dashboard - Orders
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Image</th>
                <th className="p-3 border text-left">Product</th>
                <th className="p-3 border text-left">Qty</th>
                <th className="p-3 border text-left">Customer</th>
                <th className="p-3 border text-left">Address</th>
                <th className="p-3 border text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    <img
                      src={getImageSrc(order.productImage)}
                      alt="Product"
                      className="w-16 h-16 object-contain rounded-md cursor-pointer"
                      onClick={() => setModalImage(getImageSrc(order.productImage))}
                    />
                  </td>
                  <td className="p-3 border">{order.productName}</td>
                  <td className="p-3 border">
                    {editId === order._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-20"
                          value={newQuantity}
                          onChange={(e) =>
                            setNewQuantity(Number(e.target.value))
                          }
                        />
                        <button
                          onClick={() => handleUpdate(order._id!)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✅
                        </button>
                      </div>
                    ) : (
                      <span>{order.quantity}</span>
                    )}
                  </td>
                  <td className="p-3 border">{order.customerName}</td>
                  <td className="p-3 border">{order.shippingAddress}</td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleDelete(order._id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditId(order._id!);
                        setNewQuantity(order.quantity);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️ Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              ✖
            </button>
            <img
              src={modalImage}
              alt="Full"
              className="max-w-full max-h-[90vh] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
