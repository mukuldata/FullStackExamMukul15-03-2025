"use client";

import { useState, useEffect } from "react";
import { fetchProducts, fetchCategories } from "@/utils/api";
import Link from "next/link";
import Header from "@/components/Header";
import withAuth from "@/hoc/withAuth";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

type Product ={
  _id: string;
  name: string;
  price: number;
}

type ProductResponse = {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

type CategoryResponse = {
    success: boolean;
    message: string;
    categories: string[];
  };

 function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const limit = 9;



  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data: ProductResponse = await fetchProducts(page, category, search);
        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        toast.error("Failed to load products" , {duration: 4000});
        console.error("Failed to load products");
      }
    };

    loadProducts();
  }, [page, category, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData: CategoryResponse = await fetchCategories();
        setCategories(categoriesData.categories);
      } catch (error) {
        toast.error("Failed to load categories" , {duration: 4000});
        console.error("Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
    <Header />
  
    <main className="p-6">
     
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-md w-1/2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.length>0 && categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
  {products.length === 0 ? (
    <p className="text-center text-gray-500 text-xl font-semibold mt-6">
      No products found matching your search.
    </p>
  ) : (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product._id} href={`/products/${product._id}`}>
          <div className="border p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700 text-lg font-medium">Rs {product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={products.length ==0 || page === totalPages }
        >
          Next
        </button>
      </div>
    </main>
    </>
  );
}

export default withAuth(ProductsPage);