"use client";
import React, { useState } from "react";
import {
  unlikeProduct,
  getLikedProducts,
  addToCart,
  likeProduct,
  getComparison,
  addToComparison,
  removeFromComparison,
} from "../../../redux/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/productData";
import { urlFor } from "@/sanity/lib/image";
import { useSelector } from "react-redux";

const Like = () => {
  const like = useAppSelector(getLikedProducts);
  const dispatch = useAppDispatch();
  const comparison = useSelector(getComparison); // Comparison products state
  const [notification, setNotification] = useState<string | null>(null);

  // Function to handle notifications
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Handle Remove from Wishlist
  const handleRemove = (productId: string) => {
    dispatch(unlikeProduct(productId));
    triggerNotification("Product removed from wishlist.");
  };

  // Handle Add to Cart
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    triggerNotification(`${product.title} added to cart.🛒`);
  };

  // Handle Like Again
  const handleLike = (product: Product) => {
    dispatch(likeProduct(product));
    triggerNotification(`${product.title} added back to wishlist.🤍`);
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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-serif my-3 font-bold text-center mb-10">
        WishList Products
      </h1>

      {/* Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#D89E00] text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}

      {/* No Liked Products */}
      {like.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No liked products yet!</p>
          <Link href="/shop">
            <p className="text-blue-500 underline">Browse products</p>
          </Link>
        </div>
      ) : (
        <div className="grid max-w-[1220px] mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 w-full">
           {like.map((product: Product) => (
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

                    if (like.some((item) => item._id === product._id)) {
                      handleRemove(product._id);
                    } else {
                      handleLike(product);
                    }
                  }}
                  className={`ml-3 flex items-center justify-center p-2 rounded-full transition-transform duration-150
                    ${like.some((item) => item._id === product._id)}
                    shadow-sm`}
                  aria-label="like"
                  title={like.some((item) => item._id === product._id) ? "Unlike" : "Like"}
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
                      fill={like.some((item) => item._id === product._id) ? "red" : "white"}
                      stroke={like.some((item) => item._id === product._id) ? "white" : "currentColor"}
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
      )}
    </div>
  );
};

export default Like;
