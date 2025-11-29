// app/routes/treatments.jsx
"use client";
import React from "react";
import FaqSection from "~/components/home/FaqSection";

export default function TreatmentsPage() {
  const categories = [
    {
      title: "Weight Loss & Sculpting",
      desc: "Sculpt your body and burn fat with peptides + GLP-1s",
    },
    {
      title: "Sexual Health",
      desc: "Proven solutions for ED, stamina, and outbreak relief",
    },
    {
      title: "Mental Health",
      desc: "Support for stress, anxiety, and focus",
    },
    {
      title: "Sleep & Recovery",
      desc: "Deep sleep, better nights, faster recovery",
    },
    {
      title: "Energy & Longevity",
      desc: "Peptides for energy, endurance, and anti-aging",
    }
    ,
    {
      title: "Skin, Hair & Beauty",
      desc: "Peptides, stem cells, and treatments for rejuvenation",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <h1 className="text-4xl font-bold leading-tight mb-10">
        Find the right care.<br />Choose a category to begin<br />a short consultation.
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {categories.map((c, i) => (
          <div key={i} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{c.desc}</p>
            <div className="w-full h-40 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Not sure section */}
      <div className="text-center mb-20">
        <h2 className="text-2xl font-semibold mb-4">Not sure what you need?</h2>
        <p className="text-gray-600 mb-6">
          We’ll help you figure it out with a short, guided consultation.
        </p>
        <a
          href="/consultation"
          className="bg-black text-white px-8 py-3 rounded-full inline-block"
        >
          Begin Consultation
        </a>
      </div>

      {/* Dark CTA bottom */}


      <FaqSection />
    </div>
  );
}
