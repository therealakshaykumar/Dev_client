import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthdayBannerProps {
    userName: string;
}

const BirthdayBanner: React.FC<BirthdayBannerProps> = ({ userName }) => {
    const [visible, setVisible] = useState(true);

    // Confetti particle config
    const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,           // random horizontal position %
        delay: Math.random() * 2,          // random start delay
        duration: 2 + Math.random() * 3,   // fall duration 2-5s
        size: 6 + Math.random() * 8,       // size 6-14px
        rotation: Math.random() * 360,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFFFFF', '#FFA07A'][
            Math.floor(Math.random() * 6)
        ]
    }));

    // Floating emoji config
    const floatingEmojis = ['🎂', '🎁', '🎈', '🎉', '🎊', '🧁', '🍰', '⭐'];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed w-full top-20 overflow-hidden"
                >
                    <div
                        className="relative py-5 px-6"
                        style={{
                            background: 'linear-gradient(135deg, #fe3c72 0%, #fd5564 50%, #fe3c72 100%)',
                            backgroundSize: '200% 200%',
                        }}
                    >
                        {/* Animated gradient overlay */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, #fd5564 0%, #fe3c72 50%, #fd5564 100%)',
                                backgroundSize: '200% 200%',
                            }}
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />

                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                            }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                repeatDelay: 2,
                            }}
                        />

                        {/* Confetti particles */}
                        {confettiPieces.map((piece) => (
                            <motion.div
                                key={piece.id}
                                className="absolute pointer-events-none rounded-sm"
                                style={{
                                    left: `${piece.x}%`,
                                    top: -20,
                                    width: piece.size,
                                    height: piece.size,
                                    backgroundColor: piece.color,
                                }}
                                animate={{
                                    y: ['-20px', '120px'],
                                    x: [0, (Math.random() - 0.5) * 60],
                                    rotate: [0, piece.rotation],
                                    opacity: [1, 0],
                                }}
                                transition={{
                                    duration: piece.duration,
                                    delay: piece.delay,
                                    repeat: Infinity,
                                    ease: 'easeIn',
                                }}
                            />
                        ))}

                        {/* Main content */}
                        <div className="relative z-10 flex items-center justify-center gap-4">
                            {/* Left floating emojis */}
                            <div className="hidden sm:flex gap-2">
                                {floatingEmojis.slice(0, 4).map((emoji, i) => (
                                    <motion.span
                                        key={`left-${i}`}
                                        className="text-2xl"
                                        animate={{
                                            y: [0, -8, 0],
                                            rotate: [0, 10, -10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        {emoji}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Center text */}
                            <div className="text-center">
                                {/* Cake icon with pulse */}
                                <motion.div
                                    className="text-4xl mb-1 sm:hidden"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    🎂
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    className="text-white text-xl sm:text-2xl font-bold tracking-wide"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    {'🎉 Happy Birthday'.split('').map((char, i) => (
                                        <motion.span
                                            key={i}
                                            animate={{
                                                color: [
                                                    '#FFFFFF',
                                                    '#FFD700',
                                                    '#FFFFFF',
                                                ],
                                            }}
                                            transition={{
                                                duration: 3,
                                                delay: i * 0.1,
                                                repeat: Infinity,
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                    {' 🎉'}
                                </motion.h2>

                                {/* Name with sparkle */}
                                <motion.p
                                    className="text-white/90 text-base sm:text-lg mt-1"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    Wishing you an amazing day,{' '}
                                    <motion.span
                                        className="font-bold text-white"
                                        animate={{
                                            textShadow: [
                                                '0 0 4px rgba(255,255,255,0.3)',
                                                '0 0 12px rgba(255,215,0,0.6)',
                                                '0 0 4px rgba(255,255,255,0.3)',
                                            ],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    >
                                        {userName}
                                    </motion.span>
                                    ! 🎁
                                </motion.p>
                            </div>

                            {/* Right floating emojis */}
                            <div className="hidden sm:flex gap-2">
                                {floatingEmojis.slice(4).map((emoji, i) => (
                                    <motion.span
                                        key={`right-${i}`}
                                        className="text-2xl"
                                        animate={{
                                            y: [0, -8, 0],
                                            rotate: [0, -10, 10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.3 + 0.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        {emoji}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Close button */}
                        <motion.button
                            className="absolute top-3 right-4 z-20 text-white/70 
                                       hover:text-white transition-colors duration-200 
                                       bg-white/10 hover:bg-white/20 rounded-full 
                                       w-8 h-8 flex items-center justify-center 
                                       backdrop-blur-sm"
                            onClick={() => setVisible(false)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>

                        {/* Bottom sparkle line */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px]"
                            style={{
                                background:
                                    'linear-gradient(90deg, transparent, #FFD700, #FFFFFF, #FFD700, transparent)',
                            }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BirthdayBanner;