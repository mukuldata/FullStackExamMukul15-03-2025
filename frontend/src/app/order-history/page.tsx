"use client";
import { useEffect, useState } from "react";
import { fetchOrderHistory } from "@/utils/api";
import moment from "moment";
import Header from "@/components/Header";
import withAuth from "@/hoc/withAuth";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface OrderItem {
  productName: string;
  quantity: number;
  category: string;
  price: number;
}

interface Order {
  orderId: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
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
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Error fetching order history");
      } finally {
        setLoading(false);
      }
    };

    getOrderHistory();
  }, []);


  return (
    <>
      <Header />
      {loading && <Loader />}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="bg-white p-5 shadow-md rounded-lg border border-gray-300">
                {/* Order Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Order ID: {order.orderId}</h3>
                  <p className="text-gray-500 text-sm">Order Placed {moment(order.createdAt).fromNow()}</p>
                </div>

                {/* Product List */}
                <div className="border-t pt-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-none">
                      <div>
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                      </div>
                      <p className="text-gray-700">Qty: {item.quantity}</p>
                      <p className="text-gray-700">Rs {Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>


                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="text-gray-700 font-semibold">
                    Total: Rs {Number(order.totalPrice).toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Pending"
                        ? "bg-white-100 text-green-600"
                        : "bg-white-100 text-yellow-600"
                    }`}
                  >
                    {order.status =="Pending" ? "Order Placed" : "Order Delivered"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(OrderHistory);
