"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-black text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
              absolute inset-0 opacity-100 will-change-transform
              [background-image:var(--dark-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              filter blur-[10px]
              after:content-[""] after:absolute after:inset-0
              after:[background-image:var(--dark-gradient),var(--aurora)]
              after:[background-size:200%,_100%] 
              after:animate-aurora after:[background-attachment:fixed]
              pointer-events-none
              `,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
            )}
            style={{
              // THE NEON COLORS (Cyan -> Purple -> Blue)
              "--aurora": 
                "repeating-linear-gradient(100deg, #22d3ee 10%, #7c3aed 15%, #3b82f6 20%, #8b5cf6 25%, #22d3ee 30%)",

              "--dark-gradient":
                "repeating-linear-gradient(100deg, #000000 0%, #000000 7%, transparent 10%, transparent 12%, #000000 16%)",
            }}
          ></div>
        </div>
        {/* This slot renders whatever you put inside the component (Navbar, Hero, etc) */}
        <div className="relative z-10 w-full h-full overflow-y-auto">
             {children}
        </div>
      </div>
    </main>
  );
};