"use client";
import React, { useState } from "react";

export default function VideoSection({
  title = "Video Title",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MAIN SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="w-full h-[420px] rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300 flex flex-col justify-center items-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
            {title}
          </h2>

          {/* Play Button */}
          <button
            onClick={() => setOpen(true)}
            className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-md border border-white flex justify-center items-center hover:scale-110 transition-all cursor-pointer"
          >
            <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[18px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
          </button>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-4xl bg-black rounded-xl overflow-hidden relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white text-3xl"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            {/* Video Iframe */}
            <div className="w-full h-[300px] md:h-[500px]">
              <iframe
                className="w-full h-full"
                src={`${videoUrl}?autoplay=1`}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
