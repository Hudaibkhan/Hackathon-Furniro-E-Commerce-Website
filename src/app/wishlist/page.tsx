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
          {like.map((element: Product) => (
            <div
              className="relative w-[250px] xs:w-[280px] mx-auto group"
              key={element._id}
            >
              {/* Image Section with Link */}
              <Link href={`/shop/${element._id}`}>
                <div className="relative ">
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
              <div className="bg-[#F4F5F7] p-4 sm:p-6">
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
                  <button
                    onClick={() => handleRemove(element._id)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl"
                  >
                    Remove
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
                  {/* Like */}
                  <div
                    className="bg-[#D89E00] hover:bg-yellow-700 px-1 text-white rounded-lg flex items-center gap-1 text-sm sm:text-base font-medium cursor-pointer"
                    onClick={() => handleLike(element)}
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
      )}
    </div>
  );
};

export default Like;
