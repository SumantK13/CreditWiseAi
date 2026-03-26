import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

export const Vortex = ({
  children,
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 100,
  baseHue = 220, // Cyan/Blue base
  baseSpeed = 0.0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "#000000",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlePropsLength = 9;
  const noise3D = createNoise3D();
  
  let particleProps = new Float32Array(particleCount * particlePropsLength);
  let center = [0, 0];
  let tick = 0;

  useEffect(() => {
    setup();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      resize();
      initParticles();
      draw(canvas, ctx);
    }
  };

  const initParticles = () => {
    tick = 0;
    for (let i = 0; i < particlePropsLength * particleCount; i += particlePropsLength) {
      initParticle(i);
    }
  };

  const initParticle = (i) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let x, y, vx, vy, life, ttl, speed, radius, hue;
    x = Math.random() * canvas.width;
    y = center[1] + (Math.random() * 2 - 1) * rangeY;
    vx = 0;
    vy = 0;
    life = 0;
    ttl = 50 + Math.random() * 150;
    speed = baseSpeed + Math.random() * rangeSpeed;
    radius = baseRadius + Math.random() * rangeRadius;
    hue = baseHue + Math.random() * 60; // Varies between Cyan and Purple

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const draw = (canvas, ctx) => {
    tick++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawParticles(ctx);
    renderGlow(canvas, ctx);
    window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const drawParticles = (ctx) => {
    for (let i = 0; i < particlePropsLength * particleCount; i += particlePropsLength) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i, ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let x = particleProps[i];
    let y = particleProps[i + 1];
    let n = noise3D(x * 0.0012, y * 0.0012, tick * 0.0015) * Math.PI * 2;
    let vx = Math.cos(n);
    let vy = Math.sin(n);
    let life = particleProps[i + 4];
    let ttl = particleProps[i + 5];
    let speed = particleProps[i + 6];
    let radius = particleProps[i + 7];
    let hue = particleProps[i + 8];

    let x2 = x + vx * speed;
    let y2 = y + vy * speed;
    
    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    particleProps[i] = x2;
    particleProps[i + 1] = y2;
    particleProps[i + 2] = vx;
    particleProps[i + 3] = vy;
    particleProps[i + 4] = life + 1;

    if (checkBounds(x, y, canvas) || life > ttl) {
      initParticle(i);
    }
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  const checkBounds = (x, y, canvas) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const fadeInOut = (t, m) => {
    let hm = m / 2;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };

  const renderGlow = (canvas, ctx) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const resize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width = container.innerWidth || window.innerWidth;
      canvas.height = container.innerHeight || window.innerHeight;
      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
    }
  };

  return (
    <div className={`relative h-full w-full bg-black ${containerClassName}`} ref={containerRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 flex items-center justify-center bg-transparent w-full h-full"
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"></canvas>
      </motion.div>
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};