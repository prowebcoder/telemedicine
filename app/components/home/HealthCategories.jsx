// app/components/home/HealthCategories.jsx
"use client";
import React from "react";

const categories = [
  { title: "Lose extra", highlight: "Weight", color: "text-[#b012e0]" },
  { title: "Have longer", highlight: "Sex", color: "text-[#ff2a00]" },
  { title: "Have healthier", highlight: "Hair", color: "text-[#008c9e]" },
  { title: "Ease", highlight: "Anxiety", color: "text-[#007aff]", small: true },
  { title: "Enjoy", highlight: "Sex", color: "text-[#ff2a00]", small: true },
  { title: "Smooth", highlight: "Skin", color: "text-[#b012e0]", small: true },
];

export default function HealthCategories() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 text-left bg-white">
      {/* HEADER - Improved spacing and typography */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-[40px] md:text-[44px] font-extrabold text-[#0b0b0b] leading-tight tracking-tight mb-4">
          Rewrite the rules. <br />
          <span className="font-extrabold">Own your health.</span>
        </div>
        <p className="text-gray-600 text-[15px] leading-relaxed max-w-2xl mx-auto">
          No waiting rooms. No awkward pharmacy trips. Just real care, on your terms.
        </p>
      </div>

      {/* TOP 3 CARDS - Improved spacing and proportions */}
      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto mb-6">
        {categories.slice(0, 3).map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl bg-white p-8 flex flex-col justify-between items-center text-center hover:shadow-lg transition-all duration-300 min-h-[380px]"
          >
            <div className="flex flex-col text-[24px] font-bold text-[#0b0b0b] mb-6 leading-tight text-left w-full">
              {item.title}{" "}
              <span className={`${item.color} font-extrabold`}>
                {item.highlight}
              </span>
            </div>
            <div className="w-full h-[200px] bg-[#f5f5f7] rounded-lg mb-6 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image placeholder</span>
            </div>
            <p className="text-[14px] text-[#666] leading-relaxed px-2">
              Over 1000+ prescription meds at your fingertips
            </p>
          </div>
        ))}
      </div>

      {/* BOTTOM 3 SMALL CARDS - Improved alignment and spacing */}
      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
        {categories.slice(3).map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl bg-white p-6 flex items-start text-left hover:shadow-lg transition-all duration-300 min-h-[100px]"
          >
            <div className="w-[100px] h-[100px] bg-[#f5f5f7] rounded-lg mr-5 shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Icon</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[24px] font-bold text-[#0b0b0b] leading-tight mb-2">
                {item.title}{" "}
                <span className={`${item.color} font-extrabold`}>
                  {item.highlight}
                </span>
              </h4>
              <p className="text-[14px] text-[#666] leading-relaxed">
                Over 1000+ prescription meds at your fingertips
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}