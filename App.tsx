/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldAlert, LogOut } from 'lucide-react';

// --- Assets ---

const LinkedInLogo = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// --- Custom Cursor Component ---

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const trailerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const trailerPosRef = useRef({ x: 0, y: 0 });
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)');

        const update = () => setEnabled(finePointer.matches);
        update();

        finePointer.addEventListener('change', update);
        return () => {
            finePointer.removeEventListener('change', update);
        };
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const cursor = cursorRef.current;
        const trailer = trailerRef.current;
        const root = document.documentElement;
        let isActive = false;

        const animate = () => {
            const { x, y } = targetRef.current;
            const trailerPos = trailerPosRef.current;

            trailerPos.x += (x - trailerPos.x) * 0.18;
            trailerPos.y += (y - trailerPos.y) * 0.18;

            if (cursor) {
                cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }
            if (trailer) {
                trailer.style.transform = `translate3d(${trailerPos.x - 12}px, ${trailerPos.y - 12}px, 0)`;
            }

            root.style.setProperty('--cursor-x', `${x}px`);
            root.style.setProperty('--cursor-y', `${y}px`);
            root.style.setProperty('--cursor-active', isActive ? '1' : '0');

            const distance = Math.abs(x - trailerPos.x) + Math.abs(y - trailerPos.y);
            if (distance < 0.2) {
                rafRef.current = null;
                return;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        const handleMove = (e: PointerEvent) => {
            isActive = true;
            targetRef.current = { x: e.clientX, y: e.clientY };
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        const handleLeave = () => {
            isActive = false;
            targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        window.addEventListener('pointermove', handleMove, { passive: true });
        window.addEventListener('pointerdown', handleMove, { passive: true });
        document.addEventListener('mouseleave', handleLeave);

        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerdown', handleMove);
            document.removeEventListener('mouseleave', handleLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            document.body.style.cursor = 'auto';
            root.style.removeProperty('--cursor-x');
            root.style.removeProperty('--cursor-y');
            root.style.removeProperty('--cursor-active');
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference overflow-hidden">
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[101]"
                style={{ willChange: 'transform' }}
            />
            <div
                ref={trailerRef}
                className="fixed top-0 left-0 w-7 h-7 border border-white rounded-full opacity-50 z-[100]"
                style={{ willChange: 'transform' }}
            />
        </div>
    );
};

// --- Electric Background Component ---

const ElectricBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let animationFrameId = 0;
        let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        const mouse = { x: 0, y: 0, vx: 0, vy: 0, active: false };
        let prevMouse = { x: 0, y: 0 };
        const maxDist = 150;
        const maxDistSq = maxDist * maxDist;
        const cellSize = 160;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const density = prefersReducedMotion ? 26000 : 18000;
            const maxCount = prefersReducedMotion ? 70 : 120;
            const count = Math.min(Math.floor((width * height) / density), maxCount);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 1.2 + 0.4,
                });
            }
        };

        const drawFrame = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 1;

            const grid = new Map<string, number[]>();

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distSq = dx * dx + dy * dy;
                    const radius = 220;
                    const radiusSq = radius * radius;
                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq) || 1;
                        const force = (1 - dist / radius) * 0.08;
                        p.vx += (dx / dist) * force + mouse.vx * 0.0015;
                        p.vy += (dy / dist) * force + mouse.vy * 0.0015;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.985;
                p.vy *= 0.985;

                // Bounce off edges
                if (p.x < 0 || p.x > width) {
                    p.vx *= -1;
                    p.x = Math.max(0, Math.min(width, p.x));
                }
                if (p.y < 0 || p.y > height) {
                    p.vy *= -1;
                    p.y = Math.max(0, Math.min(height, p.y));
                }

                const cellX = Math.floor(p.x / cellSize);
                const cellY = Math.floor(p.y / cellSize);
                const key = `${cellX},${cellY}`;
                const bucket = grid.get(key);
                if (bucket) {
                    bucket.push(i);
                } else {
                    grid.set(key, [i]);
                }
            }

            // Draw dots + connections
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                const cellX = Math.floor(p.x / cellSize);
                const cellY = Math.floor(p.y / cellSize);
                for (let gx = -1; gx <= 1; gx++) {
                    for (let gy = -1; gy <= 1; gy++) {
                        const key = `${cellX + gx},${cellY + gy}`;
                        const bucket = grid.get(key);
                        if (!bucket) continue;
                        for (const j of bucket) {
                            if (j <= i) continue;
                            const p2 = particles[j];
                            const dx = p.x - p2.x;
                            const dy = p.y - p2.y;
                            const distSq = dx * dx + dy * dy;
                            if (distSq < maxDistSq) {
                                const dist = Math.sqrt(distSq);
                                const alpha = 0.12 * (1 - dist / maxDist);
                                ctx.beginPath();
                                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                            }
                        }
                    }
                }
            }
        };

        const animate = () => {
            drawFrame();
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        const handlePointer = (e: PointerEvent) => {
            mouse.active = true;
            mouse.vx = e.clientX - prevMouse.x;
            mouse.vy = e.clientY - prevMouse.y;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            prevMouse = { x: e.clientX, y: e.clientY };
        };
        const handlePointerLeave = () => {
            mouse.active = false;
            mouse.vx = 0;
            mouse.vy = 0;
        };
        window.addEventListener('pointermove', handlePointer, { passive: true });
        window.addEventListener('pointerdown', handlePointer, { passive: true });
        document.addEventListener('mouseleave', handlePointerLeave);
        resize();
        if (prefersReducedMotion) {
            drawFrame();
        } else {
            animate();
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointer);
            window.removeEventListener('pointerdown', handlePointer);
            document.removeEventListener('mouseleave', handlePointerLeave);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40 pointer-events-none" />;
};

