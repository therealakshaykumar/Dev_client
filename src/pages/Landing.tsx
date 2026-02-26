// pages/Landing.tsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { useEffect, useRef, useState } from "react";
import TerminalTyping from "../components/TerminalTyping";

// Custom cursor component
const CustomCursor = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth spring animation for cursor
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Detect hoverable elements
    const hoverElements = document.querySelectorAll("button, a, [data-hover]");
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isClicking ? 8 : isHovering ? 40 : 12,
            height: isClicking ? 8 : isHovering ? 40 : 12,
            opacity: isHovering ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          className="rounded-full border border-white/30"
          animate={{
            width: isHovering ? 60 : 36,
            height: isHovering ? 60 : 36,
            borderColor: isHovering
              ? "rgba(254, 60, 114, 0.6)"
              : "rgba(255,255,255,0.3)",
          }}
          transition={{ duration: 0.3 }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>
    </>
  );
};

// 3D Tilt Card Component
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(254,60,114,0.6), rgba(253,85,100,0.2))`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (user) navigate("/feed");
  }, [user, navigate]);

  // Parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Text reveal animation
  const letterAnimation = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.04 + 0.5,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  } as const;

  const tagline = "git clone greatness";

  return (
    <div className="min-h-screen relative overflow-hidden cursor-none">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
      >
        <img
          src="/bg.png"
          alt=""
          className="w-[110%] h-[110%] object-cover -ml-[5%] -mt-[5%]"
        />
      </motion.div>

      {/* Dark Overlay Layers */}
      <div className="absolute inset-0 z-[1] bg-black/80" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 70%)",
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(254,60,114,0.15), transparent 40%)",
        }}
      />

      {/* Floating Particles */}
      <div className="z-[3]">
        <FloatingParticles />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-center justify-center gap-2"
          data-hover
        >
          <motion.img
            className="w-8 h-8"
            src="/logo.svg"
            alt="GitTogether"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <h2 className="text-white/70 text-xl font-light tracking-[0.3em] uppercase">
            GitTogether
          </h2>
        </motion.div>

        {/* 3D Tilt Tagline */}
        <TiltCard className="mb-8">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight"
            initial="hidden"
            animate="visible"
            style={{ perspective: "1000px" }}
          >
            {tagline.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterAnimation}
                className="inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, #fe3c72 0%, #fd5564 30%, #ff8a80 60%, #fe3c72 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 30px rgba(254,60,114,0.3))",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        </TiltCard>

        {/* Animated underline */}
        <motion.div
          className="h-[2px] mb-10 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #fe3c72, #fd5564, #fe3c72, transparent)",
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-gray-400 text-lg md:text-2xl max-w-lg mx-auto mb-14 font-light tracking-wide"
        >
          Where developers find their{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe3c72] to-[#fd5564]">
            perfect match
          </span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          {/* Primary Button - 3D effect */}
          <TiltCard>
            <motion.button
              data-hover
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="relative group px-10 py-4 rounded-full overflow-hidden"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#fe3c72] to-[#fd5564]" />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#fe3c72] to-[#fd5564] blur-xl" />

              <span className="relative z-10 text-white font-semibold tracking-wide text-lg">
                Get Started
              </span>
            </motion.button>
          </TiltCard>

          {/* Secondary Button - Glass effect */}
          <TiltCard>
            <motion.button
              data-hover
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user ? "/feed" : "/login")}
              className="relative group px-10 py-4 rounded-full overflow-hidden
                         bg-white/5 backdrop-blur-md border border-white/10
                         hover:border-[#fe3c72]/50 transition-colors duration-300"
            >
              {/* Hover gradient border glow */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-[-1px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(254,60,114,0.3), rgba(253,85,100,0.1))",
                  }}
                />
              </div>

              <span className="relative z-10 text-white/90 font-medium tracking-wide text-lg">
                {user ? "Feed" : "Sign In"}
              </span>
            </motion.button>
          </TiltCard>
        </motion.div>

        {/* Terminal decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20 relative overflow-hidden"
        >
    <TiltCard>
        <TerminalTyping />
    </TiltCard>
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
              <motion.div
                className="w-1 h-2 rounded-full bg-[#fe3c72]"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div> */}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[5] bg-gradient-to-t from-black to-transparent" />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};

export default Landing;