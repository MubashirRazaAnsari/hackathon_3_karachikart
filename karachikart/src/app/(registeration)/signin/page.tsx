import React from "react";
import Image from "next/image";
import Link from "next/link";
const SignIn = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg m-10 flex flex-col justify-center items-center border">
      <div className="flex flex-col items-center gap-6 justify-center p-4">
        <Image src={"/nike.svg"} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold  text-center">
          YOUR ACCOUNT <br /> FOR EVERYTHING <br /> NIKE
        </h1>
      </div>

      <form className="flex flex-col gap-4 w-[80vw] md:max-w-[25vw]">
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
        </div>
        <div className="flex justify-between items-center gap-2 p-2">
            <div className="flex items-center gap-2">
                <input type="radio" className="rounded-sm" />
            <label htmlFor="remember">Keep me signed in</label>
          </div>
          <div className="flex items-center gap-2">
            <Link href={"/signup"} className="text-sm text-gray-500 hover:underline">Forgot your password?</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-6">
            <p className="text-sm text-gray-500 text-center">By logging in, you agree to Nike&apos;s <Link href={"/privacy"} className="text-blue-500 hover:text-blue-600 underline">Privacy Policy</Link> and <Link href={"/terms"} className="text-blue-500 hover:text-blue-600 underline">Terms of Use.</Link></p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 p-4">
          <button
            type="submit"
            className="bg-black text-white  p-2 rounded-md w-[300px] h-[3rem]"
        >
          Sign In
          </button>
          <p className="text-sm text-gray-500 text-center">Not a member? <Link href={"/signup"} className="text-blue-500 hover:text-blue-600 underline">Sign up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
