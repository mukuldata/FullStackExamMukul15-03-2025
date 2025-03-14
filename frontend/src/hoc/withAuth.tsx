"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login"); // Redirect if not authenticated
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <Loader/>

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
