"use client";
import React, { useState, useEffect } from "react";

export default function Loading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 300); // 500 milliseconds = 0.5 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  if (isLoading) {
    return (
      <main className="text-center">
        <div className="fixed top-0 left-0 bg-white dark:bg-[#010816] flex justify-center items-center w-full h-screen z-10">
          <span className="animated-text text-4xl font-bold letter-spacing-0">
            <span className="letter">A</span>
            <span className="letter">T</span>
            <span className="letter">R</span>
            <span className="letter">I</span>
            <span className="letter">P</span>
            <span className="letter">A</span>
          </span>
        </div>
      </main>
    );
  }

  return <div></div>;
}
