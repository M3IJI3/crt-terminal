'use client'

import { useEffect, useRef } from 'react';

export default function DonutAsciiPure() {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let A = 1, B = 1;
    let tmr: NodeJS.Timeout | undefined;

    const frame = () => {
      const b = [] as string[];
      const z = [] as number[];
      const width = 120, height = 35;

      A += 0.07;
      B += 0.03;

      const cA = Math.cos(A), sA = Math.sin(A);
      const cB = Math.cos(B), sB = Math.sin(B);

      for (let k = 0; k < width * height; k++) {
        b[k] = k % width === width - 1 ? '\n' : ' ';
        z[k] = 0;
      }

      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i), cp = Math.cos(i);
          const h = ct + 2;
          const D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;

          const x = Math.floor(60 + 40 * D * (cp * h * cB - t * sB));
          const y = Math.floor(17 + 20 * D * (cp * h * sB + t * cB));
          const o = x + width * y;
          const N = Math.floor(
            8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB)
          );

          if (y >= 0 && y < height && x >= 0 && x < width && D > z[o]) {
            z[o] = D;
            b[o] = '.,-~:;=!*#$@'[Math.max(0, N)];
          }
        }
      }

      if (ref.current) ref.current.innerText = b.join('');
    };

    tmr = setInterval(frame, 50);
    return () => clearInterval(tmr);
  }, []);

  return (
    // <div className="w-screen h-screen bg-[#0f0c07] text-[#f1c16f] font-mono flex items-center justify-center overflow-hidden relative">
      <pre
        ref={ref}
        className="text-[20px] leading-[14px] whitespace-pre overflow-hidden"
      />
    // </div>
  );
}
