import React from 'react';

export function AfricanPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="pattern"
          patternUnits="userSpaceOnUse"
          width="80"
          height="80"
          patternTransform="scale(1) rotate(45)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsl(var(--background))"
          />
          <path
            d="M20 20h10v10h-10z M50 50h10v10h-10z M20 50h10v10h-10z M50 20h10v10h-10z"
            strokeWidth="1"
            stroke="hsl(var(--accent) / 0.15)"
            fill="hsl(var(--accent) / 0.1)"
          ></path>
          <path
            d="M25 25L0 50 M50 0L25 25 M75 25L100 50 M50 50L75 25"
            strokeWidth="0.5"
            stroke="hsl(var(--accent) / 0.1)"
          ></path>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
    </svg>
  );
}
