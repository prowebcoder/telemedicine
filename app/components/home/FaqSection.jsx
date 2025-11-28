"use client";
import React, { useState } from "react";

const faqs = [
  {
    q: "Do I need a prescription?",
    a: "Some treatments require a consultation. If approved, a provider will prescribe it for you.",
  },
  {
    q: "How fast is delivery?",
    a: "Most orders are shipped within 24–48 hours with tracked delivery.",
  },
  {
    q: "Is my info secure?",
    a: "Your data is encrypted and protected under HIPAA-compliant systems.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
        FAQ
      </h2>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="w-full flex justify-between text-left text-lg font-medium text-gray-800"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              {item.q}
              <span className="text-2xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <p className="mt-3 text-gray-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button className="px-8 py-4 border rounded-full text-gray-800 font-semibold hover:bg-gray-100">
          View all FAQs →
        </button>
      </div>
    </section>
  );
}
