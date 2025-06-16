
import { Request, Response } from "express";
import Order from "../models/orderModel";


export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      email,
      contactNumber,
      shippingAddress,
      productName,
      quantity,
      productImage,
    } = req.body;

    if (!productImage?.data || !productImage?.contentType) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newOrder = await Order.create({
      customerName,
      email,
      contactNumber,
      shippingAddress,
      productName,
      quantity,
      productImage,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", error: err });
  }
};


export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { productName, fromDate, toDate } = req.query;

    const filter: any = {};

    if (productName) {
      filter.productName = { $regex: new RegExp(productName as string, "i") };
    }

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
      if (toDate) filter.createdAt.$lte = new Date(toDate as string);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err });
  }
};


export const updateOrderQuantity = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.quantity = quantity;
    await order.save();

    res.json({ message: "Quantity updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err });
  }
};


export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err });
  }
};
