import Image from "next/image";
import ProductCard from "@/components/Product-Card";
import CustomerCare from "@/components/Customer-Care";
import Banner from "@/components/Banner";
import Link from "next/link";

export const products = [
  {
    id: 1,
    image: "/image-1.png",
    name: "Syltherine",
    description: "Stylish cafe chair",
    discountedPrice: "Rp 2.500.000",
    originalPrice: "Rp 3.500.000",
    discountBgColor: "bg-[#E97171]",
    discount: "-30%",
  },
  {
    id: 2,
    image: "/images-2.png",
    name: "Leviosa",
    description: "Stylish cafe chair",
    discountedPrice: "Rp 2.500.000",
    showOverlay: true,
  },
  {
    id: 3,
    image: "/images-3.png",
    name: "Lolito",
    description: "Luxury big sofa",
    discountedPrice: "Rp 7.000.000",
    originalPrice: "Rp 14.000.000",
    discountBgColor: "bg-[#E97171]",
    discount: "-50%",
  },
  {
    id: 4,
    image: "/image-4.png",
    name: "Respira",
    description: "Outdoor bar table and stool",
    discountedPrice: "Rp 500.000",
    discountBgColor: "bg-[#2EC1AC]",
    discount: "New",
  },
];

export default function Shop() {
  return (
    <div>
      {/* Banner Section */}
      <Banner name="Shop" />

      {/* Filter and Sorting Section */}
      <div className="bg-[#F9F1E7]">
        <div className="h-auto mx-auto max-w-[1400px] mb-8 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-4 ">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Image src="/filtering.png" alt="filter image" height={25} width={25} />
              <p className="font-poppins text-base md:text-xl font-normal">Filter</p>
            </div>
            <div className="flex gap-4">
              <Image src="/view-list.png" alt="view list" height={25} width={25} />
              <Image src="/grid-round.png" alt="grid view" height={25} width={25} />
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-gray-400 pt-2 lg:pt-0">
              <p className="text-sm md:text-base text-center lg:text-left">
                Showing 1–16 of 32 results
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mt-4 lg:mt-0 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <p className="text-base md:text-xl font-normal">Show</p>
              <span className="bg-white px-4 py-2 rounded-lg">16</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-base md:text-xl font-normal">Sort By</p>
              <span className="bg-white px-4 py-2 rounded-lg">Default</span>
            </div>
          </div>
        </div>
      </div>
      {/* Product Grid */}
      <div className="lg:w-[1236px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
          {products.map((product) => (
            <Link key={product.id} href={`/singleProduct/${product.id}`}>
              <ProductCard
                image={product.image}
                name={product.name}
                description={product.description}
                discountedPrice={product.discountedPrice}
                originalPrice={product.originalPrice}
                discountBgColor={product.discountBgColor}
                discount={product.discount}
                showOverlay={product.showOverlay}
              />
            </Link>
          ))}
          {products.map((product) => (
            <Link key={product.id} href={`/singleProduct/${product.id}`}>
              <ProductCard
                image={product.image}
                name={product.name}
                description={product.description}
                discountedPrice={product.discountedPrice}
                originalPrice={product.originalPrice}
                discountBgColor={product.discountBgColor}
                discount={product.discount}
              />
            </Link>
          ))}
          {products.map((product) => (
            <Link key={product.id} href={`/singleProduct/${product.id}`}>
              <ProductCard
                image={product.image}
                name={product.name}
                description={product.description}
                discountedPrice={product.discountedPrice}
                originalPrice={product.originalPrice}
                discountBgColor={product.discountBgColor}
                discount={product.discount}
              />
            </Link>
          ))}
          {products.map((product) => (
            <Link key={product.id} href={`/singleProduct/${product.id}`}>
              <ProductCard
                image={product.image}
                name={product.name}
                description={product.description}
                discountedPrice={product.discountedPrice}
                originalPrice={product.originalPrice}
                discountBgColor={product.discountBgColor}
                discount={product.discount}
              />
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 my-12">
          <button className="bg-[#B88E2F] text-white px-4 py-2 rounded-lg">1</button>
          <button className="bg-[#F9F1E7] px-4 py-2 rounded-lg">2</button>
          <button className="bg-[#F9F1E7] px-4 py-2 rounded-lg">3</button>
          <button className="bg-[#F9F1E7] px-4 py-2 rounded-lg">Next</button>
        </div>
      </div>

      {/* Customer Care Section */}
      <CustomerCare />
    </div>
  );
}
