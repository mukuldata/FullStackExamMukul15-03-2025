"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import withAuth from "@/hoc/withAuth";
import Header from "@/components/Header";
import { fetchLast7DaysRevenue, fetchTopSpenders, fetchSalesByCategory } from "@/utils/api";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Last7DaysRevenueResponse {
  success: boolean;
  message: string;
  last7DaysRevenue: {
    date: string;
    totalRevenue: number;
  }[];
}

interface User {
  name: string;
  email: string;
}

interface TopSpender {
  userId: string;
  totalSpent: number;
  User: User;
}

interface TopSpendersResponse {
  success: boolean;
  message: string;
  topSpenders: TopSpender[];
}

interface CategorySales {
  category: string;
  totalUnitsSold: number;
  totalRevenue: number;
}

interface SalesByCategoryResponse {
  success: boolean;
  message: string;
  data: CategorySales[];
}


function ReportsClient() {
  const [last7DaysRevenue, setLast7DaysRevenue] = useState<Last7DaysRevenueResponse | null>(null);
  const [topSpenders, setTopSpenders] = useState<TopSpendersResponse | null>(null);
  const [salesByCategory, setSalesByCategory] = useState<SalesByCategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [revenue, spenders, sales] = await Promise.all([
          fetchLast7DaysRevenue(),
          fetchTopSpenders(),
          fetchSalesByCategory(),
        ]);

        setLast7DaysRevenue(revenue);
        setTopSpenders(spenders);
        setSalesByCategory(sales);
      } catch (error) {
        toast.error("Error fetching reports. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);



  return (
    <>
      <Header />
      {loading && <Loader />}
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        {/* Last 7 Days Revenue */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Last 7 Days Revenue</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {last7DaysRevenue?.last7DaysRevenue.map((item: any) => (
                <tr key={item.date} className="border">
                  <td className="p-2 border">{moment(item.date).format("MMM DD, YYYY")}</td>
                  <td className="p-2 border">Rs {item.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Spenders */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Top Spenders</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topSpenders?.topSpenders.map((spender: any) => (
                <tr key={spender.userId} className="border">
                  <td className="p-2 border">{spender.User.name}</td>
                  <td className="p-2 border">{spender.User.email}</td>
                  <td className="p-2 border">Rs {spender.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sales by Category */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Total Units Sold</th>
                <th className="p-2 border">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory?.data.map((category: any) => (
                <tr key={category.category} className="border">
                  <td className="p-2 border">{category.category}</td>
                  <td className="p-2 border">{category.totalUnitsSold}</td>
                  <td className="p-2 border">Rs {category.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default withAuth(ReportsClient);
