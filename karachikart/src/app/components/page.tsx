"use client";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import PageHeader from "@/app/components/shared/PageHeader";
import Image from "next/image";



interface Shop {
  itemName: string;
  price: number;
  oldPrice: number;
  imageUrl: string;
  slug: { current: string };
}

async function fetchShops() {
  const query = `*[_type == "shop"]
  {
    itemName,
    price,
    oldPrice,
    "imageUrl": image.asset->url,
    slug
  }`;
  const shops: Shop[] = await client.fetch(query);
  return shops;
}

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [showCount, setShowCount] = useState<string>("Default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(100);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadShops = async () => {
      const fetchedShops = await fetchShops();
      setShops(fetchedShops);
    };
    loadShops();
  }, []);

  // Handle sorting
  const sortShops = () => {
    const sortedShops = [...shops];
    if (sortBy === "Price: Low to High") {
      sortedShops.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      sortedShops.sort((a, b) => b.price - a.price);
    }
    return sortedShops;
  };

  // Filter by search query and price range
  const filteredShops = () =>
    sortShops().filter(
      (shop) =>
        shop.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        shop.price <= priceRange
    );

  // Paginated data
  const paginatedShops = () => {
    const filtered = filteredShops();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Total pages
  const totalPages = Math.ceil(filteredShops().length / itemsPerPage);

  const categories = [
    "Sandwiches",
    "Burger",
    "Chicken Chup",
    "Drink",
    "Pizza",
    "Dessert",
    "Non Veg",
    "Uncategorized",
  ];

  return (
    <div className="bg-white">
       <PageHeader title='Shop List' currentPage='Shop List' />
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="lg:w-3/4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center mb-8 p-4 gap-4">
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border text-gray-400 p-2 rounded"
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Show:</span>
            <select
              value={showCount}
              onChange={(e) => setShowCount(e.target.value)}
              className="border text-gray-400 p-2 rounded"
            >
              <option>Default</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        {/* Shop List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-6">
          {paginatedShops().map((shop) => (
            <div
              key={shop.slug.current}
              className="border rounded-lg overflow-hidden group"
            >
              <Link href={`/shop/${shop.slug.current}`} className="hover:text-orange-500 hover:transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Image
                    src={shop.imageUrl}
                    alt={shop.itemName}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-lg">
                    Sale!
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{shop.itemName}</h3>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <p className="text-orange-500">${shop.price}</p>
                  <p className="text-[#828282] line-through">
                    ${shop.oldPrice}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-orange-500 hover:text-white"
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded hover:bg-orange-500 hover:text-white"
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/4 lg:pl-8 mt-8 lg:mt-0">
        {/* Search */}
        <div className="mb-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Search Product"
              className="flex-1 border p-2 rounded-l focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-orange-500 text-white px-4 rounded-r">
            <CiSearch />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Category</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Product */}
        <div
          className="w-[248px] h-[286px] p-6 rounded-lg mb-8"
          style={{
            backgroundImage: "url('/feature.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <h3 className="text-xl font-bold mb-2">Perfect Taste</h3>
          <h2 className="text-2xl font-bold mb-4">Classic Restaurant</h2>
          <div className="text-orange-500 text-xl font-bold mb-4">45.00$</div>
          <button className="text-white border border-white px-4 py-2 rounded hover:bg-orange-500 hover:border-orange-500 transition-colors">
            Shop Now
          </button>
        </div>

        {/* Price Filter */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Filter By Price</h3>
          <div className="flex flex-col ">
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-gray-400">
            <span className="text-lg">From $0 to ${priceRange}</span>
            <span className="text-lg">Filter</span>
            </div>
          </div>
        </div>
        
              {/* Latest product */}
              <div>
          <h3 className="text-2xl font-semibold mb-4">Latest Products</h3>
          <div>
            {shops.slice(0, 4).map((shop) => (
              <div key={shop.slug.current} className="mb-4 flex items-center gap-4">
                <Image
                  src={shop.imageUrl}
                  alt={shop.itemName}
                  width={64}
                  height={64}
                  className="flex-shrink-0"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold text-lg">{shop.itemName}</h1>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-orange-500">★</span>
                    <span className="text-orange-500">★</span>
                    <span className="text-orange-500">★</span>
                    <span className="text-orange-500">★</span>
                    <span className="text-orange-500">★</span>
                  </div>
                  <p className="mt-2">Price: ${shop.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
          
          {/*  product Tags*/}  
          <div>
          <h3 className="text-2xl font-semibold mb-4"> Product Tags</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 text-lg text-gray-700 underline underline-offset-4 ">
            <span className=" hover:text-orange-500 underline ">Services</span>
            <span className=" hover:text-orange-500 underline ">Our Menu</span>
            <span className=" hover:text-orange-500 underline ">Pizza</span>
            <span className=" hover:text-orange-500 underline ">Cupcake</span>
            <span className=" hover:text-orange-500 underline ">Burger</span>
            <span className=" hover:text-orange-500 underline ">Cookies</span>
            <span className=" hover:text-orange-500 underline ">Our Shop</span>
            <span className=" hover:text-orange-500 underline ">TandoriChicken</span>
          </div>
          </div>
      </div>
    </div>
    </div>
  );
}
