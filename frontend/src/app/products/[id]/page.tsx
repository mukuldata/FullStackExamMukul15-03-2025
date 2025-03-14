"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchProductById, addToCartApi } from "@/utils/api";
import { FaCartPlus } from "react-icons/fa";
import Header from "@/components/Header";
import withAuth from "@/hoc/withAuth";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const { product: data } = await fetchProductById(id as string);
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product details");
        console.error("Failed to load product details");
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || quantity < 1) return;
    setLoading(true);
    try {
      const response = await addToCartApi(product._id, quantity);
      toast.success(response.message || "Added to cart successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message||"Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <Loader/>;
  }

  return (
    <>
  
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
  
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-lg font-semibold text-blue-600">Price: Rs {product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p>

  
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 text-center p-2 border rounded-md"
            min="1"
            max={product.stock}
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={loading}
          >
            <FaCartPlus /> {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>


        {/* View Cart Button */}
        <button
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          onClick={() => router.push("/cart")}
        >
          View Cart
        </button>

        {/* Product List */}
        <button
          className="w-full mt-4 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
          onClick={() => router.push("/products")}
        >
          Back to Product List
        </button>
      </div>
    </main>
    </>
  );
}


export default withAuth(ProductDetailPage);
