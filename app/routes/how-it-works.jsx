// app/routes/how-it-works.jsx
"use client";
import React from "react";

export default function HowItWorksPage() {
  const posts = [
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
    { title: "Lorem ipsum sed purus", category: "Sexual Health" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10">How it works</h1>

      {/* Hero Image */}
      <div className="w-full h-72 md:h-96 bg-gray-200 rounded-xl mb-8" />

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-12">
        <div className="w-3 h-3 bg-black rounded-full" />
        <div className="w-3 h-3 bg-gray-300 rounded-full" />
        <div className="w-3 h-3 bg-gray-300 rounded-full" />
        <div className="w-3 h-3 bg-gray-300 rounded-full" />
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {posts.map((p, i) => (
          <div key={i} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />
            <h3 className="font-semibold mb-1">{p.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{p.category}</p>
            <button className="w-full bg-black text-white py-2 rounded-full">
              Read more
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}

    </div>
  );
}
