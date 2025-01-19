import React from 'react'
import Image from 'next/image'
const page = () => {
  return (
    <div className='w-[95%] h-[50vh] mx-auto my-5 flex flex-col items-center justify-center gap-5'>
    {/* <Image src={"/nikeguy.svg"} alt='thankyou' width={60} height={60} /> */}
    <Image src={"/nike.svg"} alt='thankyou' width={150} height={150} className='my-10' />
      <h1 className='text-2xl font-medium'>Thank you for your order</h1>
      <p className='text-gray-500 text-sm my-1'>
        Your order has been placed and will be delivered soon.
      </p>
    </div>
  )
}

export default page