// --- Particle Text Component ---

interface Particle {
    x: number; y: number;
    ox: number; oy: number;
    vx: number; vy: number;
    size: number;
    color: string;
}

const ParticleModiText = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
    const prevMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Configuration
        const text = "modih";
        let particles: Particle[] = [];
        let animationFrameId: number;

        const init = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            // Create text mask
            const fontSize = Math.min(width * 0.22, 180);
            ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, width / 2, height / 2);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles = [];
            // Higher density for sandy look
            const step = 3 * dpr;

            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const i = (y * canvas.width + x) * 4;
                    if (data[i + 3] > 128) {
                        particles.push({
                            x: Math.random() * width,
                            y: Math.random() * height,
                            ox: x / dpr,
                            oy: y / dpr,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            size: Math.random() * 1.5 + 0.5,
                            color: '#FFFFFF'
                        });
                    }
                }
            }
        };

        const animate = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            ctx.clearRect(0, 0, width, height);

            // Mouse Velocity Calculation
            const rect = canvas.getBoundingClientRect();
            const mx = mouseRef.current.x - rect.left;
            const my = mouseRef.current.y - rect.top;

            const mvx = mx - prevMouseRef.current.x;
            const mvy = my - prevMouseRef.current.y;

            // Decay mouse velocity tracking
            mouseRef.current.vx = mvx;
            mouseRef.current.vy = mvy;
            prevMouseRef.current = { x: mx, y: my };

            particles.forEach((p) => {
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 100;

                // --- Interaction Physics ---
                if (dist < interactionRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (interactionRadius - dist) / interactionRadius;

                    // 1. Repulsion (Push away)
                    p.vx -= Math.cos(angle) * force * 1.5;
                    p.vy -= Math.sin(angle) * force * 1.5;

                    // 2. Swirl/Tangential Force (Rotational feel)
                    // Push perpendicular to the angle
                    p.vx += -Math.sin(angle) * force * 0.5;
                    p.vy += Math.cos(angle) * force * 0.5;

                    // 3. Drag (Follow mouse movement slightly)
                    p.vx += mvx * 0.1 * force;
                    p.vy += mvy * 0.1 * force;
                }

                // --- Return to Origin (Home) ---
                const dxOrigin = p.ox - p.x;
                const dyOrigin = p.oy - p.y;

                // Very gentle spring for "settle back slowly"
                p.vx += dxOrigin * 0.015;
                p.vy += dyOrigin * 0.015;

                // Damping/Friction (Sand doesn't bounce much)
                p.vx *= 0.92;
                p.vy *= 0.92;

                // Update Position
                p.x += p.vx;
                p.y += p.vy;

                // Draw
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.rect(p.x, p.y, p.size, p.size);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-40 md:h-64 relative z-20">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

// --- Modal Component ---

const DisclaimerModal = ({ onAgree }: { onAgree: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden"
            >
                {/* Glow effect inside modal */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 text-red-500">
                        <ShieldAlert size={24} />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4">Parody Disclaimer</h2>

                    <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                        This is an unofficial parody/meme website created purely for entertainment purposes.
                        It is not affiliated with Narendra Modi, the Government of India, or any political party.
                        All media belongs to their respective owners.
                    </p>

                    <div className="flex flex-col-reverse md:flex-row gap-3 w-full">
                        <button
                            onClick={() => window.location.href = 'https://www.google.com'}
                            className="flex-1 py-3 border border-neutral-800 text-neutral-500 font-medium rounded-lg hover:bg-neutral-900 hover:text-red-400 hover:border-red-900/30 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} />
                            Exit
                        </button>
                        <button
                            onClick={onAgree}
                            className="flex-[2] py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group"
                        >
                            I Understand & Enter
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};

// --- Main App ---

const App: React.FC = () => {
    const [agreed, setAgreed] = useState(false);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (!agreed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [agreed]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 relative flex flex-col overflow-x-hidden cursor-none">

            {/* Custom Cursor */}
            <CustomCursor />

            {/* Vercel Analytics */}
            <Analytics />

            {/* Disclaimer Modal */}
            <AnimatePresence>
                {!agreed && <DisclaimerModal onAgree={() => setAgreed(true)} />}
            </AnimatePresence>

            {/* Electric Background */}
            <ElectricBackground />

            {/* Ambient Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 ambient-aurora"></div>
                <div className="absolute inset-0 interactive-glow"></div>

                {/* Deep ambient glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[120px] ambient-orb orb-a"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] ambient-orb orb-b"></div>
                <div className="absolute top-[20%] right-[-15%] w-[35vw] h-[35vw] rounded-full bg-emerald-900/10 blur-[120px] ambient-orb orb-c hidden md:block"></div>

                <div className="absolute inset-0 vignette"></div>
            </div>

            <main className={`flex-grow flex flex-col items-center justify-center px-6 py-20 relative z-10 w-full max-w-3xl mx-auto transition-all duration-700 ${!agreed ? 'blur-lg opacity-30 pointer-events-none' : 'blur-none opacity-100'}`}>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center w-full flex flex-col items-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2"></span>
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-indigo-200/80 uppercase">Coming Soon</span>
                    </div>

                    {/* Interactive Particle Title */}
                    <div className="w-full max-w-2xl mb-12">
                        <ParticleModiText />
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-neutral-700 to-transparent mx-auto mb-12"></div>

                    {/* Short Message */}
                    <p className="text-neutral-400 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-16">
                        Memes the internet made. <br className="hidden sm:block" />
                        No politics, no agenda.
                    </p>

                </motion.div>

                {/* Links Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-sm"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] flex-grow bg-white/10"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Reach owner of modih.in</span>
                        <div className="h-[1px] flex-grow bg-white/10"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Button 1: LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/abhnv07/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-between px-6 py-4 bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 overflow-hidden cursor-none"
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="text-neutral-400 group-hover:text-white transition-colors">
                                    <LinkedInLogo />
                                </div>
                                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">LinkedIn</span>
                            </div>
                            <ArrowRight size={16} className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </a>

                        {/* Button 2: Contact */}
                        <a
                            href="https://www.abhnv.in/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-between px-6 py-4 bg-neutral-900/50 hover:bg-neutral-800 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 overflow-hidden cursor-none"
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <Mail size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
                                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Contact</span>
                            </div>
                            <ArrowRight size={16} className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </a>
                    </div>
                </motion.div>

            </main>

            {/* Footer / Disclaimer */}
            <footer className={`relative z-10 py-10 px-6 border-t border-white/5 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ${!agreed ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center justify-center gap-2">
                        <ShieldAlert size={14} /> Disclaimer
                    </p>
                    <p className="text-[12px] md:text-sm leading-relaxed text-white font-medium max-w-lg mx-auto bg-neutral-900/50 p-4 rounded-lg border border-white/10">
                        This is an unofficial parody/meme website created purely for entertainment purposes.
                        It is not affiliated with Narendra Modi, the Government of India, or any political party.
                        All media belongs to their respective owners.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default App;
