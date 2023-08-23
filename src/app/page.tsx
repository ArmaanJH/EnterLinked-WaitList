'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FIRESTORE_DB } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(null);

    try {
      await setDoc(doc(FIRESTORE_DB, 'waitlist', email), {
        email: email,
      });
      setIsSignedUp(true);
    } catch (error) {
      console.error("Error adding email to waitlist: ", error);
      setIsSignedUp(false);
    }
  }


  return (
    <main className="flex flex-col min-h-screen w-screen items-center justify-center bg-[#010312] relative">
      <Link href="https://twitter.com/Armaaniooo" className="absolute top-20 left-50 hidden lg:block bg-[#6abdff] rounded-full p-2 font-bold">Already signed up? Check us out on twitter!</Link>
      
      <div className='border-4 border-red-500 rounded-xl w-[80%] p-12'>
        <div className="flex flex-col place-items-center md:pt-24 md:pr-24 md:pl-24">
          <Image
            src="/images/enterlinked_logo_white_slim.png"
            alt="EnterLinked Logo"
            width={850}
            height={200}
            priority
          />
          <div className="pt-2 pb-2"></div>
          <h2 className="text-2xl font-thin text-center text-white lg:text-4xl">
            Sign up for the waitlist below.
          </h2>
\
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 w-full max-w-md">
            <input 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            />
            {emailError && <div className="text-red-500">{emailError}</div>}
            {isSignedUp ? (
              <button 
                type="button" 
                className="w-full p-2 bg-red-500 text-white rounded-md"
                disabled
              >
                Thanks for signing up!
              </button>
            ) : (
              <button 
                type="submit" 
                className="w-full p-2 bg-[#6abdff] text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-200"
              >
                Sign Up
              </button>
            )}
          </form>
          <Link href="/tmp_home" className="mt-8 block lg:hidden text-black">already a member?</Link>
        </div>
      </div>
    </main>
  );
}
