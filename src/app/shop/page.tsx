"use client";

import Image from "next/image";
import CustomerCare from "@/components/Customer-Care";
import Banner from "@/components/Banner";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/types/productData";
import { allProduct } from "@/sanity/lib/queries";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  likeProduct,
  unlikeProduct,
  addToComparison,
  removeFromComparison,
  getLikedProducts,
  getComparison,
} from "../../../redux/cartSlice";

export default function Shop() {
  const dispatch = useDispatch();
  const comparison = useSelector(getComparison); // Comparison products state
  const likedProducts = useSelector(getLikedProducts); // liked products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState<string | null>(null); // Notification state

  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const productFetchData: Product[] = await client.fetch(allProduct);
        if (productFetchData.length === 0) {
          setErrorMessage("No products found.");
        } else {
          setProducts(productFetchData);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "TypeError") {
          setErrorMessage(
            "Network error. Please check your internet connection."
          );
        } else {
          setErrorMessage("Failed to fetch products. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductData();
  }, []);

  // Notification Handler
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  // Add to Cart Handler
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    triggerNotification(`${product.title} has been added to the cart.🛒`);
  };

  // Like Product Handler
  const handleLikeProduct = (product: Product) => {
    dispatch(likeProduct(product));
    triggerNotification(`You liked ${product.title}.🤍`);
  };

  const handleUnlikeProduct = (productId: string) => {
    // Remove product from the like array
    dispatch(unlikeProduct(productId));
  };

  // Add to Comparison Handler
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

  // Remove product from the comparison array
  const handleRemoveFromComparison = (productId: string) => {
    dispatch(removeFromComparison(productId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#D89E00] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f9f0f0]">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{errorMessage}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Notification Section */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#D89E00] text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}

      {/* Banner Section */}
      <Banner name="Shop" logo="/logo.png" title="Shop" />

      {/* Second Section Start */}
      <div className="h-auto mb-8 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-4 bg-[#F9F1E7]">
        {/* Left Section */}
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto">
          {/* Filter Section */}
          <div className="flex items-center gap-2">
            <Image
              src="/filtering.png"
              alt="filter image"
              height={25}
              width={25}
            />
            <p className="font-poppins text-base md:text-xl/[30px] font-normal">
              Filter
            </p>
          </div>

          {/* View Icons */}
          <div className="flex gap-4">
            <Image
              src="/view-list.png"
              alt="view all image"
              height={25}
              width={25}
            />
            <Image
              src="/grid-round.png"
              alt="grid round image"
              height={25}
              width={25}
            />
          </div>

          {/* Results Section */}
          <div className="w-full lg:w-[220px] h-auto lg:h-[37px] flex justify-center lg:justify-end items-center border-t-[1px] lg:border-t-0 lg:border-l-[2px] border-[#9F9F9F] pt-2 lg:pt-0">
            <p className="font-poppins text-sm md:text-base font-normal text-center lg:text-left">
              Showing 1–{products.length} of {products.length} results
            </p>
          </div>
        </div>
      </div>
      {/* Second Section End */}

      {/* Product Grid */}
      <div className="xl:w-[1236px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
          <div
            className="relative w-[250px] xs:w-[280px] mx-auto group"
            key={product._id}
          >
            <Link href={`/shop/${product._id}`}>
              <span className="block overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-2xl transform transition-all duration-250 group-hover:-translate-y-1">
                {/* IMAGE */}
                <div className="relative w-full h-[320px] overflow-hidden">
                  {product.productImage && (
                    <Image
                      src={urlFor(product.productImage).url()}
                      alt={product.title || "Product Image"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      height={391}
                      width={481}
                    />
                  )}

                  {/* price badge top-left */}
                  <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow">
                    ${product.price}
                  </div>
                </div>
              </span>
            </Link>

            {/* FOOTER */}
            <div className="mt-3 px-4 pb-4">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-[20px] leading-tight text-slate-900 mt-1">
                  {product.title}
                </h4>

                {/* Like (heart) */}
                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.classList.add("animate-pop");
                    setTimeout(() => btn.classList.remove("animate-pop"), 250);

                    if (likedProducts.some((item) => item._id === product._id)) {
                      handleUnlikeProduct(product._id);
                    } else {
                      handleLikeProduct(product);
                    }
                  }}
                  className={`ml-3 flex items-center justify-center p-2 rounded-full transition-transform duration-150
                    ${likedProducts.some((item) => item._id === product._id)}
                    shadow-sm`}
                  aria-label="like"
                  title={likedProducts.some((item) => item._id === product._id) ? "Unlike" : "Like"}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="transition-transform duration-150"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                        C13.09 3.81 14.76 3 16.5 3
                        19.58 3 22 5.42 22 8.5
                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={likedProducts.some((item) => item._id === product._id) ? "red" : "white"}
                      stroke={likedProducts.some((item) => item._id === product._id) ? "white" : "currentColor"}
                      strokeWidth="1.3"
                    />
                  </svg>
                </button>
              </div>

              {/* small meta row */}
              <div className="flex items-center justify-between mt-3 gap-3">
                {/* Add to Cart - primary */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 text-sm font-semibold py-2 rounded-lg bg-[#D89E00] text-white hover:brightness-95 transition"
                >
                  Add to Cart
                </button>

                <div className="w-2" />

                {/* Comparison - modern */}
                <button
                  onClick={() => {
                    if (comparison.some((item) => item._id === product._id)) {
                      handleRemoveFromComparison(product._id);
                    } else {
                      handleAddToComparison(product);
                    }
                  }}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition
                    ${comparison.some((item) => item._id === product._id)
                      ? "bg-[#cab16c] text-white border border-[#b79e50]"
                      : "bg-white text-[#D89E00] border border-gray-200"}
                    shadow-sm`}
                >
                  {comparison.some((item) => item._id === product._id) ? "In Comparison" : "Compare"}
                </button>
              </div>
            </div>

            {/* pop animation style (keeps local to card) */}
            <style jsx>{`
              @keyframes pop {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.25);
                }
                100% {
                  transform: scale(1);
                }
              }
              .animate-pop {
                animation: pop 240ms ease-in-out;
              }
            `}</style>
          </div>
        ))}

        </div>
      </div>

      {/* Pagination Buttons */}
      <div className="flex flex-wrap justify-center items-center w-full gap-4 my-16">
        <button className="w-[60px] h-[60px] font-poppins rounded-lg text-xl bg-[#B88E2F] text-white flex justify-center items-center">
          1
        </button>
        <button className="w-[60px] h-[60px] font-poppins rounded-lg text-xl hover:bg-[#B88E2F] hover:text-white bg-[#F9F1E7] flex justify-center items-center">
          2
        </button>
        <button className="w-[60px] h-[60px] font-poppins rounded-lg text-xl hover:bg-[#B88E2F] hover:text-white bg-[#F9F1E7] flex justify-center items-center">
          3
        </button>
        <button className="w-[100px] h-[60px] font-poppins rounded-lg text-xl hover:bg-[#B88E2F] hover:text-white bg-[#F9F1E7] flex justify-center items-center">
          Next
        </button>
      </div>

      <CustomerCare />
    </div>
  );
}
