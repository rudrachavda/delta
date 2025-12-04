"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    CloudSun,
    BatteryCharging,
    Zap,
    Car,
    Wind,
    PlugZap,
    Cable,
    Trash2,
    List,
    Circle,
    Cloud, // Added
    Sun,   // Added
    Moon,  // Added
    Navigation, // Added for location arrow
    TriangleAlert // Added for hazard warning
} from 'lucide-react';

// --- Constants & Config ---
const GRID_SIZE = 160;
const GAP = 24;

// --- Helper Functions ---
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

const getWidgetConfig = (size) => {
    switch (size) {
        case 'small': return { colSpan: 1, rowSpan: 1 };
        case 'medium': return { colSpan: 2, rowSpan: 1 };
        case 'large': return { colSpan: 2, rowSpan: 2 };
        default: return { colSpan: 1, rowSpan: 1 };
    }
};

const getDimensions = (size) => {
    const { colSpan, rowSpan } = getWidgetConfig(size);
    return {
        w: colSpan * GRID_SIZE + (colSpan - 1) * GAP,
        h: rowSpan * GRID_SIZE + (rowSpan - 1) * GAP
    };
};

// --- CSS ---
const TearStripStyles = React.memo(() => (
    <style dangerouslySetInnerHTML={{
        __html: `
        /* --- Font Declarations --- */
        @font-face {
            font-family: 'SF Pro Rounded';
            src: url('/fonts/SF-Pro-Rounded-Regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'SF Pro';
            src: url('/fonts/SF-Pro.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        /* --- Global Font Smoothing --- */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* --- Utility Classes for Fonts --- */
        .font-rounded {
            font-family: 'SF Pro Rounded', sans-serif !important;
        }
        .font-text {
            font-family: 'SF Pro', sans-serif !important;
        }

        :root {
            --bg: #fff; /* Sticky Note Yellow */
            --tab-darkness: 40;
            --bg-alpha: 1;
            --shadow-reveal: 0;
            --shadow-width: 0;
            --shadow-multiplier: 0.8;
            --shadow-spread: 0;
            --bg-size: 0;
        }

        /* Context Menu Animation */
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .context-menu-anim {
            animation: scaleIn 0.1s ease-out forwards;
        }

        .tear-strip {
            font-family: 'SF Pro Rounded', sans-serif; /* UI Label uses Rounded */
            font-size: 1.3rem;
            font-weight: bold;
            width: clamp(300px, 470px, 28vw);
            width: 344px;
            height: 64px;
            display: grid;
            place-items: center;
        /* translate: 0 -80%;*/
            position: relative;
            border: 2px dashed hsl(0 0% 81%);
            border-radius: 100px;
            background: linear-gradient(hsl(0 0% 91%), hsl(0 0% 91%)) padding-box;
            color: hsl(0, 0%, 70%);
            z-index: 50;
            overflow: visible !important;
        }

        .tear-strip__content {
            position: absolute;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #854d0e;
            pointer-events: none;
            right: 2rem;
            z-index: 0;
        }

        .tear-strip__strip {
            position: absolute;
            inset: 0;
            background: var(--bg);
            display: flex;
            border-radius: 100px;
            align-items: center;
            justify-content: center;
            clip-path: inset(-100% 0 -100% 1px);
            color: hsl(0, 0%, 71%);
            font-weight: 500;
        }

        .tear-strip__shadow {
            position: absolute;
            height: 100%;
            width: 20px;
            background: linear-gradient(90deg, transparent, hsl(0 0% 10% / 0.5));
            filter: blur(8px);
            transform-origin: 100% 50%;
            left: 0;
            opacity: 0;
            z-index: 90;
        }

        .tear-strip__back {
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: 100px;
            right: 100%;
            z-index: 80;
        }

        .tear-strip__backing {
            background: linear-gradient(90deg, hsl(0 0% calc(var(--tab-darkness, 40) * 1%) / var(--bg-alpha, 1)), hsl(0 0% 100% / var(--bg-alpha, 1)), hsl(0 0% 80% / var(--bg-alpha, 1)));
            background-position: 100% 50%;
            background-repeat: no-repeat;
            background-color: hsl(0 0% 93%);
            background-size: calc(var(--bg-size, 0) * 1px) 100%;
            position: absolute;
            inset: 0;
            border-radius: 1000px;
        }

        .tear-strip__backing::before {
            content: "";
            position: absolute;
            inset: 0 -8px 0 0;
            filter: blur(4px);
            background: radial-gradient(hsl(0 0% 10% / 0.5), transparent 80%);
            border-radius: 1000px;
            z-index: -1;
            opacity: var(--shadow-reveal, 0);
        }

        .tear-strip__back-shadow {
            position: absolute;
            border-radius: 1000px;
            background: transparent;
            right: 0;
            top: 50%;
            height: 100%;
            translate: 0 -50%;
            width: calc((var(--shadow-width) * var(--shadow-multiplier, 0.8)) * 1px);
            z-index: -1;
            min-width: 100px;
            box-shadow:
                0 0 calc(var(--shadow-spread, 0) * 60px) hsl(10 0% 50% / 0.35);
        }

        .tear-strip__strip svg {
            background: hsl(78, 75%, 57%);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            padding: 8px;
            position: absolute;
            left: 10px;
            color: white;
            stroke-width: 2.5px;
            transform-origin: 100% 50%;
        }

        .tear-strip__handle {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            aspect-ratio: 1;
            background: hsl(280 0% 75% / var(--alpha, 0));
            border-radius: 50%;
            scale: 1.35;
            transition: background 0.2s;
            cursor: grab;
            z-index: 200; /* Highest Z-Index for interaction */
        }
        .tear-strip__handle:active {
            cursor: grabbing;
        }
        .tear-strip__handle:hover:not(:active) {
            --alpha: 0.25;
        }

        .strip-text {
             pointer-events: none;
             font-size: 1rem;
             font-weight: 600;
             letter-spacing: 0.025em;
             color: hsl(0, 0%, 71%); 
        }
    `}} />
));

