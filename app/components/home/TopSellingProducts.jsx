"use client";
import React, { useState } from "react";

const tabs = [
  "Weight Loss & Sculpting",
  "Sexual Health",
  "Mental Health",
  "Sleep & Recovery",
  "Energy & Longevity",
  "Skin, Hair & Beauty",
];

// --- 8 PRODUCTS FOR EACH CATEGORY ---
const sampleProducts = [
  // WEIGHT LOSS
  { title: "Metabolic Boost Capsules", price: "$49", category: "Weight Loss & Sculpting" },
  { title: "Appetite Control Gummies", price: "$29", category: "Weight Loss & Sculpting" },
  { title: "Lean Sculpt Protein Mix", price: "$39", category: "Weight Loss & Sculpting" },
  { title: "Craving Block Spray", price: "$25", category: "Weight Loss & Sculpting" },
  { title: "Thermo Burn Drops", price: "$32", category: "Weight Loss & Sculpting" },
  { title: "Fat Burner Day Formula", price: "$45", category: "Weight Loss & Sculpting" },
 

  // SEXUAL HEALTH
  { title: "Libido Support Gummies", price: "$29", category: "Sexual Health" },
  { title: "Performance Power Capsules", price: "$39", category: "Sexual Health" },
  { title: "Stamina Boost Spray", price: "$34", category: "Sexual Health" },
  { title: "Testosterone Balance Tabs", price: "$49", category: "Sexual Health" },
  { title: "Women's Desire Support", price: "$42", category: "Sexual Health" },
  { title: "Drive Enhancement Drops", price: "$36", category: "Sexual Health" },
 

  // MENTAL HEALTH
  { title: "Stress Relief Herbal Tabs", price: "$22", category: "Mental Health" },
  { title: "Calm Mind Ashwagandha", price: "$18", category: "Mental Health" },
  { title: "Anxiety Ease Drops", price: "$32", category: "Mental Health" },
  { title: "Mood Stabilizer Capsules", price: "$29", category: "Mental Health" },
  { title: "Focus & Clarity Blend", price: "$35", category: "Mental Health" },
  { title: "Serotonin Support Formula", price: "$28", category: "Mental Health" },
 
  // SLEEP & RECOVERY
  { title: "Melatonin Sleep Spray", price: "$29", category: "Sleep & Recovery" },
  { title: "Deep Sleep Gummies", price: "$25", category: "Sleep & Recovery" },
  { title: "Recovery BCAA Drink Mix", price: "$39", category: "Sleep & Recovery" },
  { title: "Rest & Recharge Capsules", price: "$32", category: "Sleep & Recovery" },
  { title: "Magnesium Replenish Tabs", price: "$21", category: "Sleep & Recovery" },
  { title: "Night Repair Herbal Tea", price: "$18", category: "Sleep & Recovery" },
  
  // ENERGY & LONGEVITY
  { title: "Daily Energy B12 Spray", price: "$22", category: "Energy & Longevity" },
  { title: "Longevity Multivitamin", price: "$29", category: "Energy & Longevity" },
  { title: "Anti-Aging Collagen Boost", price: "$49", category: "Energy & Longevity" },
  { title: "Green Superfood Powder", price: "$39", category: "Energy & Longevity" },
  { title: "Vitality Adaptogen Blend", price: "$34", category: "Energy & Longevity" },
  { title: "Cell Renewal Formula", price: "$59", category: "Energy & Longevity" },
  
  // SKIN, HAIR & BEAUTY
  { title: "Acne & Skin Clearing Gel", price: "$32", category: "Skin, Hair & Beauty" },
  { title: "Hair Growth Support Serum", price: "$45", category: "Skin, Hair & Beauty" },
  { title: "Collagen Beauty Gummies", price: "$29", category: "Skin, Hair & Beauty" },
  { title: "Vitamin C Glow Drops", price: "$39", category: "Skin, Hair & Beauty" },
  { title: "Retinol Night Repair Cream", price: "$48", category: "Skin, Hair & Beauty" },
  { title: "Hydrating Hyaluronic Serum", price: "$41", category: "Skin, Hair & Beauty" },
  
];

export default function TopSellingProducts() {
  const [active, setActive] = useState(tabs[0]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
        Top Selling Products
      </h2>

      {/* Tabs */}
      <div className="flex gap-4  no-scrollbar pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full whitespace-nowrap border ${
              active === tab
                ? "bg-black text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {sampleProducts
          .filter((p) => p.category === active)
          .map((p, i) => (
            <div
              key={i}
              className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-full h-52 bg-gray-200 rounded-xl mb-4"></div>

              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="font-bold text-gray-800 text-xl">{p.price}</p>

              <button className="bg-black text-white w-full py-3 rounded-lg mt-4">
                Buy Now
              </button>
              <button className="border w-full py-3 rounded-lg mt-2">
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
