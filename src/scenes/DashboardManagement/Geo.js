import React, { useState } from 'react';

const Dancing = () => {
  const text = "LETS   CREATE   SOMTHING   HERE ";
  const letters = text.split(''); // Split text into an array of characters

  const randomColor = () => {
    // Generate a random neon-like color
    const colors = ['#ff00ff', '#00ffff', '#ff9900', '#ff0000', '#00ff00'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const randomDuration = () => {
    // Generate a random animation duration between 0.5 and 2 seconds
    return `${Math.random() * 1.5 + 0.5}s`;
  };

  const randomMovement = () => {
    // Generate random movement values
    const x = Math.random() * 20 - 10; // Movement between -10px to 10px on X-axis
    const y = Math.random() * 20 - 10; // Movement between -10px to 10px on Y-axis
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <style>
        {`
          @keyframes dancing {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -10px) rotate(5deg); }
          }
        `}
      </style>
      <h1 className="text-5xl font-bold">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block"
            style={{
              color: randomColor(),
              animation: `dancing ${randomDuration()} ease-in-out infinite`,
              transform: randomMovement(),
              transition: 'transform 0.2s',
              textShadow: `0px 0px 10px ${randomColor()}`, // Neon effect
            }}
          >
            {letter === ' ' ? '\u00A0' : letter} {/* Handle spaces */}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Dancing;
