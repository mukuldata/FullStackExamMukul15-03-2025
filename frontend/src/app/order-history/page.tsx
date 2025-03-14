"use client";
import { useEffect, useState } from "react";
import { fetchOrderHistory } from "@/utils/api";
import moment from "moment";
import Header from "@/components/Header";
import withAuth from "@/hoc/withAuth";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  OrderItems: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getOrderHistory = async () => {
      try {
        const data = await fetchOrderHistory();
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error(data.message || "Error fetching order history");
        }
      } catch (err:any) {
        toast.error(err.response?.data?.message || "Error fetching order history");
      } finally {
        setLoading(false);
      }
    };

    getOrderHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
    <Header/>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.OrderItems.map((item) => (
                <tr key={item.id} className="text-center border-b">
                  <td className="p-2 border">{item.product.name}</td>
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.product.category}</td>
                  <td className="p-2 border">
                    {moment(order.createdAt).fromNow()}
                  </td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">Rs {order.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default withAuth(OrderHistory);
