// Portfolio.jsx (Corrected)
'use client'
import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, Brain, Rainbow, File, User, Instagram, Clock, Copy, Check } from "lucide-react";
import { Loader } from '@googlemaps/js-api-loader';
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useTheme } from 'next-themes';
import { notFound } from "next/navigation";

export default function Portfolio() {
    const mapRef = useRef(null);
    const { resolvedTheme } = useTheme();
    // ✅ REMOVED: const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(true);

    const [copyIconState, setCopyIconState] = useState('mail'); // Can be 'mail', 'copy', or 'check'

    const handleCopyClick = () => {
        navigator.clipboard.writeText('rudrabchavda@gmail.com');
        setCopyIconState('check');

        // Reset the icon back to 'mail' after 1.5 seconds
        setTimeout(() => {
            setCopyIconState('mail');
        }, 1500);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // ✅ REMOVED: The useEffect that was syncing isDarkMode with resolvedTheme

    useEffect(() => {
        if (!mounted || !mapRef.current) return;

        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
                version: 'weekly',
            });

            try {
                const google = await loader.load();
                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: 36.982265, lng: -122.059839 },
                    zoom: 11,
                    disableDefaultUI: true,
                    draggable: false,
                    scrollwheel: false,
                    keyboardShortcuts: false,
                    styles: []
                });

                new google.maps.Marker({
                    position: { lat: 36.982265, lng: -122.059839 },
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#3b82f6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });
            } catch (error) {
                console.error('Error loading Google Maps:', error);
            }
        };
        initMap();

        // We use resolvedTheme here to re-trigger map logic if needed, but not isDarkMode
    }, [mounted, resolvedTheme]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 80, filter: 'blur(40px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                // General transition for properties like 'y' and 'opacity'
                type: 'spring',
                stiffness: 100,
                damping: 12,

                // Specific override for the 'filter' property to prevent glitches
                filter: {
                    type: 'tween',
                    duration: 0.3,
                    ease: 'easeOut'
                },
            },
        },
    };

    const initialShadow = 'rgba(28, 29, 33, 0.133) 0px 0.60219px 0.60219px -1.16667px, rgba(28, 29, 33, 0.12) 0px 2.28853px 2.28853px -2.33333px, rgba(28, 29, 33, 0.06) 0px 10px 10px -3.5px, rgba(223, 224, 225, 0.3) 0px 0px 0px 0px';
    const hoverShadow = '0px 0.60219px 2.04744px -0.5px rgba(28, 29, 33, 0.067), 0px 2.28853px 7.78101px -1px rgba(28, 29, 33, 0.08), 0px 10px 34px -1.5px rgba(28, 29, 33, 0.14), 0px 0px 0px 0px rgba(223, 224, 225, 0.3)';

    const hoverTransition = {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
    };

    const createHoverEffect = (hoverBackgroundColor) => ({
        y: -12,
        boxShadow: hoverShadow,
        backgroundColor: hoverBackgroundColor,
        transition: hoverTransition
    });

    const simpleHoverEffect = {
        y: -12,
        boxShadow: hoverShadow,
        transition: hoverTransition
    };

    // Style objects now directly check the theme
    const cardBorderRadius = {
        borderWidth: '1px',
        borderRadius: '24px',
        borderStyle: 'solid',
        borderColor: resolvedTheme === 'dark' ? '#404040' : 'rgba(225, 228, 232, 0.8)',
    };

    const bgColors = resolvedTheme === 'dark'
        ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
        : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

    const imageContainerStyle = { borderWidth: '0px', borderRadius: '100px', borderStyle: 'solid', borderColor: resolvedTheme === 'dark' ? '#404040' : 'rgba(225, 228, 232, 0.8)', overflow: 'hidden' };
    const profileImageStyle = { imageRendering: '', transform: 'scale(1)', objectFit: 'cover' };
    const opennoteImageStyle = { ...profileImageStyle, transform: 'scale(1)' };
    const tagStyle = {
        fontFamily: '"system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "System Default", sans-serif',
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 600,
        letterSpacing: '-.01em',
        lineHeight: '28px',
        margin: 0,
        textAlign: 'start',
        color: '#000',
        WebkitTextStrokeWidth: '.2px',
        WebkitTextStrokeColor: 'black',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
    };
    const TitleStyle = { color: resolvedTheme === 'dark' ? 'white' : '#3b3d41', fontFamily: 'SF', fontWeight: 400, letterSpacing: '0.8px', lineHeight: '1.2em', fontSize: '2em', WebkitTextStroke: resolvedTheme === 'dark' ? '0.6px white' : '0.6px #3b3d41', marginBottom: '12px', textShadow: resolvedTheme === 'dark'? "none" : "1px 1px 2px rgba(0,0,0,0.25)", };
    const textstyle = { fontFamily: 'SF', fontSize: '16px', fontWeight: 500, color: resolvedTheme === 'dark' ? 'rgba(225, 225, 225, 0.8)' : 'black', WebkitTextStroke: resolvedTheme === 'dark' ? '0px' : '.2px black', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' };
    const roundText = { fontFamily: 'SFRound', fontSize: '16px', letterSpacing: '0.5px', fontWeight: 500, color: resolvedTheme === 'dark' ? 'rgba(225, 225, 225, 1)' : 'black', WebkitTextStroke: '0.2px', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' };
    const headingstyle = { fontFamily: '"Inter Regular", "Inter Regular Placeholder", sans-serif', fontSize: '14px', fontWeight: 400, letterSpacing: '1.86px', color: '#a1a1a1', textTransform: 'uppercase' };
    const opennoteTextStyle = { fontFamily: 'Space Grotesk, sans-serif',};

    if (!mounted) {
        return null;
    }

    return (
        <div className={resolvedTheme === 'dark' ? "bg-[#0a0a0a] min-h-screen transition-colors duration-500" : "bg-[#f5f5f7] min-h-screen transition-colors duration-500"}>
            <div className="max-w-screen-xl mx-auto py-10 px-6 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- Left Sticky Column --- */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={resolvedTheme === 'dark' ? "bg-[#171717] rounded-3xl py-8 px-8 shadow-sm" : "bg-white transition-colors duration-500 rounded-3xl py-8 px-8 shadow-sm"}
                                style={cardBorderRadius}
                            >
                                <div className="flex flex-col items-start text-left">
                                    <div className="w-24 h-24 mb-6 flex items-center justify-center" style={imageContainerStyle}>
                                        <svg fill="#000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="32" height="32" rx="100" fill={resolvedTheme === 'dark' ? '#fff' : '#000'} />
                                            <g transform="translate(16,16) scale(0.6) translate(-16,-16)">

                                                <g transform="translate(0,0)" fill={resolvedTheme === 'dark' ? '#1d1d1f' : '#fff'}>
                                                    <path d="M0.060 15.541c0.141-8.424 7.192-15.376 15.478-15.501 0.023 7.694-6.318 15.3-15.478 15.501z"></path>
                                                </g>

                                                <g transform="scale(-1,1) translate(-15.6,16)" fill={resolvedTheme === 'dark' ? '#1d1d1f' : '#fff'}>
                                                    <path d="M0.060 15.541c0.141-8.424 7.192-15.376 15.478-15.501 0.023 7.694-6.318 15.3-15.478 15.501z"></path>
                                                </g>

                                                <g transform="translate(-1.5,-0.5)  scale(1.021)" fill={resolvedTheme === 'dark' ? '#1d1d1f' : '#fff'}>
                                                    <path d="M17.209 15.326v-14.786h14.783c0.286 7.579-6.354 14.908-14.783 14.786z"></path>
                                                    <path d="M17.216 31.408v-14.777h14.777c0.208 7.717-6.424 14.868-14.777 14.777z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="flex items-center justify-between w-full gap-5">
                                        <h1 className="mb-4" style={TitleStyle}>Rudra Chavda</h1>
                                        <ModeToggle className="mb-3" />
                                    </div>
                                    <div className="space-y-3 w-full">
                                        <Link href="/info" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer ${resolvedTheme === 'dark' ? 'text-gray-200 hover:bg-[#282828]' : 'text-gray-600 hover:bg-gray-100'}`}>
                                            <User className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} />
                                            <span style={textstyle}>Info</span>
                                        </Link>
                                        <Link href="/ideas" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer ${resolvedTheme === 'dark' ? 'text-gray-200 hover:bg-[#282828]' : 'text-gray-600 hover:bg-gray-100'}`} style={textstyle}>
                                            <Brain className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} /> Ideas
                                        </Link>
                                        <Link href="/projects" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer ${resolvedTheme === 'dark' ? 'text-gray-200 hover:bg-[#282828]' : 'text-gray-600 hover:bg-gray-100'}`} style={textstyle}>
                                            <Rainbow className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} /> Projects
                                        </Link>
                                        <Link href="/cv" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer ${resolvedTheme === 'dark' ? 'text-gray-200 hover:bg-[#282828]' : 'text-gray-600 hover:bg-gray-100'}`} style={textstyle}>
                                            <File className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} /> CV
                                        </Link>
                                        <p
                                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer font-medium ${resolvedTheme === 'dark' ? 'text-gray-200 hover:bg-[#282828]' : 'text-gray-600 hover:bg-gray-100'}`}
                                            onClick={handleCopyClick}
                                            onMouseEnter={() => copyIconState !== 'check' && setCopyIconState('copy')}
                                            onMouseLeave={() => copyIconState !== 'check' && setCopyIconState('mail')}
                                            title="Click to copy email"
                                        >
                                            {/* Conditionally render the icon based on state */}
                                            {copyIconState === 'mail' && <Mail className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} />}
                                            {copyIconState === 'copy' && <Copy className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} />}
                                            {copyIconState === 'check' && <Check className="w-6 h-6 text-[#34C759]" />}

                                            <span style={textstyle}>rudrabchavda@gmail.com</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- Right Scrollable Bento Grid --- */}
                    <motion.div
                        key={resolvedTheme} // Use resolvedTheme directly for the key
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        onAnimationComplete={() => setIsAnimating(false)}
                        className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min"
                    >
                        <motion.p variants={itemVariants} className="md:col-span-2" style={headingstyle}>
                            Featured
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            onClick={() => window.open("https://opennote.com/?refer=3450c1da-c92f-4e4f-9e77-67895f1b9ca0", "_blank")}
                            className={`${isAnimating ? 'pointer-events-none' : ''} relative md:col-span-1 rounded-2xl p-6 flex flex-col bg-cover bg-center cursor-pointer`}
                            style={{ backgroundImage: resolvedTheme === 'dark' ? "url('/opennotebgdark.jpg')" : "url('/opennotebg.jpg')", ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                        >
                            <div className="w-12 h-12 mb-6 flex items-center justify-center" style={imageContainerStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 54" className="w-full h-full">
                                    <g transform="translate(-2, 39) scale(0.009507, -0.009507)" fill={resolvedTheme === 'dark' ? '#FFFFFF' : '#000000'} stroke="none">
                                        <path d="M2920 3679 c-980 -225 -938 -206 -1107 -507 -111 -197 -99 -192 -243
                -110 -254 143 -742 -33 -1675 -606 -264 -162 -262 -171 60 -277 319 -105 1009
                -359 1032 -380 18 -16 -56 -242 -101 -308 -59 -90 -35 -130 69 -118 108 13
                292 -32 835 -204 187 -59 493 -148 680 -197 187 -49 491 -143 675 -209 184
                -66 427 -143 540 -173 113 -30 266 -80 341 -113 199 -87 253 -29 162 175 -115
                259 -259 695 -632 1918 -102 336 -146 539 -187 860 -44 353 -30 345 -449 249z
                m310 -124 c5 -25 32 -166 60 -315 62 -345 214 -887 467 -1670 311 -966 327
                -957 -257 -148 -137 191 -392 539 -566 774 -330 447 -814 1139 -814 1164 0 32
                879 231 1055 238 30 1 48 -12 55 -43z m-1029 -485 c191 -288 701 -1002 912
                -1277 240 -312 231 -328 -49 -86 -248 213 -254 221 -254 331 l0 92 -72 -6
                c-97 -7 -132 34 -99 115 41 97 -27 143 -87 58 -66 -94 -120 -1 -59 103 44 73
                24 131 -34 100 -22 -13 -51 -44 -63 -71 -27 -59 -39 -61 -84 -11 -32 35 -31
                42 11 130 83 171 -14 171 -115 0 -22 -37 -24 -37 -65 0 -55 49 -55 51 18 174
                48 81 56 108 35 121 -49 31 -72 17 -103 -60 -35 -89 -83 -118 -111 -68 -20 36
                11 113 81 203 28 36 32 54 15 75 -37 44 -56 32 -122 -73 -70 -112 -76 -115
                -124 -62 -33 36 81 323 173 438 26 32 19 40 196 -226z m-684 -145 c62 -52 216
                -194 342 -316 127 -121 393 -359 591 -529 494 -424 1286 -1171 1265 -1192 -5
                -5 -102 33 -217 84 -358 159 -598 247 -908 330 -461 125 -638 186 -1013 350
                -585 256 -731 315 -1202 489 -250 92 -455 173 -455 178 1 18 410 281 545 351
                69 36 179 95 245 132 103 57 584 214 668 217 15 1 78 -42 139 -94z m-52 -1342
                c341 -154 454 -193 1015 -353 496 -141 1335 -476 1339 -535 2 -36 -116 -5
                -627 164 -298 98 -650 207 -782 242 -600 157 -1307 368 -1358 405 -32 23 -31
                31 8 119 53 120 42 121 405 -42z" />
                                    </g>
                                </svg>
                            </div>
                            <div className="absolute top-6 right-6">
                                <button onClick={(e) => { e.stopPropagation(); window.open("https://opennote.com/?refer=3450c1da-c92f-4e4f-9e77-67895f1b9ca0", "_blank"); }} className="text-xs font-medium bg-[#0e8d7e] hover:bg-[#ebf6f3] hover:text-black text-white px-3 py-1 rounded-full transition" style={opennoteTextStyle}>
                                    Sign Up
                                </button>
                            </div>
                            <p className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={opennoteTextStyle}>Opennote</p>
                            <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} style={opennoteTextStyle}>Sign up for FREE today!</p>
                            <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} style={opennoteTextStyle}>DM me for a special discount code.</p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className={`${isAnimating ? 'pointer-events-none' : ''} md:col-span-1 rounded-2xl p-6 relative overflow-hidden cursor-pointer`}
                            style={{ height: '192px', ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                        >
                            <div
                                ref={mapRef}
                                className="absolute inset-0 w-full h-full"
                                style={{ zIndex: 1 }}
                            />
                            <div
                                className="absolute bottom-0 left-0 w-full h-6"
                                style={{ backgroundColor: '#91daee', zIndex: 2 }}
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-4 h-4 bg-blue-500 rounded-full z-20" />
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/30 rounded-full z-10"
                                    style={{ width: '1rem', height: '1rem' }}
                                    animate={{ scale: [0.5, 6], opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", repeatType: "loop" }}
                                />
                            </div>
                            <div className={`absolute bottom-4 left-4 border backdrop-blur-sm p-2 rounded-lg text-xs font-medium z-40 ${resolvedTheme === 'dark' ? 'bg-[#171717]/70 text-gray-200 border-gray-600' : 'bg-white/70 text-gray-800 border-gray-200'}`}>
                                UC Santa Cruz C/O 2028
                            </div>
                            <motion.img src={"/cloud.png"} alt="Cloud" className="absolute" style={{ top: '-400px', left: '-400px', zIndex: 30, opacity: 0.6 }} animate={{ x: [-10, 800], y: [-10, 800] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
                            <motion.img src={"/cloud.png"} alt="Cloud" className="absolute" style={{ top: '-400px', left: '-400px', zIndex: 34, opacity: 0.6 }} animate={{ x: [0, 800], y: [0, 800] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
                            <motion.img src="/planeshadow.png" alt="Plane Shadow" className="absolute" style={{ top: '0px', left: '0px', zIndex: 31, scale: 0.25 }} animate={{ x: [850, -30], y: [490, -20], rotate: [300, 300] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
                            <motion.img src="/plane.png" alt="Plane" className="absolute" style={{ top: '0px', left: '0px', zIndex: 32, scale: 0.25 }} animate={{ x: [800, -60], y: [400, -100], rotate: [300, 300] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            onClick={() => window.open("https://www.instagram.com/rudrabchavda/", "_blank")}
                            className={`${isAnimating ? 'pointer-events-none' : ''} ${resolvedTheme === 'dark' ? "bg-[#171717] rounded-2xl p-6 cursor-pointer" : "bg-[#fff5f9] rounded-2xl p-6 cursor-pointer"}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : createHoverEffect(resolvedTheme === 'dark' ? "#282828" : "#fff1f7")}
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-lg">
                                    <Instagram className="w-5 h-5 text-white" />
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); window.open("https://www.instagram.com/rudrabchavda/", "_blank"); }} className="text-xs font-medium bg-[#ee2a7b] hover:bg-[#6228d7] text-white px-3 py-1 rounded-full transition">
                                    Follow
                                </button>
                            </div>
                            <p className={`font-medium mt-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Instagram</p>
                            <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>@rudrabchavda</p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            onClick={() => window.open("https://www.linkedin.com/in/rudra-chavda", "_blank")}
                            className={`${isAnimating ? 'pointer-events-none' : ''} ${resolvedTheme === 'dark' ? "bg-[#171717] rounded-2xl p-6 cursor-pointer" : "bg-[#f0f6f9] rounded-2xl p-6 cursor-pointer"}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : createHoverEffect(resolvedTheme === 'dark' ? "#282828" : "#daf3ff")}
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-[#0d6494]/100 rounded-lg">
                                    <Linkedin className="w-5 h-5 text-white " />
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); window.open("https://www.linkedin.com/in/rudra-chavda", "_blank"); }} className="text-xs font-medium bg-[#0d6494] hover:bg-[#64c9ff] text-white hover:text-black px-3 py-1 rounded-full transition">
                                    Connect
                                </button>
                            </div>
                            <p className={`font-medium mt-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>LinkedIn</p>
                            <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Rudra Chavda</p>
                        </motion.div>

                        {/* --- FINAL GITHUB CARD START --- */}
                        <motion.div
                            variants={itemVariants}
                            onClick={() => window.open("https://github.com/rudrachavda", "_blank")}
                            className={`${isAnimating ? 'pointer-events-none' : ''} ${resolvedTheme === 'dark' ? "md:col-span-2 bg-[#171717] rounded-2xl p-6 cursor-pointer" : "md:col-span-2 bg-white rounded-2xl p-6 cursor-pointer"}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : createHoverEffect(resolvedTheme === 'dark' ? "#282828" : "#f8f8f8")}
                        >
                            {/* --- Top Header --- */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Github className={`w-6 h-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} />
                                    <p className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Rudra Chavda</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); window.open("https://github.com/rudrachavda", "_blank"); }} className="text-xs font-medium bg-black hover:bg-[#228636] text-white px-3 py-1 rounded-full transition">Follow</button>
                            </div>

                            {/* --- Contribution Graph --- */}
                            <div className="mt-4 overflow-hidden">
                                {(() => {
                                    // 4 is higher, 1 is lower
                                    const contributionData = [
                                        // December
                                        // [0, 0, 0, 0, 0, 0, 0],
                                        // [0, 0, 0, 0, 1, 0, 0],
                                        // [0, 2, 2, 1, 0, 0, 1],
                                        // [1, 0, 0, 0, 0, 0, 0],
                                        // [1, 1, 0, 0, 1, 0, 0],
                                        // January
                                        [0, 2, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [1, 0, 1, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        // Feburary
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 2, 2, 2, 1],
                                        [2, 1, 2, 4, 3, 3, 2],
                                        // March
                                        [0, 2, 3, 1, 2, 1, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 2, 0, 3, 1],
                                        [4, 0, 3, 1, 0, 1, 0],
                                        [1, 0, 0, 0, 1, 1, 3],
                                        // April
                                        [3, 1, 4, 1, 0, 3, 3],
                                        [0, 1, 1, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 1],
                                        [0, 0, 1, 1, 1, 1, 1],
                                        // May
                                        [1, 2, 1, 2, 1, 1, 1],
                                        [1, 0, 0, 1, 0, 0, 1],
                                        [1, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 1],
                                        // June
                                        [1, 1, 2, 2, 1, 1, 0],
                                        [0, 0, 1, 1, 1, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        // July
                                        [0, 0, 0, 0, 0, 0, 0],
                                        [1, 1, 2, 2, 0, 2, 0],
                                        [0, 0, 0, 1, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0],
                                        // August
                                        [0, 0, 0, 0, 0, 0, 0], // Aug wk1
                                        [2, 2, 2, 1, 2, 1, 0], // Aug wk2
                                        [1, 1, 0, 0, 1, 0, 0], // Aug wk3
                                        [1, 1, 1, 0, 0, 1, 0], // Aug wk4
                                        [0, 0, 1, 1, 1, 1, 1], // Aug wk5
                                        // September
                                        [2, 0, 0, 0, 1, 1, 1], // Sep wk1
                                        [1, 0, 1, 1, 0, 1, 0], // Sep wk2
                                        [0, 0, 1, 1, 0, 0, 1], // Sep wk3
                                        [1, 0, 0, 0, 0, 1, 0], // Sep wk4
                                        [0, 0, 0, 0, 0, 0, 0], // Sep wk5
                                        // Oct


                                    ];
                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
                                    const bgColors = resolvedTheme === 'dark'
                                        ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
                                        : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

                                    return (
                                        <div>
                                            <div className="flex justify-between text-[10px] text-gray-400 pl-8 pr-2" style={opennoteTextStyle}>
                                                {months.map((month, i) => <span key={i}>{month}</span>)}
                                            </div>
                                            <div className="flex gap-2 mt-1">

                                                {/* --- UPDATED Day Label Container --- */}
                                                <div className="flex flex-col gap-1 text-[10px] text-gray-400 w-6 flex-shrink-0 text-right pr-0">
                                                    <div className="h-2.5" /> {/* Spacer for Sunday */}
                                                    <div className="h-2.5 flex items-center justify-end" style={opennoteTextStyle}>Mon</div>
                                                    <div className="h-2.5" /> {/* Spacer for Tuesday */}
                                                    <div className="h-2.5 flex items-center justify-end" style={opennoteTextStyle}>Wed</div>
                                                    <div className="h-2.5" /> {/* Spacer for Thursday */}
                                                    <div className="h-2.5 flex items-center justify-end" style={opennoteTextStyle}>Fri</div>
                                                    <div className="h-2.5" /> {/* Spacer for Saturday */}
                                                </div>

                                                <div
                                                    className="grid w-full gap-1"
                                                    style={{ gridTemplateColumns: `repeat(${contributionData.length}, minmax(0, 1fr))` }}
                                                >
                                                    {contributionData.map((week, weekIndex) => (
                                                        <div key={weekIndex} className="flex flex-col gap-1">
                                                            {week.map((intensity, dayIndex) => (
                                                                <div key={dayIndex} className="w-full h-2.5 rounded-[3px]" style={{ backgroundColor: bgColors[intensity] }} />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* --- Footer with Legend --- */}
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                                <p style={opennoteTextStyle}>429 contributions in the last year</p>

                                <div className="hidden md:flex items-center gap-1.5">
                                    <span style={opennoteTextStyle}>Less</span>
                                    {bgColors.map((color, i) => (
                                        <div key={i} className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
                                    ))}
                                    <span style={opennoteTextStyle}>More</span>
                                </div>
                            </div>
                        </motion.div>
                        {/* --- FINAL GITHUB CARD END --- */}

                        {/* <motion.div
                            variants={itemVariants}
                            className={`${isAnimating ? 'pointer-events-none' : ''} md:col-span-2 rounded-2xl p-6 flex items-center gap-6 cursor-pointer ${resolvedTheme === 'dark' ? 'bg-green-950' : 'bg-green-100/70'}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                        >
                            <div className="flex-grow">
                                <p className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>my beats</p>
                                <p className={`text-sm mb-4 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>coming soon...</p>
                                <button className="flex items-center gap-2 text-sm font-medium bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                                    ▶ Play
                                </button>
                            </div>
                            <div className="w-32 h-32 rounded-lg bg-gray-300 flex-shrink-0 grid grid-cols-2 gap-1 p-1">
                                <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-sm"></div>
                                <div className="bg-gradient-to-br from-green-400 to-cyan-500 rounded-sm"></div>
                                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-sm"></div>
                                <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-sm"></div>
                            </div>
                        </motion.div> */}

                        {/* --- NEW CARD STARTS HERE --- */}
                        <motion.div
                            variants={itemVariants}
                            className={`${isAnimating ? 'pointer-events-none' : ''} md:col-span-2 h-60 rounded-2xl cursor-pointer overflow-hidden flex flex-row ${resolvedTheme === 'dark' ? 'bg-[#171717]' : 'bg-white'}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                            onClick={() => window.open("https://zavaleta.eeb.ucsc.edu/research/npm", "_blank")}
                        >
                            <div className="w-3/5 h-full flex-shrink-0">
                                
                            </div>

                            <div className="flex flex-col flex-grow p-6">
                                <p className="text-xs font-semibold uppercase tracking-normal text-gray-500 mb-2">
                                    Quick Read
                                </p>
                                <h3 className={`text-xl lg:text-2xl font-[600] leading-tight ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900 text-shadow-xs'}`}>
                                    Baskin Engineering Introduces CA-Futures
                                </h3>
                                <h3 className={`text-xl lg:text-2xl font-[600] leading-tight ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900 text-shadow-xs'}`}>
                                    - UCSC
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-[500] text-gray-500 mt-auto pt-4" >
                                    <Clock className="w-4 h-4" />
                                    <span>9/1/2025</span>
                                </div>
                            </div>
                        </motion.div>
                        {/* --- NEW CARD ENDS HERE --- */}

                        {/* --- Apple Foundation Models Card --- */}
                        <motion.div
                            variants={itemVariants}
                            className={`${isAnimating ? 'pointer-events-none' : ''} md:col-span-1 rounded-2xl cursor-pointer overflow-hidden ${resolvedTheme === 'dark' ? 'bg-[#171717]' : 'bg-white'}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                            onClick={() => window.open("https://www.opennote.com/blog/yc-announcement", "_blank")}
                        >
                            {/* Image Section - No Padding */}
                            <div className="w-full h-30 overflow-hidden">
                                <Image
                                    src="/ycopennote.png"
                                    alt="Apple Foundation Models"
                                    width={500}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content Section - With Padding */}
                            <div className="p-6 text-left">
                                <p className="text-xs font-semibold uppercase tracking-normal text-gray-500 mb-2">
                                    Update
                                </p>
                                <h3 className={`text-lg font-[500] leading-tight ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-black'} mb-2`}>
                                    Opennote admitted to the YC S25 batch, and closes $850K USD pre-seed round
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-[500] text-gray-500">
                                    <span>July 10, 2025</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className={`${isAnimating ? 'pointer-events-none' : ''} md:col-span-1 rounded-2xl cursor-pointer overflow-hidden ${resolvedTheme === 'dark' ? 'bg-[#171717]' : 'bg-white'}`}
                            style={{ ...cardBorderRadius, boxShadow: initialShadow }}
                            whileHover={isAnimating ? {} : simpleHoverEffect}
                            onClick={() => window.open(notFound)}
                        >
                            {/* Image Section - No Padding */}
                            <div className="w-full h-30 overflow-hidden bg-[#f8f8f8]">
                                <Image
                                    src="/liqglass.png"
                                    alt="Image"
                                    width={500}
                                    height={128}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Content Section - With Padding */}
                            <div className="p-6 text-left">
                                <p className="text-xs font-semibold uppercase tracking-normal text-gray-500 mb-2">
                                    speculative
                                </p>
                                <h3 className={`text-lg font-[500] leading-tight ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-black'} mb-2`}>
                                    Liquid Glass thoughts and opinions, what could be better and what is amazing.
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-[500] text-gray-500">
                                    <span>July 10, 2025</span>
                                </div>
                            </div>
                        </motion.div>
                        
                    </motion.div>
                </div>
            </div>
        </div>
    );
}