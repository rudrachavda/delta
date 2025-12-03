'use client'
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Link from "next/link";

const Error = () => {

    // --- Theme Detection and Mounting State ---
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = resolvedTheme === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
            },
        },
    };

    // --- MODIFIED CODE START ---
    const itemVariants = {
        hidden: { opacity: 0, y: 40, filter: 'blur(50px)' }, // Reduced blur for a cleaner effect
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                // General transition for properties like 'y' and 'opacity'
                type: 'spring',
                stiffness: 100,
                damping: 15,

                // Specific override for the 'filter' property to prevent glitches
                filter: { 
                    type: 'tween', 
                    duration: 0.25, 
                    ease: 'easeOut' 
                },
            },
        },
    };
    // --- MODIFIED CODE END ---

    const fourofourstyle = {
        fontFamily: '"Departure Mono Regular", "Departure Mono Regular Placeholder", monospace',
        fontSize: '56px',
        fontStyle: 'normal',
        letterSpacing: '-0.06em',
        margin: 0,
        textAlign: 'start',
        textDecoration: 'none',
        textTransform: 'none',
        color: isDarkMode ? 'white' : 'black',
        WebkitTextStrokeWidth: '0.2px',
        WebkitTextStrokeColor: isDarkMode ? 'white' : 'black',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
    };

    const textstyle = { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif, "System Default", sans-serif', fontSize: '14px', fontWeight: 400, color: resolvedTheme === 'dark' ? 'rgba(225, 225, 225, 1)' : 'black', WebkitTextStroke: resolvedTheme === 'dark' ? '0px' : '.2px black', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' };
    const linktextsytle = {...textstyle, color: resolvedTheme === 'dark' ? '#a0a5ac' : '#a0a5ac', WebkitTextStroke: resolvedTheme === 'dark' ? '.2px' : '.2px #a0a5ac', WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }
    if (!mounted) {
        return null;
    }

    return (
        <div className={`m-0 h-screen flex justify-center items-center overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#101010]' : 'bg-white'}`}>
            <motion.div
                className='text-left space-y-0 max-[809px]:w-full max-[809px]:px-10 max-[809px]:text-left'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                <motion.h1
                    variants={itemVariants}
                    style={fourofourstyle}
                >
                    404
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    style={textstyle}
                >
                    Oops! The page you're looking for doesn't exist yet.
                </motion.p>

                <motion.p 
                    variants={itemVariants}
                >
                    <Link href='/' style={linktextsytle} className={`hover:underline`}>
                        Return to the homepage
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Error;