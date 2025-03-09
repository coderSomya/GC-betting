"use client";
import React from "react";
import { Meteors } from "./ui/meteors";

export function Motivation() {
  return (
    <div className="">
      <div className=" w-full relative max-w-xl">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            Why the heck does this exist?
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
           <li>
            Half of KGP doesn't give a fuck about <b>General Championship</b>, which i feel is one of the best things
            that campus has to offer. I guess its mostly because people are lazy. However if we hava something
            that gives them some incentive to bother about the games, it can help GC finds its spark in the campus.
           </li>
           <li>
            During Summer break, most mess remains closed. There are a lot of animals who do not have food to eat. I hate the fact
            that the administration can spend lacs on Fests, etc but are silent over this. So this platform becomes a source of 
            crowdfunding to arrange for the furry friends. 100% of money made will go into this.
           </li>
          </p>

          <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300">
            A useless button 
          </button>

          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
