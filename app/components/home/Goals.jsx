// app/components/home/Goals.jsx
"use client";
import React, { useState } from "react";

const weightGoals = [
  { id: "lose-weight", label: "Lose weight gradually & safely" },
  { id: "curb-appetite", label: "Curb appetite & reduce cravings" },
  { id: "all-above", label: "All of the above" },
];

export default function WeightGoalsForm() {
  const [selectedGoal, setSelectedGoal] = useState("");

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 bg-white rounded-md mb-10" style={{ backgroundImage:'url(https://cdn.shopify.com/s/files/1/2333/8415/files/gugu.png?v=1763378009)', backgroundSize:'100%', backgroundPosition:'center',backgroundRepeat:'no-repeat' }}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Reach your weight goals with expert care
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Tell us your weight goals
        </p>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-4 mb-8 w-100 mx-auto">
        {weightGoals.map((goal) => (
          <label
            key={goal.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedGoal === goal.id
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="weight-goal"
              value={goal.id}
              checked={selectedGoal === goal.id}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="hidden"
            />
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                selectedGoal === goal.id
                  ? "border-purple-500 bg-purple-500"
                  : "border-gray-400"
              }`}
            >
              {selectedGoal === goal.id && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-lg text-gray-800 font-medium">
              {goal.label}
            </span>
          </label>
        ))}
         <button
        disabled={!selectedGoal}
        className={`w-full  py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
          selectedGoal
            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
      </div>

      {/* Submit Button */}
     
    </section>
  );
}