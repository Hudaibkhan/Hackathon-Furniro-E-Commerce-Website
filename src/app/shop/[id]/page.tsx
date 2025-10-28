"use client";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";
import { Product } from "@/types/productData";
import { groq } from "next-sanity";
import { fourProduct } from "@/sanity/lib/queries";
import { useAppDispatch } from "../../../../hooks/redux";
import {
  addToCart,
  addToComparison,
  likeProduct,
  unlikeProduct,
  removeFromComparison,
  getComparison,
  getLikedProducts
} from "../../../../redux/cartSlice";
import { useSelector } from "react-redux";

const Page = () => {
  const [id, setId] = useState<string | null>(null);
  const likedProducts = useSelector(getLikedProducts); // liked products state

  useEffect(() => {
    // Extract the dynamic ID from the URL path
    const path = window.location.pathname; // Example: /shop/123
    const extractedId = path.split("/").pop(); // Get the last segment of the URL

    if (extractedId) {
      setId(extractedId); // Update the state with the ID
    } else {
      setErrorMessage("Product ID is missing.");
    }
  }, []); // Run once on component mount

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return; // Wait until ID is available

      try {
        const productFetchData: Product[] = await client.fetch(
          groq`*[_type == "product" && _id == $id]{
            _id,
            title,
            isNew,
            description,
            discountPercentage,
            price,
            productImage,
            tags
          }`,
          { id }
        );

        if (productFetchData.length > 0) {
          setProduct(productFetchData[0]);
        } else {
          setErrorMessage("No product found for the given ID.");
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message.includes("NetworkError")
        ) {
          setErrorMessage(
            "Network error. Please check your internet connection."
          );
        } else {
          setErrorMessage(
            "Error fetching product data. Please try again later."
          );
        }
      }
    };

    fetchProductData();
  }, [id]); // Fetch product data whenever `id` changes


  const dispatch = useAppDispatch();
  const [relatedProduct, setRelatedProduct] = useState<Product[]>([]);
  const comparison = useSelector(getComparison); // Comparison products state
  const [notification, setNotification] = useState<string | null>(null); // Notification state

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
    triggerNotification(`You liked ${product.title}. 🤍`);
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
  const handleRemoveFromComparison = (productId: string) => {
    // Remove product from the comparison array
    dispatch(removeFromComparison(productId));
  };

  // individual product work start
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [product, setProduct] = useState<Product | null>(null);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const productFetchData: Product[] = await client.fetch(fourProduct);
        setRelatedProduct(productFetchData);
      } catch (error: unknown) {
        // Check if the error is an instance of the Error class
        if (error instanceof Error) {
          if (error.message.includes("NetworkError")) {
            setErrorMessage(
              "Network error. Please check your internet connection."
            );
          } else {
            setErrorMessage(
              "Error fetching related products. Please try again later."
            );
          }
        } else {
          // Handle cases where the error isn't an instance of Error
          setErrorMessage("An unknown error occurred. Please try again.");
        }
      }
    };
    fetchRelatedProducts();
  }, []);

  // Handle loading state, error state, and display the fallback message
  if (errorMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <p className="text-lg text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#B88E2F] rounded-full animate-spin"></div>
          <p className="mt-4 font-poppins text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // individual product work end
  return (
    <div>
      {/* Notification Section */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#D89E00] text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}
      {/* head section start*/}
      <div className="bg-[#F9F1E7] ">
        <div className="h-[100px] max-w-[1400px] pl-2 gap-4 md:gap-8 flex items-center xl:pl-12 mx-auto">
          <div className=" flex gap-4 items-center">
            <Link href={"/"}>
              <p className="font-poppins hover:text-yellow-700 text-base font-normal text-[#9F9F9F]">
                Home
              </p>
            </Link>
            <FaChevronRight />
          </div>

          <div className=" flex gap-4 items-center">
            <Link href={"/shop"}>
              <p className="font-poppins hover:text-yellow-700 text-base font-normal text-[#9F9F9F]">
                Shop
              </p>
            </Link>
            <FaChevronRight />
          </div>

          <div className="border-l items-center h-[40px] w-[120px] flex justify-end border-gray-700 pt-2 lg:pt-0">
            <p className="text-sm md:text-base text-center lg:text-left">
              {product.title}
            </p>
          </div>
        </div>
      </div>
      {/* head section end*/}

      {/* Single Product Section Start */}
      <div className="bg-[#FAFAFA] py-10">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10 flex flex-col md:flex-row gap-6 lg:gap-16">
          {/* Image Section Start */}
          <div className="w-full md:w-[50%] flex flex-col items-center gap-5">
            <div className="w-full max-w-[423px] bg-[#F9F1E7] flex justify-center items-center rounded-xl">
              {product.productImage && (
                <Image
                  src={urlFor(product.productImage).url()}
                  alt="Single Product"
                  className="rounded-lg object-cover"
                  width={423}
                  height={500}
                />
              )}
            </div>
          </div>
          {/* Image Section End */}

          {/* Details Section Start */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              {product?.title}
            </h2>
            <p className="text-[#9F9F9F] font-poppins text-xl md:text-2xl">
              ${product?.price}
            </p>

            <div className="flex items-center gap-4 md:gap-5">
              <Image src="/rating.png" alt="rating" width={124} height={20} />
              <div className="border-l-2 border-gray-700 pl-4">
                <p className="text-[#9F9F9F] text-sm md:text-base">
                  5 Customer Reviews
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-[#6D6D6D] leading-relaxed">
              {`${product?.description.substring(0, 250)}...`}
            </p>

            {/* Size Section */}
            <div>
              <p className="text-[#9F9F9F] font-medium mb-2">Size</p>
              <div className="flex gap-3 md:gap-4">
                {["L", "XL", "XS"].map((size) => (
                  <button
                    key={size}
                    className="w-10 h-10 rounded-md flex items-center justify-center bg-[#F9F1E7] hover:bg-[#B88E2F] hover:text-white transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Section */}
            <div>
              <p className="text-[#9F9F9F] font-medium mb-2">Color</p>
              <div className="flex gap-3 md:gap-4">
                {["#816DFA", "#000000", "#B88E2F"].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="h-12 w-[150px] md:w-[150px] hover:bg-[#D89E00] lg:w-[215px] border border-black text-base lg:text-xl font-medium rounded-md flex items-center justify-center transition  hover:text-white"
              >
                Add To Cart
              </button>
              <button
                onClick={() => {
                  if (comparison.some((item) => item._id === product._id)) {
                    handleRemoveFromComparison(product._id); // Call the remove function if already in comparison
                  } else {
                    handleAddToComparison(product); // Call the add function if not in comparison
                  }
                }}
                className={`py-2 px-3 rounded-lg ${
                  comparison.some((item) => item._id === product._id)
                    ? "bg-gray-500 text-white text-xs" // Styling for "Remove from Comparison"
                    : "bg-[#D89E00] text-white" // Styling for "Add to Comparison"
                }`}
              >
                {comparison.some((item) => item._id === product._id)
                  ? "Remove from Comparison"
                  : "Add to Comparison"}
              </button>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Product Details */}
            <div className="text-[#9F9F9F] space-y-4 text-sm lg:text-base">
              <div className="flex justify-between">
                <p>SKU:</p> <p>SS001</p>
              </div>
              <div className="flex justify-between">
                <p>Category:</p> <p>Sofas</p>
              </div>
              <div className="flex justify-between">
                <p>Tags:</p> <p>Sofa, Chair, Home, Shop</p>
              </div>
              <div className="flex justify-between">
                <p>Share:</p>
                <div className="flex items-center gap-3 md:gap-4">
                  {["facebook", "linkedin", "twitter"].map((platform) => (
                    <Image
                      key={platform}
                      src={`/${platform}.png`}
                      alt={`${platform} icon`}
                      width={20}
                      height={20}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Details Section End */}
        </div>
      </div>
      {/* Single Product Section End[150px]

      <hr />

      {/* details, additional information section start */}
      <div className="max-w-[1440px] mx-auto space-y-10 py-10 px-4 md:px-8">
        {/* Tabs Section */}
        <div className="w-full max-w-[649px] flex justify-between items-center mx-auto flex-wrap">
          <h3 className="text-xl md:text-2xl font-poppins font-medium">
            Description
          </h3>
          <h3 className="text-xl md:text-2xl font-poppins font-normal text-[#9F9F9F]">
            Additional Information
          </h3>
          <h3 className="text-xl md:text-2xl font-poppins font-normal text-[#9F9F9F]">
            Reviews [5]
          </h3>
        </div>

        {/* Description Section */}
        <div className="w-full max-w-[1026px] mx-auto flex flex-col space-y-6 mt-20">
          <p className="font-poppins text-sm md:text-base font-normal text-[#9F9F9F] leading-relaxed">
            Embodying the raw, wayward spirit of rock ‘n’ roll, the Kilburn
            portable active stereo speaker takes the unmistakable look and sound
            of Marshall, unplugs the chords, and takes the show on the road.
          </p>
          <p className="font-poppins text-sm md:text-base font-normal text-[#9F9F9F] leading-relaxed">
            Weighing in under 7 pounds, the Kilburn is a lightweight piece of
            vintage styled engineering. Setting the bar as one of the loudest
            speakers in its class, the Kilburn is a compact, stout-hearted hero
            with a well-balanced audio which boasts a clear midrange and
            extended highs for a sound that is both articulate and pronounced.
            The analogue knobs allow you to fine tune the controls to your
            personal preferences while the guitar-influenced leather strap
            enables easy and stylish travel.
          </p>
        </div>

        {/* Images Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mx-auto items-center w-full max-w-[1239px]">
          <Image
            src="/sofa-1.png"
            alt="sofa image"
            className="w-full lg:w-[48%] h-auto object-cover"
            height={348}
            width={605}
          />
          <Image
            src="/sofa-2.png"
            alt="sofa image"
            className="w-full lg:w-[48%] h-auto object-cover"
            height={348}
            width={605}
          />
        </div>
      </div>
      {/* details, additional information section end */}

      <hr />

      {/* related product section start */}
      <div className="max-w-[1440px] mx-auto py-16 space-y-10">
        <h2 className="text-4xl/[54px] font-medium font-poppins text-center">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-fit">
             {relatedProduct.map((product: Product) => (
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

        {/* button start */}
        <div className="flex justify-center">
          <Link href="/shop">
            <button
              type="button"
              className=" w-[245px] h-[48px] border border-[#B88E2F] hover:bg-[#FCF8F3] text-[#B88E2F] font-semibold text-base font-poppins items-center justify-center"
            >
              Show More
            </button>
          </Link>
        </div>
        {/* button end */}
      </div>

      {/* related product section end */}

      <hr />
    </div>
  );
};

export default Page;
