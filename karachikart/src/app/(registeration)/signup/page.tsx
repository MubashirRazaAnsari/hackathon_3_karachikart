import React from "react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg m-10 flex flex-col justify-center items-center border">
      <div className="flex flex-col items-center gap-6 justify-center p-4">
        <Image src={"/nike.svg"} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold  text-center">
          YOUR ACCOUNT <br /> FOR EVERYTHING <br /> NIKE
        </h1>
      </div>

      <form className="flex flex-col gap-4 w-[80vw] md:max-w-[26vw]">
        <div className="flex flex-col gap-3">
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
          <input
            type="date"
            placeholder="Date of Birth"
            className="p-3 rounded-md border w-full h-[3rem]"
          />
          <div className="flex justify-between items-center gap-2">
            <div>
              <label htmlFor="gender">Gender</label>
              <select className="p-3 rounded-md border w-full h-[3rem]">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <select className="p-3 rounded-md border w-full h-[3rem]">
                <option value="Pakistan">Pakistan</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 p-2">
          <div className="flex items-center justify-center gap-2">
            <input type="checkbox" className="rounded-sm mb-5" />
            <label htmlFor="remember">
              Sign up for emails to get updates from Nike on products, offers
              and your Member benefits
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-6">
          <p className="text-sm text-gray-500 text-center">
            By signing up, you agree to Nike&apos;s{" "}
            <Link
              href={"/privacy"}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href={"/terms"}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Terms of Use.
            </Link>
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 p-4">
          <button
            type="submit"
            className="bg-black text-white  p-2 rounded-md w-[300px] h-[3rem]"
          >
            Sign Up
          </button>
          <p className="text-sm text-gray-500 text-center">
            Already a member?{" "}
            <Link
              href={"/signin"}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default page;
