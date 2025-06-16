'use client';
import { useState } from 'react';
import axios from '@/lib/api';
import { useRouter } from 'next/navigation';



const HomePage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    contactNumber: '',
    shippingAddress: '',
    productName: '',
    quantity: 1,
    productImage: {
      data: '',
      contentType: '',
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        setMessage('Only .jpg/.png under 2MB allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          productImage: {
            data: reader.result?.toString() || '',
            contentType: file.type,
          },
        }));
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/orders', formData);
      setMessage('✅ Order placed successfully!');
      setFormData({
        customerName: '',
        email: '',
        contactNumber: '',
        shippingAddress: '',
        productName: '',
        quantity: 1,
        productImage: {
          data: '',
          contentType: '',
        },
      });
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage('❌ Error placing order. Check fields and try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl relative">
      {/* 🔐 Admin Login and Signup Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => router.push('/admin/login')}
          className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700"
        >
          Admin Login
        </button>
        <button
          onClick={() => router.push('/admin/signup')}
          className="bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-500"
        >
          Admin Signup
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">📦 Place Your Order</h1>

      {message && <p className="text-center mb-4 text-sm text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          className="input"
          required
          minLength={3}
          maxLength={30}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
          type="email"
        />
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          className="input"
          required
          pattern="\d{10}"
        />
        <textarea
          name="shippingAddress"
          placeholder="Shipping Address"
          value={formData.shippingAddress}
          onChange={handleChange}
          className="input"
          required
          maxLength={100}
        />
        <input
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="input"
          required
          minLength={3}
          maxLength={50}
        />
        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          className="input"
          required
          min={1}
          max={100}
        />
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          className="input"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default HomePage;
