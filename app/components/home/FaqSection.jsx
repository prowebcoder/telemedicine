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
    <section className="max-w-7xl mx-auto px-6 py-20">
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
        <button className="px-20 py-4 border rounded-full text-gray-800 font-semibold hover:bg-gray-100 flex items-center gap-2 justify-center mx-auto">
          View all FAQs 
<svg width="32" height="14" viewBox="0 0 32 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.281 6.21995C31.3508 6.28962 31.4063 6.37238 31.4441 6.4635C31.4819 6.55462 31.5013 6.6523 31.5013 6.75095C31.5013 6.8496 31.4819 6.94728 31.4441 7.0384C31.4063 7.12952 31.3508 7.21228 31.281 7.28195L25.281 13.2819C25.2113 13.3517 25.1285 13.407 25.0374 13.4447C24.9463 13.4825 24.8486 13.5019 24.75 13.5019C24.5508 13.5019 24.3598 13.4228 24.219 13.2819C24.0782 13.1411 23.9991 12.9501 23.9991 12.7509C23.9991 12.5518 24.0782 12.3608 24.219 12.2199L28.9395 7.50095H0.75C0.551088 7.50095 0.360322 7.42193 0.21967 7.28128C0.0790176 7.14063 0 6.94986 0 6.75095C0 6.55204 0.0790176 6.36127 0.21967 6.22062C0.360322 6.07996 0.551088 6.00095 0.75 6.00095H28.9395L24.219 1.28195C24.0782 1.14112 23.9991 0.950111 23.9991 0.750948C23.9991 0.551784 24.0782 0.360778 24.219 0.219948C24.3598 0.0791176 24.5508 1.48389e-09 24.75 0C24.9492 -1.48389e-09 25.1402 0.0791176 25.281 0.219948L31.281 6.21995Z" fill="#020716"/>
</svg>

        </button>
      </div>
    </section>
  );
}