// --- TearStrip Component ---
const TearStrip = ({ children, onTearComplete }) => {
    const stripRef = useRef(null)
    const tabRef = useRef(null)
    const backingRef = useRef(null)
    const handleRef = useRef(null)
    const iconRef = useRef(null)
    const draggableRef = useRef(null)
    const shadowRef = useRef(null)
    const proxyRef = useRef(null)
    const [torn, setTorn] = useState(false)
    const [gsapLoaded, setGsapLoaded] = useState(false);

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                if (!window.gsap) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
                if (!window.Draggable) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Draggable.min.js');
                window.gsap.registerPlugin(window.Draggable);
                setGsapLoaded(true);
            } catch (e) {
                console.error("GSAP load failed", e);
            }
        };
        loadDependencies();
    }, []);

    useEffect(() => {
        if (!gsapLoaded || !stripRef.current) return;
        if (!proxyRef.current) proxyRef.current = document.createElement('div');

        const gsap = window.gsap;
        const Draggable = window.Draggable;
        const DISTANCE_OF_RESISTANCE = stripRef.current.offsetWidth * 0.25;
        const DROP_PROPS = {
            yPercent: 1000,
            rotate: -20,
            opacity: 0,
            duration: 0.65,
        };

        gsap.set(handleRef.current, { x: 0, y: 0 });

        draggableRef.current = Draggable.create(proxyRef.current, {
            type: 'x,y',
            trigger: handleRef.current,
            allowContextMenu: true,
            dragResistance: 0.5,

            onDrag: function (event) {
                if (this.__void) return false;

                if (this.__torn) {
                    return gsap.to(tabRef.current, {
                        x: this.x - stripRef.current.offsetWidth * 2,
                        y: this.y,
                        duration: 0.1,
                    });
                }

                const HANDLE_HEIGHT = handleRef.current.offsetHeight;
                if (this.y < this.startY - HANDLE_HEIGHT * 0.5 || this.y > this.startY + HANDLE_HEIGHT * 0.5) {
                    return (this.__void = true);
                }

                if (this.x > this.startX) {
                    this.dragResistance = gsap.utils.clamp(
                        0,
                        this.dragResistance,
                        gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0.99, 0, this.x)
                    );
                }

                if (!this.__torn) {
                    const clip = gsap.utils.mapRange(0, stripRef.current.offsetWidth * 2, 0, stripRef.current.offsetWidth, this.x);
                    gsap.set(tabRef.current, { clipPath: `inset(-100% -1000% -100% ${clip}px)` });
                }

                gsap.set(stripRef.current, {
                    '--tab-darkness': gsap.utils.clamp(10, 80, gsap.utils.mapRange(0, stripRef.current.offsetWidth, 10, 80, this.x)),
                    '--shadow-spread': gsap.utils.clamp(0, 1, gsap.utils.mapRange(stripRef.current.offsetWidth * 0.25, stripRef.current.offsetWidth, 0, 1, this.x)),
                    '--shadow-reveal': gsap.utils.clamp(0, 1, gsap.utils.mapRange(stripRef.current.offsetWidth * 0.1, stripRef.current.offsetWidth * 0.2, 0, 1, this.x)),
                    '--shadow-width': this.x * 0.5,
                    '--bg-size': this.x * 0.5,
                    '--shadow-multiplier': gsap.utils.clamp(0.8, 0.9, gsap.utils.mapRange(stripRef.current.offsetWidth, stripRef.current.offsetWidth * 2, 0.8, 0.9, this.x)),
                });

                gsap.set(iconRef.current, {
                    scaleX: gsap.utils.clamp(0.75, 1, gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 1, 0.75, this.x)),
                    xPercent: gsap.utils.clamp(0, 50, gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE, 0, 50, this.x)),
                });

                gsap.set(backingRef.current, { transformOrigin: '0% 50%', x: this.x });

                gsap.set(shadowRef.current, {
                    x: this.x * 0.5,
                    xPercent: -90,
                    scaleX: gsap.utils.clamp(1, 2, gsap.utils.mapRange(stripRef.current.offsetWidth, stripRef.current.offsetWidth * 2, 1, 2, this.x)),
                    opacity: this.x > stripRef.current.offsetWidth
                        ? gsap.utils.clamp(0, 1, gsap.utils.mapRange(stripRef.current.offsetWidth, stripRef.current.offsetWidth * 2, 1, 0, this.x))
                        : gsap.utils.clamp(0, 1, gsap.utils.mapRange(15, 100, 0, 1, this.x)),
                });

                const x = this.__torn ? this.x : gsap.utils.clamp(0, stripRef.current.offsetWidth, this.x);
                gsap.set(handleRef.current, { x });

                if (this.x < stripRef.current.offsetWidth) {
                    gsap.set(backingRef.current, { scaleX: gsap.utils.clamp(0.9, 1, gsap.utils.mapRange(0, DISTANCE_OF_RESISTANCE * 2, 1, 0.9, this.x)) });
                } else {
                    gsap.set(backingRef.current, { scaleX: gsap.utils.clamp(0.9, 1, gsap.utils.mapRange(stripRef.current.offsetWidth * 2 - DISTANCE_OF_RESISTANCE * 2, stripRef.current.offsetWidth * 2, 0.9, 1, this.x)) });
                }

                if (this.x > stripRef.current.offsetWidth * 1.99) {
                    this.__torn = true;
                    gsap.to(backingRef.current, { xPercent: 25, ease: 'elastic.out(1, 0.9)', '--bg-alpha': 0.75 });
                }
            },

            onRelease: function (event) {
                this.__void = false;
                if (this.__torn) {
                    gsap.to(tabRef.current, {
                        ...DROP_PROPS,
                        onComplete: () => {
                            setTorn(true);
                            if (onTearComplete) onTearComplete();
                        },
                    });
                } else {
                    gsap.to([handleRef.current, backingRef.current, shadowRef.current], { x: 0, duration: 0.5 });
                    gsap.to(tabRef.current, { clipPath: `inset(-100% -100% -100% 0px)`, duration: 0.5 });
                    gsap.set(proxyRef.current, { x: 0, y: 0 });
                }
            },
        });

        return () => {
            if (draggableRef.current && draggableRef.current[0]) draggableRef.current[0].kill();
        };
    }, [gsapLoaded]);

    return (
        <div ref={stripRef} className="tear-strip">
            <div className="tear-strip__content">
                <p>{children}</p>
            </div>
            <span ref={shadowRef} className="tear-strip__shadow"></span>
            {!torn && (
                <>
                    <div ref={tabRef} className="tear-strip__strip shadow-sm">
                        <svg ref={iconRef} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                        <div ref={backingRef} className="tear-strip__back">
                            <div className="tear-strip__back-shadow"></div>
                            <div className="tear-strip__backing"></div>
                        </div>
                        <span className="strip-text">Tear to Delete</span>
                    </div>
                    <div ref={handleRef} className="tear-strip__handle" title="Drag to tear"></div>
                </>
            )}
        </div>
    )
}

