"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCart, checkout, removeFromCartApi } from "@/utils/api"; // Import removeCart API
import withAuth from "@/hoc/withAuth";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import { FaTrash } from "react-icons/fa"; // Import Trash Icon
import toast from "react-hot-toast";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cart: CartItem[];
  totalPrice: number;
}

function CartPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const router = useRouter();

  function updateCartData() {
    fetchCart()
    .then((data) => {
      setCartData(data);
      setLoading(false);
    })
    .catch((err) => {
      toast.error(err.response?.data?.message || "Error fetching cart data.");
      setLoading(false);
    });
  }

  useEffect(() => {
    updateCartData();
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {

      if(!cartData) {
        toast.error("Cart is empty");
        setIsProcessing(false);
        return  
      }
      const response = await checkout();
      if (response.success) {
        router.push(`/order-summary?orderId=${response.order.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error processing order. Please try again.");
      setIsProcessing(false);
    }
  };

  // Function to Remove Item from Cart
  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await removeFromCartApi(productId); 
      if (response.success) {
        // Update State by Filtering Out the Removed Item
        setCartData((prev) =>
          prev ? { ...prev, cart: prev.cart.filter((item) => item.productId !== productId) } : prev
        );
        updateCartData()
      } else {
        toast.error("Error removing item from cart.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error removing item from cart.");
      alert("Error removing item from cart.");
    }
  };


  return (
    <>
      <Header />
      {loading && <Loader />}
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Cart Items */}
        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cartData?.cart.length ? (
            <ul>
              {cartData.cart.map((item) => (
                <li key={item.productId} className="flex justify-between items-center border-b py-3">
                  <div>
                    <p className="text-lg font-medium">{item.name}</p>
                    <p className="text-gray-500">Category: {item.category}</p>
                    <p className="text-sm text-gray-600">Price: Rs {item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold">Rs {item.subtotal.toFixed(2)}</p>
                    {/* Remove Button */}
                    <button onClick={() => handleRemoveItem(item.productId)} className="text-red-600 hover:text-red-800">
                      <FaTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p className="text-lg font-medium">Total Price:</p>
          <p className="text-2xl font-bold">Rs {cartData?.totalPrice.toFixed(2)}</p>

          <button
            onClick={handleCheckout}
            className={`mt-6 w-full py-2 rounded-lg ${
              isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing Order..." : "Checkout"}
          </button>
        </div>
      </div>
    </>
  );
}

export default withAuth(CartPage);
