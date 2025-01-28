"use client";
import Image from "next/image";
// import { ProductCardProps } from "../components/Product-Card";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";
import { Product } from "@/types/productData";
import { EightProduct } from "@/sanity/lib/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  likeProduct,
  addToComparison,
  removeFromComparison,
  getComparison,
} from "../../redux/cartSlice";
export default function Home() {
  const dispatch = useDispatch();
  const comparison = useSelector(getComparison); // Comparison products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null); // Notification state
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const productFetchData: Product[] = await client.fetch(EightProduct);
        if (productFetchData.length === 0) {
          setErrorMessage("No products found.");
        } else {
          setProducts(productFetchData);
        }
      } catch (error: unknown) {
        if (error instanceof TypeError) {
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

      {/* Hero Section Start */}
      <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[100vh] bg-[url('/banner-image.png')] bg-cover bg-center bg-no-repeat">
        {/* Content Section */}
        <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 bg-[#FFF3E3] max-w-[90%] md:max-w-[50%] p-4 md:p-6 lg:p-10 flex flex-col gap-2">
          <p className="font-semibold text-sm md:text-base font-poppins">
            New Arrival
          </p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl xl:w-96 font-bold font-poppins text-[#B88E2F] leading-tight">
            Discover Our New Collection
          </h1>
          <p className="text-xs md:text-sm lg:text-lg font-medium font-poppins mt-2 md:mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>
          <button
            type="button"
            className="w-[180px] md:w-[200px] h-[50px] md:h-[60px] hover:bg-[#e2be69] bg-[#B88E2F] text-white text-xs md:text-sm lg:text-base font-bold font-poppins mt-4 md:mt-6"
          >
            Buy Now
          </button>
        </div>
      </div>
      {/* Hero Section End */}

      {/* Browse Range Start */}
      <div className="w-full mx-auto my-12 px-4">
        {/* Heading Section */}
        <div className="max-w-[90%] md:max-w-[559px] mx-auto mb-8 md:mb-16 text-center">
          <h2 className="font-poppins font-bold text-2xl md:text-[32px] leading-tight text-[#333333]">
            Browse The Range
          </h2>
          <p className="text-sm md:text-xl leading-6 md:leading-[30px] font-normal font-poppins text-[#666666] mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col md:flex-row justify-center md:justify- gap-8 md:gap-4">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/dining.png"
              alt="Dining"
              width={381}
              height={480}
              className="w-full max-w-[320px] md:max-w-[381px] h-auto"
            />
            <h3 className="text-center font-semibold text-lg md:text-2xl text-[#333333]">
              Dining
            </h3>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Image
              src="/living.png"
              alt="Living"
              width={381}
              height={480}
              className="w-full max-w-[320px] md:max-w-[381px] h-auto"
            />
            <h3 className="text-center font-semibold text-lg md:text-2xl text-[#333333]">
              Living
            </h3>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Image
              src="/bedroom.png"
              alt="Bedroom"
              width={381}
              height={480}
              className="w-full max-w-[320px] md:max-w-[381px] h-auto"
            />
            <h3 className="text-center font-semibold text-lg md:text-2xl text-[#333333]">
              Bedroom
            </h3>
          </div>
        </div>
      </div>
      {/* Browse Range End */}

      {/* Our Product Start */}
      <div className="xl:w-[1236px] mx-auto px-4 py-6">
        <div>
          {/* Section Title */}
          <h2 className="text-[32px] md:text-[40px] leading-[48px] font-poppins font-[750] text-center text-[#3A3A3A] mb-8 md:mb-16">
            Our Products
          </h2>

          {/* display product section start */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 w-full">
            {products.map((product: Product) => (
              <div
                className="relative w-[250px] xs:w-[280px] mx-auto group"
                key={product._id}
              >
                <Link href={`/shop/${product._id}`}>
                  <div className="relative ">
                    {product.productImage && (
                      <Image
                        src={urlFor(product.productImage).url()}
                        alt={product.title || "Product Image"}
                        className="rounded-lg w-full h-[320px]"
                        height={391}
                        width={481}
                      />
                    )}
                  </div>
                </Link>
                <div className="bg-[#eaedf2] p-4">
                  <h4 className="font-bold text-2xl mt-3">{product.title}</h4>
                  <p className="font-semibold text-xl mt-2">${product.price}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-white text-[#D89E00] w-full py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                    <div className="flex w-full gap-2 justify-center">
                      {/* Like */}
                      <button
                        onClick={() => handleLikeProduct(product)}
                        className="bg-[#D89E00] flex items-center gap-1 text-white px-3 py-2 rounded-lg"
                      >
                        <Image
                          src="/heart-white.png"
                          alt="Like Icon"
                          height={14}
                          width={14}
                        />
                        Like
                      </button>
                      {/* Add to Comparison */}
                      <button
                        onClick={() => {
                          if (
                            comparison.some((item) => item._id === product._id)
                          ) {
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* display product section end */}

          {/* button start */}
          <div className="flex justify-center my-8">
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
      </div>
      {/* Our Product End */}

      {/* beautiful section start */}
      <div className="h-[670px] w-full flex bg-[#FCF8F3] lg:flex-row flex-col">
        {/* Text Left Side */}
        <div className="flex flex-col my-auto gap-6 pl-6 md:pl-14 w-full lg:w-1/2">
          <div className="w-full md:w-[422px] h-auto flex flex-col gap-3">
            <h3 className="text-[32px] md:text-[40px]/[48px] text-[#3A3A3A] font-bold font-poppins">
              50+ Beautiful rooms inspiration
            </h3>
            <p className="text-sm md:text-base font-medium font-poppins text-[#616161]">
              Our designer already made a lot of beautiful prototipe of rooms
              that inspire you
            </p>
          </div>

          <button
            type="button"
            className="w-[176px] h-[48px] bg-[#B88E2F] hover:bg-[#e2be69] text-white text-base font-poppins font-semibold flex items-center justify-center"
          >
            Explore More
          </button>
        </div>

        {/* Images Section */}
        <div className="flex gap-5 relative justify-center items-center overflow-hidden max-h-[600px] lg:justify-start w-full lg:w-1/2 mt-6 lg:mt-0">
          {/* Main Image */}
          <div className="relative w-full max-w-[404px]">
            <Image
              src={"/room-1.png"}
              alt="bedroom image"
              layout="responsive"
              width={404}
              height={582}
            />
            <div className="absolute left-4 md:left-6 bottom-14 md:bottom-28 flex items-end">
              <div className="md:w-[217px] w-[150px] md:h-[130px] h-[100px] bg-white flex flex-col justify-center pl-5">
                <p className="text-sm md:text-base font-poppins text-[#616161] font-medium">
                  01 --- Bed Room
                </p>
                <h5 className="font-semibold font-poppins text-lg md:text-[28px]/[33.6px] text-[#3A3A3A]">
                  Inner Peace
                </h5>
              </div>
              <div className="h-10 w-10 bg-[#B88E2F] flex justify-center items-center">
                <Image
                  src={"/right-arrow.png"}
                  alt="arrow image"
                  height={12}
                  width={18}
                />
              </div>
            </div>
          </div>

          {/* Smaller Images */}
          <div className="flex flex-col w-full max-w-[280px] gap-6 lg:gap-12 lg:-mt-[35px]">
            <Image
              src={"/room-2.png"}
              alt="dining table image"
              layout="intrinsic"
              width={372}
              height={408}
              className="w-[300px] h-[350px] md:w-[372px] md:h-[408px] lg:w-[400px] lg:h-[500px] xl:h-[550px] max-w-full"
            />

            <Image
              src={"/Indicator.png"}
              alt="indicator"
              width={120}
              height={27}
              className="w-[120px] h-auto "
            />
          </div>

          {/* Small Side Image */}
          <div className="hidden lg:block lg:-mt-[109px]">
            <Image
              src={"/room-3.png"}
              alt="small image"
              width={52}
              height={70}
              className="w-[82px] h-auto"
            />
          </div>

          {/* Image Navigator */}
          <Image
            src={"/image-navigator.png"}
            alt="image navigator"
            width={48}
            height={48}
            className="absolute right-6 top-[60%] lg:right-12 lg:top-52"
          />
        </div>
      </div>
      {/* beautiful section end */}

      {/*FuniroFurniture start */}
      <div className="mt-16">
        <div className="px-4">
          <p className="font-poppins font-semibold text-center text-[#616161] text-lg md:text-xl/[30px]">
            Share your setup with
          </p>
          <h2 className="text-[#3A3A3A] font-poppins font-bold text-2xl/[32px] md:text-[40px]/[48px] text-center">
            #FuniroFurniture
          </h2>
        </div>

        <Image
          src={"/Images.png"}
          alt="h"
          height={721}
          width={1799}
          className="w-full h-auto object-cover"
        />
      </div>
      {/*FuniroFurniture end */}
    </div>
  );
}
