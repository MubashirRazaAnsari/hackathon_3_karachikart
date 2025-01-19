"use client";
import Link from "next/link";
import Summery from "@/app/components/Summery";
import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
const Checkout = () => {
  const { cart } = useCart();
  return (
    <div className=" w-full min-h-screen bg-white py-6 md:py-4 my-6 p-10">
      <div className="flex flex-col justify-between md:flex-row w-full gap-2 md:w-[90vw] lg:w-[70vw] mx-auto px-4">
        <section className="w-full md:w-2/3 lg:w-3/4 gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-4xl font-medium text-primary-dark mb-2">
                  How would you like to get your order?
                </h1>
                {/* <p className="text-sm text-gray-500">
                  Customs regulation for India require a copy of the recipient&apos;s
                  KYC. The address on the KYC needs to match the shipping
                  address. Our courier will contact you via SMS/email to obtain
                  a copy of your KYC. The KYC will be stored securely and used
                  solely for the purpose of clearing customs (including sharing
                  it with customs officials) for all orders and returns. If your
                  KYC does not match your shipping address, please click the
                  link for more information. Learn More
                </p> */}
              </div>
              <div className=" flex items-center w-1/2 my-10  border border-black p-6 rounded-lg hover:bg-gray-100 transition-colors gap-2">
                <Image
                  src={"/deliveryit.png"}
                  alt="delivery"
                  width={30}
                  height={30}
                />
                <Link
                  href={"/"}
                  className="w-full font-medium text-black text-lg"
                >
                  Delivery It
                </Link>
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-primary-dark mb-5">
            Your Information
          </h1>
          <form className="flex flex-col gap-4 w-full md:w-1/3 lg:w-2/3">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between gap-3">

              <input
                type="name"
                placeholder="First Name"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              <input
                type="name"
                placeholder="Last Name"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              </div>
              <div className="flex justify-between gap-3">


              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              </div>
              <input
                type="address"
                placeholder="Address line 1"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              <input
                type="address"
                placeholder="Address line 2"
                className="p-3 rounded-md border w-full h-[3rem]"
              />
              <div className="flex justify-between gap-2">
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="p-3 rounded-md border h-[3rem]"
                />

                <select className="p-3 rounded-md border w-full h-[3rem]">
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>
              <div className="flex justify-between gap-2">
                <input
                  type="text"
                  placeholder="State"
                  className="p-3 rounded-md border h-[3rem]"
                />
                <select className="p-3 rounded-md border w-full h-[3rem]">
                  <option value="Pakistan">Pakistan</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2">
              <div className="flex gap-2">
                <input
                  id="saveaddress"
                  type="checkbox"
                  className="rounded-sm"
                />
                <label htmlFor="saveaddress" className="text-sm text-gray-500">
                  Save this address to my Profile
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  id="saveaddress"
                  type="checkbox"
                  className="rounded-sm"
                />
                <label
                  htmlFor="preferaddress"
                  className="text-sm text-gray-500"
                >
                  Use this address as my preferred address
                </label>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-medium text-black mb-2">
                Contact Information
              </h1>
              <div className="flex flex-col gap-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="p-3 rounded-md border w-full h-[3rem]"
                />
                <p className="text-xs p-1 text-gray-500">
                  A carrier will contact you via SMS/email to obtain a copy of
                  your KYC.
                </p>
                <input
                  type="email"
                  placeholder="Email"
                  className="p-3 rounded-md border w-full h-[3rem]"
                />
                <p className="text-xs p-1 text-gray-500">
                  We will use this email to send you updates about your order.
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-medium text-black mb-2">
                PAN Number
              </h1>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="PAN Number"
                  className="p-3 rounded-md border w-full h-[3rem]"
                />
                <p className="text-xs p-1 text-gray-500">
                  Enter your PAN to enable payment with UPI, Net Banking or
                  local card methods
                </p>
              </div>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex gap-2">
                  <input
                    id="saveaddress"
                    type="checkbox"
                    className="rounded-sm"
                  />
                  <label
                    htmlFor="saveaddress"
                    className="text-sm text-gray-500"
                  >
                    Save PAN details to Nike Profile
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    id="saveaddress"
                    type="checkbox"
                    className="rounded-sm"
                  />
                  <label
                    htmlFor="preferaddress"
                    className="text-sm text-gray-500"
                  >
                    I have read and consent to eShopWorld processing my
                    information in accordance with the Privacy Statement and
                    Cookie Policy. eShopWorld is a trusted Nike partner.
                  </label>
                </div>
              </div>
            </div>
            <div className="flex p-10">
              <Link href={"/thankyou"}>
              <button className="bg-black text-white p-3 rounded-full w-[200px] ">
                Continue
              </button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 p-6">
              <Link href={"/"} className="text-xl text-gray-500 border-b pb-4 hover:text-black">Delivery</Link>
              <Link href={"/"} className="text-xl text-gray-500 border-b pb-4 hover:text-black">Shipping</Link>
              <Link href={"/"} className="text-xl text-gray-500 border-b pb-4 hover:text-black">
                Payment
              </Link>
              <Link href={"/"} className="text-xl text-gray-500 border-b pb-4 hover:text-black">
                Billing
              </Link>
            </div>
          </form>
        </section>
        <section className="w-full md:w-1/3 lg:w-1/3">
          <Summery />
          <div className="w-full">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-gray-200 pb-4"
              >
                <div className="flex items-center gap-4 p-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={140}
                    height={200}
                    className="shadow-md"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-500 text-sm gap-2">
                        Size <span className="font-medium">L</span>
                      </p>
                      <p className="text-gray-500 text-sm gap-2">
                        Quantity{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

  export default Checkout;
