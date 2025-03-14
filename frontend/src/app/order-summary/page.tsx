"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import withAuth from "@/hoc/withAuth";
import { GiPartyPopper } from "react-icons/gi";


 function OrderSummary() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <>
    <Header/>
  
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600">Thank You for Shopping with Us! <GiPartyPopper className="text-2xl"/>  </h1>
        <p className="text-gray-700 mt-2">Your order has been placed successfully.</p>
        {orderId && <p className="mt-2 text-gray-600">Order ID: <span className="font-bold">{orderId}</span></p>}
      </div>
    </div>
    </>
  );
}

export default withAuth(OrderSummary);
