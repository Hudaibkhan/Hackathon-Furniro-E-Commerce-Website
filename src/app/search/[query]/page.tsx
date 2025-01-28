"use client";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/productData";
import { groq } from "next-sanity";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useAppDispatch } from "../../../../hooks/redux";
import {
  addToCart,
  addToComparison,
  getComparison,
  likeProduct,
  removeFromComparison,
} from "../../../../redux/cartSlice";
import { useSelector } from "react-redux";

const SearchResult = () => {
  // add to cart
  const dispatch = useAppDispatch();
  const { query: rawQuery } = useParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const comparison = useSelector(getComparison); // Comparison products state
  const [notification, setNotification] = useState<string | null>(null);

  // Function to handle notifications
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Handle Add to Cart
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    triggerNotification(`${product.title} added to cart.🛒`);
  };

  // Wishlist Product Handler
  const handleLikeProduct = (product: Product) => {
    dispatch(likeProduct(product));
    triggerNotification(`You liked ${product.title}.🤍`);
  };

  const handleAddToComparison = (product: Product) => {
    if (comparison.length >= 2) {
      triggerNotification("You can only compare up to 2 products."); // Show a warning
    } else if (comparison.some((item) => item._id === product._id)) {
      triggerNotification(`${product.title} is already in comparison.`);
    } else {
      dispatch(addToComparison(product));
      triggerNotification(`${product.title} added to comparison.`);
    }
  };

  const handleRemoveFromComparison = (productId: string) => {
    // Remove product from the comparison array
    dispatch(removeFromComparison(productId));
  };
  useEffect(() => {
    const fetchProductData = async () => {
      if (!rawQuery || typeof rawQuery !== "string") {
        setError("Invalid query parameter.");
        console.error("Invalid query parameter:", rawQuery);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Decode the query string to handle spaces and special characters
        const decodedQuery = decodeURIComponent(rawQuery)
          .replace(/\s+/g, "-")
          .toLowerCase();
        // Fetch product data using Sanity client
        const productFetchData: Product[] = await client.fetch(
          groq`*[_type == "product" && (title match $decodedQuery || $decodedQuery in tags[])]{
            _id,
            title,
            isNew,
            description,
            discountPercentage,
            price,
            productImage,
            tags
          }`,
          { decodedQuery }
        );

        if (productFetchData.length > 0) {
          setProducts(productFetchData);
          setError(null); // Clear any previous errors
        } else {
          setProducts([]);
          setError(`No products found for "${decodedQuery}".`);
        }
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [rawQuery]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#D89E00] rounded-full animate-spin"></div>
          {/* Loading Text */}
          <p className="mt-4 font-poppins text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="font-poppins text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Handle empty product list
  if (!products || products.length === 0) {
    const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery; // Take the first element if it's an array
    const safeQuery = query ? decodeURIComponent(query) : ""; // Decode the query if it exists

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="font-poppins text-lg text-gray-600">
          No products found for &quot;{safeQuery}&quot;.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#D89E00] text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}
      <div className="p-8">
        <h1 className="text-2xl font-bold max-w-[1200px] mx-auto">
          Search Results for{" "}
          {decodeURIComponent(
            typeof rawQuery === "string"
              ? rawQuery
              : Array.isArray(rawQuery)
                ? rawQuery[0] || ""
                : ""
          )}{" "}
          &quot;{products.length}&quot;
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto w-fit">
        {products.map((element: Product) => (
          <div
            className="relative w-[250px] xs:w-[280px] mx-auto group"
            key={element._id}
          >
            {/* Image Section with Link */}
            <Link href={`/shop/${element._id}`}>
              <div className="relative">
                {element.productImage && (
                  <Image
                    src={urlFor(element.productImage).url()}
                    alt={element.title || "Product Image"}
                    className="rounded-lg w-full h-[320px]"
                    height={391}
                    width={481}
                  />
                )}
                {/* Tag (e.g., "New") */}
                {element.isNew && (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full text-sm sm:text-base font-medium bg-[#5ea054] text-white absolute top-3 right-3 flex justify-center items-center">
                    New
                  </div>
                )}
              </div>
            </Link>

            {/* Product Info Section */}
            <div className="bg-[#d5dae6] p-4 sm:p-6">
              {/* Title */}
              <h4 className="font-semibold text-lg sm:text-2xl font-poppins">
                {element.title}
              </h4>

              {/* Price */}
              <p className="font-poppins font-semibold text-base sm:text-xl mt-2">
                ${element.price}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(element)}
                  className="w-full bg-[#D89E00] hover:bg-yellow-700 text-white py-2 rounded-xl mb-2"
                >
                  Add to Cart
                </button>

                {/* Compare */}
                <button
                  onClick={() => {
                    if (comparison.some((item) => item._id === element._id)) {
                      handleRemoveFromComparison(element._id); // Call the remove function if already in comparison
                    } else {
                      handleAddToComparison(element); // Call the add function if not in comparison
                    }
                  }}
                  className={`py-2 px-3 rounded-lg ${
                    comparison.some((item) => item._id === element._id)
                      ? "bg-gray-500 text-white text-xs" // Styling for "Remove from Comparison"
                      : "bg-[#D89E00] text-white" // Styling for "Add to Comparison"
                  }`}
                >
                  {comparison.some((item) => item._id === element._id)
                    ? "Remove from Comparison"
                    : "Add to Comparison"}
                </button>

                <div
                  className="bg-[#D89E00] hover:bg-yellow-700 px-1 text-white rounded-lg flex items-center gap-1 text-sm sm:text-base font-medium cursor-pointer"
                  onClick={() => handleLikeProduct(element)}
                >
                  <Image
                    src="/heart-white.png"
                    alt="Like Icon"
                    height={14}
                    width={14}
                  />
                  <span>Like</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