// --- Sticky Note Container ---
const StickyNoteWrapper = ({ onRemove }) => {
    const containerRef = useRef(null);

    const handleTearComplete = () => {
        if (containerRef.current && window.gsap) {
            window.gsap.to(containerRef.current, {
                y: 500,
                rotate: 10,
                opacity: 0,
                duration: 0.5,
                delay: 0.1,
                ease: "power2.in",
                onComplete: onRemove
            });
        } else {
            onRemove();
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col bg-white rounded-[2rem] shadow-xl relative z-10 widget-text">
            <TearStrip onTearComplete={handleTearComplete}>
                <span className="font-rounded">Deleted!</span>
            </TearStrip>

            <div className="flex-1 p-6 pt-2 bg-white relative rounded-b-[2rem]">
                <textarea
                    className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-medium placeholder:text-yellow-700/50 text-lg leading-relaxed font-text"
                    placeholder="Write a note..."
                    defaultValue="Meeting at 2 PM..."
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

// --- Context Menu Component (ADDED) ---
const ContextMenu = ({ x, y, widgetId, type, currentSize, onClose, onResize, onDelete }) => {
    const getSizes = () => {
        if (type === 'battery') return ['small', 'medium', 'large'];
        if (type === 'sticky') return ['medium', 'large'];
        return ['small', 'medium', 'large'];
    };
    const sizes = getSizes();

    return (
        <div
            className="fixed z-[999] bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1.5 w-48 flex flex-col gap-1 context-menu-anim"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-2 py-1 text-xs font-bold text-zinc-500 uppercase tracking-wider font-rounded border-b border-white/5 mb-1 pb-2">
                Widget Options
            </div>

            {sizes.map((size) => (
                <button
                    key={size}
                    onClick={() => { onResize(widgetId, size); onClose(); }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors font-text ${currentSize === size ? 'bg-blue-500 text-white font-medium' : 'text-zinc-300 hover:bg-white/10'}`}
                >
                    <span className="capitalize">{size}</span>
                    {currentSize === size && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
            ))}

            <div className="h-px bg-white/10 my-1 mx-1" />
            <button
                onClick={() => { onDelete(widgetId); onClose(); }}
                className="flex items-center px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-text w-full text-left"
            >
                <Trash2 size={14} className="mr-2" />
                Remove Widget
            </button>
        </div>
    );
};


// --- Main Grid Component ---

const WidgetCard = ({ widget, isGhost = false, isValid = true, style, onRemove, onContextMenu }) => {
    const { w, h } = getDimensions(widget.size);
    const cardRef = useRef(null);

    // Added: Deletion Animation Trigger
    const handleRemoveAnimation = (id) => {
        if (cardRef.current && window.gsap) {
            window.gsap.to(cardRef.current, {
                y: 500,
                rotate: 10,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => onRemove(id)
            });
        } else {
            onRemove(id);
        }
    };

    let ghostStyles = 'bg-white/20 border-white/30';
    if (isGhost) {
        ghostStyles = isValid
            ? 'bg-green-500/20 border-green-400/50'
            : 'bg-red-500/20 border-red-400/50';
    }

    const isSticky = widget.type === 'sticky';
    const contentClasses = isSticky
        ? 'w-full h-full'
        : 'w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden rounded-[2rem] text-white flex flex-col hover:border-white/20 widget-text';

    const baseClasses = `
    absolute transition-all duration-200 ease-out select-none
    ${isGhost
            ? `${ghostStyles} border-2 border-dashed z-0 rounded-[2rem]`
            : 'z-10'
        }
  `;

    if (isGhost) {
        return <div style={{ ...style, width: w, height: h }} className={`${baseClasses} rounded-[2rem]`} />;
    }

    // Pass the animation handler up to the context menu
    const safeOnContextMenu = (e, w) => {
        if (onContextMenu) {
            onContextMenu(e, w, handleRemoveAnimation);
        }
    }

    const renderContent = () => {
        switch (widget.type) {
            case 'sticky':
                return <StickyNoteWrapper onRemove={() => onRemove(widget.id)} />;
            case 'battery':
                return (
                    <div className="p-5 flex flex-col justify-between h-full bg-gradient-to-br from-green-500/20 to-transparent">
                        <div className="flex items-center space-x-2 text-green-400">
                            <Cable size={20} />
                            <span className="font-semibold text-sm font-text">Charging</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold tracking-normal font-rounded">100%</span>
                            <span className="text-xs text-white/50 mt-1 font-text">MacBook Pro</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-400 w-full h-full" />
                        </div>
                    </div>
                );
            case 'calendar':
                if (widget.type === 'calendar') {
                    // --- SMALL: Single Event Focus ---
                    if (widget.size === 'small') {
                        return (
                            <div className="flex flex-col h-full bg-zinc-900 p-4 relative">
                                <div className="text-red-500 font-bold uppercase text-[10px] tracking-wider font-rounded mb-0.5">Wednesday</div>
                                <div className="text-4xl font-normal text-white font-rounded mb-1">3</div>

                                <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-text">Tomorrow</div>
                                <div className="flex items-center text-white text-xs font-bold font-text">
                                    <div className="w-1 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    4 all-day events
                                </div>
                            </div>
                        );
                    }

                    // --- MEDIUM: Agenda List ---
                    if (widget.size === 'medium') {
                        return (
                            <div className="flex h-full bg-zinc-900 p-5 gap-6">
                                {/* Left Column: Date & Pills */}
                                <div className="flex flex-col w-[45%]">
                                    <div className="text-red-500 font-bold uppercase text-[10px] tracking-wider font-rounded mb-0.5">Wednesday</div>
                                    <div className="text-4xl font-normal text-white font-rounded mb-1">3</div>

                                    <div className="flex flex-col gap-1">
                                        <div className="bg-yellow-500/20 text-yellow-400 px-0.5 py-0 rounded-full text-[10px] font-bold font-text truncate flex items-center">
                                            <Circle size={10} className="mr-1.5 inline fill-current" />
                                            Self Assessment Qu...
                                        </div>
                                        <div className="bg-yellow-500/20 text-yellow-400 px-0.5 py-0 rounded-full text-[10px] font-bold font-text truncate flex items-center">
                                            <Circle size={10} className="mr-1.5 inline fill-current" />
                                            Self Assessment Qu...
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Up Next */}
                                <div className="flex flex-col flex-1 border-l border-white/10 pl-5">
                                    <div className="mb-3">
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-text leading-none">Tomorrow</div>
                                        <div className="flex items-center text-white text-xs font-bold font-text">
                                            <div className="w-1 h-3 bg-yellow-500 rounded-full mr-1"></div>
                                            4 all-day events
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2 font-text leading-none">Friday, Dec 5</div>
                                        <div className="flex flex-col gap-1">
                                            <div className="border-l-2 rounded-xs bg-teal-300/10 border-teal-200 pl-1 p-0.5">
                                                <div className="text-teal-100 font-bold text-[11px] font-text leading-3">PHYS 5A - Lecture</div>
                                                <div className="text-teal-100 text-[11px] font-text leading-3">10:40 – 11:45AM</div>
                                            </div>
                                            <div className="border-l-2 rounded-xs bg-teal-300/10 border-teal-200 pl-1 p-0.5">
                                                <div className="text-teal-100 font-bold text-[11px] font-text leading-3">AM 10 - Lecture</div>
                                                <div className="text-teal-100 text-[11px] font-text leading-3">1:20 – 2:25PM</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // --- LARGE: Split Timeline ---
                    return (
                        <div className="flex h-full bg-zinc-900 text-white relative">
                            {/* Left Panel: Today */}
                            <div className="w-1/2 p-5 border-r border-white/10 flex flex-col relative">
                                <div className="mb-4">
                                    <div className="text-red-500 font-bold uppercase text-[10px] tracking-wider font-rounded mb-0.5">Wednesday</div>
                                    <div className="text-4xl font-normal text-white font-rounded">3</div>
                                    <div className="mt-2 flex items-center text-xs font-bold text-white font-text">
                                        <div className="text-yellow-400 rounded mr-1"><Circle size={12} className="fill-current" /></div>
                                        2 all-day events
                                    </div>
                                </div>

                                {/* Timeline Visualization */}
                                <div className="flex-1 relative mt-2">
                                    {/* Time Markers */}
                                    <div className="absolute inset-0 flex flex-col justify-between text-zinc-600 text-[10px] font-bold font-text py-1">
                                        <span>8</span>
                                        <span>9</span>
                                        <span>10</span>
                                        <span>11</span>
                                        <span>12</span>
                                    </div>
                                    {/* Horizontal Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between py-2 pl-6">
                                        <div className="w-full h-px bg-white/10"></div>
                                        <div className="w-full h-px bg-white/10"></div>
                                        <div className="w-full h-px bg-white/10"></div>
                                        <div className="w-full h-px bg-white/10"></div>
                                        <div className="w-full h-px bg-white/10"></div>
                                    </div>
                                    {/* Current Time Indicator (Red Line) */}
                                    <div className="absolute top-[45%] left-6 right-0 h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] flex items-center">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full -ml-[3px]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Tomorrow */}
                            <div className="w-1/2 p-5 flex flex-col">
                                <div className="mb-4 pt-1">
                                    <div className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider font-rounded mb-2">Tomorrow</div>
                                    <div className="flex items-center text-xs font-bold text-white font-text">
                                        <div className="text-yellow-400 rounded mr-1"><Circle size={12} className="fill-current" /></div>
                                        4 all-day events
                                    </div>
                                </div>

                                {/* Timeline Visualization */}
                                <div className="flex-1 relative mt-2">
                                    {/* Time Markers */}
                                    <div className="absolute inset-0 flex flex-col justify-between text-zinc-600 text-[10px] font-bold font-text py-1">
                                        <span>9</span>
                                        <span>10</span>
                                        <span>11</span>
                                        <span>12</span>
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                    </div>
                                    {/* Horizontal Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between py-2 pl-6">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="w-full h-px bg-white/10"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            case 'weather':
                if (widget.size === 'small') {
                    return (
                        <div className="flex flex-col justify-between h-full p-4 bg-[#1C1C1E] text-white relative">
                            <div>
                                <div className="flex items-center gap-1 text-[13px] font-medium font-text">
                                    Santa Cruz <Navigation size={10} className="fill-current" />
                                </div>
                                <div className="text-5xl font-light font-rounded mt-1">48°</div>
                            </div>
                            <div className="mt-auto">
                                <Cloud size={16} className="mb-2 fill-current text-white" />
                                <div className="text-[11px] font-medium leading-tight font-text">
                                    Beach hazards statement & 1 more
                                </div>
                            </div>
                        </div>
                    );
                }

                // --- MEDIUM WEATHER ---
                if (widget.size === 'medium') {
                    return (
                        <div className="flex flex-col h-full p-5 bg-[#1C1C1E] text-white relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-1 text-[13px] font-medium font-text">
                                        Santa Cruz <Navigation size={10} className="fill-current" />
                                    </div>
                                    <div className="text-5xl font-light font-rounded">48°</div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <Cloud size={24} className="mb-1 fill-current text-white" />
                                    <div className="text-[11px] font-medium leading-tight font-text max-w-[140px]">
                                        Beach hazards statement & 1 more
                                    </div>
                                </div>
                            </div>

                            {/* Hourly Strip */}
                            <div className="flex justify-between mt-auto border-t border-white/10 pt-3">
                                {[
                                    { time: '9 PM', icon: Cloud, temp: '47°' },
                                    { time: '10 PM', icon: Cloud, temp: '46°' },
                                    { time: '11 PM', icon: Cloud, temp: '45°' },
                                    { time: '12 AM', icon: Cloud, temp: '45°' },
                                    { time: '1 AM', icon: Cloud, temp: '45°' },
                                    { time: '2 AM', icon: Cloud, temp: '44°' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <span className="text-[10px] text-zinc-400 font-bold font-text">{item.time}</span>
                                        <item.icon size={16} className="fill-current text-white" />
                                        <span className="text-[12px] font-medium font-rounded">{item.temp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // --- LARGE WEATHER ---
                return (
                    <div className="flex flex-col h-full p-6 bg-[#1C1C1E] text-white relative">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <div className="flex items-center gap-1 text-[13px] font-medium font-text">
                                    Santa Cruz <Navigation size={10} className="fill-current" />
                                </div>
                                <div className="text-6xl font-light font-rounded mt-[-4px]">48°</div>
                            </div>
                            <div className="text-right">
                                <div className="flex justify-end mb-1"><Cloud size={24} className="fill-current text-white" /></div>
                                <div className="text-[13px] font-medium font-text">Mostly Cloudy</div>
                                <div className="text-[13px] font-medium font-text">H:61° L:44°</div>
                            </div>
                        </div>

                        {/* Alert Line */}
                        <div className="flex items-center gap-2 py-2 border-b border-white/10 mb-3">
                            <TriangleAlert size={14} className="text-white fill-white" />
                            <span className="text-[11px] font-medium font-text">Beach Hazards Statement & 1 More</span>
                        </div>

                        {/* Hourly Strip */}
                        <div className="flex justify-between mb-5 border-b border-white/10 pb-4">
                            {[
                                { time: '9 PM', icon: Cloud, temp: '47°' },
                                { time: '10 PM', icon: Cloud, temp: '46°' },
                                { time: '11 PM', icon: Cloud, temp: '45°' },
                                { time: '12 AM', icon: Cloud, temp: '45°' },
                                { time: '1 AM', icon: Cloud, temp: '45°' },
                                { time: '2 AM', icon: Cloud, temp: '44°' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] text-zinc-400 font-bold font-text">{item.time}</span>
                                    <item.icon size={16} className="fill-current text-white" />
                                    <span className="text-[13px] font-medium font-rounded">{item.temp}</span>
                                </div>
                            ))}
                        </div>

                        {/* Daily Forecast List */}
                        <div className="flex flex-col gap-3">
                            {[
                                { day: 'Thu', icon: Sun, low: '43°', high: '62°', range: 'from-cyan-400 to-green-400' },
                                { day: 'Fri', icon: Sun, low: '44°', high: '61°', range: 'from-cyan-400 to-green-400' },
                                { day: 'Sat', icon: Sun, low: '47°', high: '64°', range: 'from-green-400 to-yellow-400' },
                                { day: 'Sun', icon: Sun, low: '48°', high: '65°', range: 'from-green-400 to-yellow-400' },
                            ].map((day, i) => (
                                <div key={i} className="flex items-center justify-between font-text font-bold">
                                    <span className="w-10 text-[13px]">{day.day}</span>
                                    <day.icon size={16} className="text-yellow-400 fill-current" />
                                    <div className="flex items-center gap-3 flex-1 px-4">
                                        <span className="text-[13px] text-zinc-400 w-6 text-right">{day.low}</span>
                                        <div className="h-1 flex-1 bg-zinc-700 rounded-full relative overflow-hidden">
                                            <div className={`absolute top-0 bottom-0 left-0 w-[80%] bg-gradient-to-r ${day.range} rounded-full`} />
                                        </div>
                                        <span className="text-[13px] text-white w-6">{day.high}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'reminders':
                // --- SMALL: Simple Count (Unchanged) ---
                if (widget.size === 'small') {
                    return (
                        <div className="p-4 flex flex-col justify-between h-full bg-zinc-800">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mb-2">
                                <List size={18} strokeWidth={3} />
                            </div>
                            <div>
                                <span className="text-4xl font-bold font-rounded block">6</span>
                                <div className="text-[13px] font-bold text-orange-500 font-text">Reminders</div>
                            </div>
                        </div>
                    );
                }

                // --- MEDIUM: Split View ---
                if (widget.size === 'medium') {
                    return (
                        <div className="flex h-full bg-[#1C1C1E] p-4">
                            {/* Left Panel */}
                            <div className="flex flex-col justify-between w-[35%]">
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                    <List size={18} strokeWidth={3} />
                                </div>
                                <div>
                                <span className="text-4xl font-bold font-rounded block">6</span>
                                    <div className="text-[13px] font-bold text-orange-500 font-text">Reminders</div>
                                </div>
                            </div>

                            {/* Right Panel: List */}
                            <div className="flex-1 pl-4 flex flex-col justify-center gap-2.5 overflow-hidden">
                                {['Catch Up on Physics...', 'Tau Beta Payment', 'Pay Tuition', 'Do PS10'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-zinc-500 shrink-0" />
                                        <span className="text-[13px] font-medium text-white truncate font-text">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // --- LARGE: Full List with Header ---
                return (
                    <div className="flex flex-col h-full bg-[#1C1C1E] p-5">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-[42px] font-bold font-rounded text-white leading-none">6</div>
                                <div className="text-[15px] font-bold text-orange-500 font-text mt-1">Reminders</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                <List size={20} strokeWidth={3} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-zinc-700/50 mb-4" />

                        {/* List */}
                        <div className="flex-1 flex flex-col gap-3.5 overflow-hidden">
                            {['Catch Up on Physics Lecture', 'Tau Beta Payment', 'Pay Tuition', 'Do PS10', 'Quiz 10', 'Hwk 10'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-[1.5px] border-zinc-500 shrink-0" />
                                    <span className="text-[14px] font-medium text-white truncate font-text">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'car':
                return (
                    <div className="p-4 h-full relative overflow-hidden bg-zinc-900">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Car size={80} className="text-white/10" />
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center space-x-2 text-zinc-400">
                                <PlugZap size={16} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold tracking-wider uppercase font-rounded">Tesla Model 3</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-bold text-white font-rounded">240<span className="text-base text-zinc-500 font-normal ml-1 font-text">mi</span></div>
                                    <div className="text-xs text-green-400 mt-1 font-text">Connected</div>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                                        <Wind size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return <div className="p-4">Unknown</div>;
        }
    };

    return (
        <div
            ref={cardRef}
            style={{ ...style, width: w, height: h }}
            className={`${baseClasses} rounded-[2rem] active:scale-[1.02] active:shadow-3xl active:z-50`}
            onContextMenu={(e) => {
                e.preventDefault();
                safeOnContextMenu(e, widget);
            }}
        >
            <div className={`${contentClasses} ${!isSticky ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                {renderContent()}
            </div>
        </div>
    );
};

const INITIAL_WIDGETS = [
    { id: '1', type: 'battery', size: 'small', col: 0, row: 0 },
    { id: '2', type: 'weather', size: 'medium', col: 2, row: 0 },
    { id: '3', type: 'calendar', size: 'large', col: 0, row: 2 },
    { id: '4', type: 'reminders', size: 'small', col: 4, row: 0 },
    { id: '5', type: 'car', size: 'medium', col: 4, row: 2 },
    // Sticky Note
    { id: '6', type: 'sticky', size: 'medium', col: 2, row: 1 },
];

export default function Grid() {
    const [widgets, setWidgets] = useState(INITIAL_WIDGETS);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const removeWidget = (id) => {
        setWidgets(prev => prev.filter(w => w.id !== id));
    };

    const handleResize = (id, newSize) => {
        setWidgets(prev => prev.map(w =>
            w.id === id ? { ...w, size: newSize } : w
        ));
    };

    const handleContextMenu = (e, widget, deleteAnimationCallback) => {
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            widgetId: widget.id,
            type: widget.type,
            currentSize: widget.size,
            deleteAnimationCallback
        });
    };

    const getPixelPosition = (col, row) => ({
        x: GAP + col * (GRID_SIZE + GAP),
        y: GAP + row * (GRID_SIZE + GAP)
    });

    const getGridPosition = (x, y) => {
        const col = Math.round((x - GAP) / (GRID_SIZE + GAP));
        const row = Math.round((y - GAP) / (GRID_SIZE + GAP));
        return { col, row };
    };

    const isOverlapping = (id, col, row, colSpan, rowSpan) => {
        for (const w of widgets) {
            if (w.id === id) continue;
            const { colSpan: wColSpan, rowSpan: wRowSpan } = getWidgetConfig(w.size);
            const isIntersecting = !(
                col + colSpan <= w.col ||
                col >= w.col + wColSpan ||
                row + rowSpan <= w.row ||
                row >= w.row + wRowSpan
            );
            if (isIntersecting) return true;
        }
        return false;
    };

    const isOutOfBounds = (col, row, colSpan, rowSpan) => {
        if (col < 0 || row < 0) return true;
        const maxCols = Math.floor((containerSize.width - GAP) / (GRID_SIZE + GAP));
        const maxRows = Math.floor((containerSize.height - GAP) / (GRID_SIZE + GAP));
        return (col + colSpan > maxCols) || (row + rowSpan > maxRows);
    };

    const handleMouseDown = (e, id, currentX, currentY) => {
        setContextMenu(null); // Close menu on interaction
        // Prevent moving widget if clicking inside the tear strip handle or sticky note textarea
        if (e.target.closest('.tear-strip__handle') || e.target.tagName === 'TEXTAREA') return;

        if (e.button !== 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setDraggingId(id);
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setMousePos({ x: currentX, y: currentY });
    };

    const handleMouseMove = (e) => {
        if (!draggingId) return;
        const container = containerRef.current.getBoundingClientRect();
        const x = e.clientX - container.left - dragOffset.x;
        const y = e.clientY - container.top - dragOffset.y;
        setMousePos({ x, y });
    };

    const handleMouseUp = () => {
        if (!draggingId) return;
        const { col, row } = getGridPosition(mousePos.x, mousePos.y);
        const widget = widgets.find(w => w.id === draggingId);
        const { colSpan, rowSpan } = getWidgetConfig(widget.size);

        const hasOverlap = isOverlapping(draggingId, col, row, colSpan, rowSpan);
        const outOfBounds = isOutOfBounds(col, row, colSpan, rowSpan);

        const isValid = !hasOverlap && !outOfBounds;

        if (isValid) {
            setWidgets(prev => prev.map(w => {
                if (w.id === draggingId) {
                    return { ...w, col, row };
                }
                return w;
            }));
        }
        setDraggingId(null);
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-screen overflow-hidden bg-gray-900 text-white relative select-none"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setContextMenu(null)}
        >
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <TearStripStyles />

            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                    backgroundSize: `${GRID_SIZE + GAP}px ${GRID_SIZE + GAP}px`,
                    backgroundPosition: `${GAP}px ${GAP}px`
                }}
            />

            <div className="relative w-full h-full p-6">
                {widgets.map(widget => {
                    const isDragging = draggingId === widget.id;
                    let x, y;
                    if (isDragging) {
                        x = mousePos.x;
                        y = mousePos.y;
                    } else {
                        const pos = getPixelPosition(widget.col, widget.row);
                        x = pos.x;
                        y = pos.y;
                    }

                    let ghostEl = null;
                    if (isDragging) {
                        const { col, row } = getGridPosition(mousePos.x, mousePos.y);
                        const ghostPos = getPixelPosition(col, row);
                        const { colSpan, rowSpan } = getWidgetConfig(widget.size);
                        const hasOverlap = isOverlapping(widget.id, col, row, colSpan, rowSpan);
                        const outOfBounds = isOutOfBounds(col, row, colSpan, rowSpan);
                        const isValid = !hasOverlap && !outOfBounds;

                        ghostEl = (
                            <WidgetCard
                                widget={widget}
                                isGhost={true}
                                isValid={isValid}
                                style={{
                                    left: ghostPos.x,
                                    top: ghostPos.y,
                                    zIndex: 0
                                }}
                            />
                        );
                    }

                    return (
                        <React.Fragment key={widget.id}>
                            {ghostEl}
                            <div
                                onMouseDown={(e) => handleMouseDown(e, widget.id, x, y)}
                                className="absolute transition-transform duration-75 will-change-transform"
                                style={{
                                    left: x,
                                    top: y,
                                    zIndex: isDragging ? 50 : 10,
                                    transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                }}
                            >
                                <WidgetCard
                                    widget={widget}
                                    onRemove={removeWidget}
                                    onContextMenu={handleContextMenu}
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Context Menu Render */}
            {contextMenu && (
                <ContextMenu
                    {...contextMenu}
                    onClose={() => setContextMenu(null)}
                    onResize={handleResize}
                    onDelete={() => {
                        if (contextMenu.deleteAnimationCallback) {
                            contextMenu.deleteAnimationCallback(contextMenu.widgetId);
                        } else {
                            removeWidget(contextMenu.widgetId);
                        }
                    }}
                />
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-sm font-medium text-white/80 shadow-xl pointer-events-none font-text">
                {draggingId ? "Release to snap" : "Drag widgets to organize"}
            </div>
        </div>
    );
}