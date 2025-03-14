"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkAuthentication ,logout} from "@/utils/api"; 
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsLoggedIn(true);

    const fetchAdminStatus = async () => {
      try {
      const {isAdmin:adminStatus} = await checkAuthentication();
      setIsAdmin(adminStatus);
      }
      catch (err:any) {
        toast.error(err.response?.data?.message || "Error fetching admin status.");
      }
    };

    fetchAdminStatus();
  }, []);

  const handleLogout = async() => {
    await logout();
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const hideLogoutPaths=[
    "/login",
    "/signup",
  ]

  const hideViewOrderPaths=[
    "/login",
    "/cart",
    "/order-history",
    "/signup",
    ""
  ]

  const hideReportsPaths=[
    "/login",
    "/reports",
    "/cart",
    "/signup",
  ]

  const hideProductListPaths=[
    "/login",
    "/products",
    "/signup",
  ]

  const hideViewOrder = hideViewOrderPaths.includes(pathname);
  const hideLogout = hideLogoutPaths.includes(pathname);
  const hideReports = hideReportsPaths.includes(pathname);
  const hideProductList=hideProductListPaths.includes(pathname);

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        MyStore
      </h1>

    
        <div className="flex gap-4">

        { isLoggedIn && !hideProductList  && (
          <button
            onClick={() => router.push("/products")}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
          >
            Product list
          </button>
        )}

        { isLoggedIn && !hideViewOrder  && (
          <button
            onClick={() => router.push("/order-history")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            View Orders
          </button>
        )}

          {isAdmin && !hideReports && (
            <button
              onClick={() => router.push("/reports")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Reports
            </button>
          )}

          {
            isLoggedIn && !hideLogout && (
              <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Logout
            </button>
            )}
         
        </div>
      
    </header>
  );
}
