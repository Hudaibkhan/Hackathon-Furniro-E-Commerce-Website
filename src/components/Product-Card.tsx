import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  image: string;
  discount?: string;
  discountBgColor?: string;
  name: string;
  description: string;
  discountedPrice: string;
  originalPrice?: string;
  showOverlay?: boolean; // Optional: to manually show overlay
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  discount,
  discountBgColor,
  name,
  description,
  discountedPrice,
  originalPrice,
  showOverlay = false, // Default is false
}) => {
  return (
    <Link href={"/singleProduct"}>
      <div className="relative w-[320px] sm:w-[280px] mx-auto group">
        <div className="flex flex-col relative transition-opacity duration-300">
          {/* Image Section */}
          <div className="relative w-full h-[300px] sm:h-[301px]">
            <Image
              src={image}
              alt="Product image"
              layout="fill"
              objectFit="cover"
              className=""
            />
            {discount && (
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full ${discountBgColor} absolute top-3 right-3 flex justify-center items-center`}
              >
                <p className="text-sm sm:text-base font-medium">{discount}</p>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="bg-[#F4F5F7] p-4 sm:p-6 flex-grow">
            <h4 className="font-semibold text-lg sm:text-2xl font-poppins">
              {name}
            </h4>
            <p className="text-sm sm:text-base font-medium text-[#898989] mt-1">
              {description}
            </p>
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <p className="font-poppins font-semibold text-base sm:text-xl">
                {discountedPrice}
              </p>
              {originalPrice && (
                <p className="font-poppins font-normal text-sm sm:text-base line-through text-[#B0B0B0]">
                  {originalPrice}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Overlay Section */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center gap-4 p-4 sm:p-6 transition-opacity duration-300 ${
            showOverlay || "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Link href={"/cart"}>
          <button
            type="button"
            className="text-[#D89E00] w-full sm:w-[80%] lg:w-[202px] h-12 bg-white font-semibold text-sm sm:text-base rounded-lg"
          >
            Add to cart
          </button>
          </Link>

          {/* Overlay Actions */}
          <div className="flex justify-between w-full sm:w-[80%] lg:w-[202px]">
            {/* Share */}
            <Link href={"/share"}>
              <div className="flex items-center gap-1 text-white cursor-pointer">
                <Image
                  src={"/share.png"}
                  alt="Share Icon"
                  height={16}
                  width={16}
                />
                <p className="text-xs sm:text-sm font-medium font-poppins">
                  Share
                </p>
              </div>
            </Link>

            {/* Compare */}
            <Link href={"/product-comparison"}>
              <div className="flex items-center gap-1 text-white cursor-pointer">
                <Image
                  src={"/compare.png"}
                  alt="Compare Icon"
                  height={16}
                  width={16}
                />
                <p className="text-xs sm:text-sm font-medium font-poppins">
                  Compare
                </p>
              </div>
            </Link>

            {/* Like */}
            <Link href={"/like"}>
              <div className="flex items-center gap-1 text-white cursor-pointer">
                <Image
                  src={"/heart-white.png"}
                  alt="Like Icon"
                  height={16}
                  width={16}
                />
                <p className="text-xs sm:text-sm font-medium font-poppins">
                  Like
                </p>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
