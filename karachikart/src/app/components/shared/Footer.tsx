'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribed with:', email)
    setEmail('')
  }

  return (
    <footer className='w-full bg-gray-100 z-50 text-black'>
      {/* Newsletter Section */}
      <div className='w-full h-1/2 bg-gray-100'>
      <div className='w-[100vw] px-10 md:px-6 md:w-[80vw] mx-auto bg-black text-white rounded-lg p-4 md:p-8 my-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-8 py-4 md:py-6'>
          <h2 className='text-2xl md:text-3xl lg:text-5xl font-bold max-w-md text-center md:text-left'>
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className='w-full md:w-auto'>
            <form onSubmit={handleSubscribe} className='flex flex-col gap-4'>
              <div className='relative'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  className='w-full w-full lg:w-[400px] h-12 px-12 rounded-full bg-white text-black'
                  required
                />
                <Image
                  src="/mail.svg"
                  alt="Email icon"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <button
                type='submit'
                className='w-full md:w-[400px] h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition-colors'
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>

      {/* Main Footer Content */}
      <div className='bg-gray-100 text-black'>
        <div className='w-[90vw] md:w-[80vw] mx-auto py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {/* Brand Section */}
            <div className='col-span-2 md:col-span-3 lg:col-span-2'>
              <h1 className='text-2xl font-bold mb-6'>Karachi<span className='text-red-500'>KART</span></h1>
              <p className='text-gray-600 mb-6 max-w-md'>
                We have clothes that suits your style <br /> and which you&apos;re proud to wear. <br /> From women to men.
              </p>
              <div className='flex gap-4'>
                <Link href="/" className='w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-gray-200'>
                  <FaTwitter className='w-5 h-5 text-black' />
                </Link>
                <Link href="/" className='w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-gray-200'>
                  <FaFacebookF className='w-5 h-5 text-black' />
                </Link>
                <Link href="/" className='w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-gray-200'>
                  <FaInstagram className='w-5 h-5 text-black' />
                </Link>
                <Link href="/" className='w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-gray-200'>
                  <FaGithub className='w-5 h-5 text-black' />
                </Link>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className='font-bold mb-6 text-black'>COMPANY</h3>
              <ul className='space-y-4'>
                <li><Link href="/" className='text-gray-600 hover:text-black'>About</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Features</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Works</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Career</Link></li>
              </ul>
            </div>

            {/* Help Links */}
            <div>
              <h3 className='font-bold mb-6 text-black'>HELP</h3>
              <ul className='space-y-4'>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Customer Support</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Delivery Details</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Terms & Conditions</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Privacy Policy</Link></li>
              </ul>
            </div>

            {/* FAQ Links */}
            <div>
              <h3 className='font-bold mb-6 text-black'>FAQ</h3>
              <ul className='space-y-4'>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Account</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Manage Deliveries</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Orders</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Payments</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className='font-bold mb-6 text-black'>RESOURCES</h3>
              <ul className='space-y-4'>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Free eBooks</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Development Tutorial</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>How to - Blog</Link></li>
                <li><Link href="/" className='text-gray-600 hover:text-black'>Youtube Playlist</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='border-t '>
        <div className='w-[90vw] md:w-[80vw] mx-auto py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-400 text-center md:text-left'>
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Image
              src="/visa.png"
              alt="Visa"
              width={40}
              height={25}
              className="h-6 w-auto"
            />
            <Image
              src="/master.png"
              alt="Mastercard"
              width={40}
              height={25}
              className="h-6 w-auto"
            />
            <Image
              src="/paypal.png"
              alt="PayPal"
              width={40}
              height={25}
              className="h-6 w-auto"
            />
            <Image
              src="/applepay.png"
              alt="Apple Pay"
              width={40}
              height={25}
              className="h-6 w-auto"
            />
            <Image
              src="/googlepay.png"
              alt="Google Pay"
              width={40}
              height={25}
              className="h-6 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
