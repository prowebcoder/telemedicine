"use client";
import React from "react";

export default function VideoHero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="w-full h-[420px] rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
          Feel your best in 2025
        </h2>

        {/* Play Button */}
        <button className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-md border border-white flex justify-center items-center hover:scale-105 transition-all cursor-pointer">
          <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[18px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
        </button>
      </div>
    </section>
  );
}
