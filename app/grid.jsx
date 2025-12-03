"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    CloudSun,
    BatteryCharging,
    Zap,
    Car,
    Wind
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
const TearStripStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
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

        .tear-strip {
	        font-size: 1.3rem;
	        font-weight: bold;
	        width: clamp(300px, 470px, 28vw);
	        width: 344px;
	        height: 78px;
	        display: grid;
	        place-items: center;
        /*	translate: 0 -80%;*/
	        position: relative;
	        border: 3px dashed hsl(0 0% 81%);
	        border-radius: 100px;
	        background: linear-gradient(hsl(0 0% 91%), hsl(0 0% 91%)) padding-box;
	        color: hsl(0, 0%, 70%);
            z-index: 50;
            overflow: visible; !important
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
             font-weight: 500;
             color: hsl(0, 0%, 71%); 
        }
    `}} />
);

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
            dragResistance: 0.99,

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

    // FIX: Removed 'overflow-hidden' from here and applied rounded-b to the content only
    return (
        <div ref={containerRef} className="w-full h-full flex flex-col bg-white rounded-[2rem] shadow-xl relative z-10">
            <TearStrip onTearComplete={handleTearComplete}>
                Deleted!
            </TearStrip>

            <div className="flex-1 p-6 pt-2 bg-white relative rounded-b-[2rem]">
                <textarea
                    className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-medium placeholder:text-yellow-700/50 text-lg leading-relaxed"
                    placeholder="Write a note..."
                    defaultValue="Meeting at 2 PM..."
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};


// --- Main Grid Component ---

const WidgetCard = ({ widget, isGhost = false, isValid = true, style, onRemove }) => {
    const { w, h } = getDimensions(widget.size);

    let ghostStyles = 'bg-white/20 border-white/30';
    if (isGhost) {
        ghostStyles = isValid
            ? 'bg-green-500/20 border-green-400/50'
            : 'bg-red-500/20 border-red-400/50';
    }

    const isSticky = widget.type === 'sticky';
    const contentClasses = isSticky
        ? 'w-full h-full'
        : 'w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden rounded-[2rem] text-white flex flex-col hover:border-white/20';

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

    const renderContent = () => {
        switch (widget.type) {
            case 'sticky':
                return <StickyNoteWrapper onRemove={() => onRemove(widget.id)} />;
            case 'battery':
                return (
                    <div className="p-5 flex flex-col justify-between h-full bg-gradient-to-br from-green-500/20 to-transparent">
                        <div className="flex items-center space-x-2 text-green-400">
                            <BatteryCharging size={20} />
                            <span className="font-semibold text-sm">Charging</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold font-mono tracking-tighter">100%</span>
                            <span className="text-xs text-white/50 mt-1">MacBook Pro</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-400 w-full h-full" />
                        </div>
                    </div>
                );
            case 'calendar':
                return (
                    <div className="flex h-full bg-white text-black">
                        <div className="w-1/3 bg-red-500 text-white p-4 flex flex-col items-center justify-center">
                            <span className="text-lg font-medium uppercase">Wed</span>
                            <span className="text-6xl font-bold tracking-tighter">3</span>
                        </div>
                        <div className="flex-1 p-4 flex flex-col space-y-3">
                            <div className="border-l-4 border-orange-400 pl-3 py-1">
                                <p className="text-xs text-gray-500 font-bold uppercase">10:00 AM</p>
                                <p className="font-semibold text-sm">Team Standup</p>
                            </div>
                            <div className="border-l-4 border-blue-400 pl-3 py-1">
                                <p className="text-xs text-gray-500 font-bold uppercase">1:00 PM</p>
                                <p className="font-semibold text-sm">Design Review</p>
                            </div>
                        </div>
                    </div>
                );
            case 'weather':
                return (
                    <div className="p-6 h-full flex items-center justify-between bg-gradient-to-br from-blue-500/30 to-blue-900/10">
                        <div className="flex flex-col">
                            <span className="text-lg font-medium">Santa Cruz</span>
                            <span className="text-5xl font-light">72°</span>
                            <span className="text-sm text-blue-200 mt-1">Mostly Sunny</span>
                        </div>
                        <CloudSun size={64} className="text-yellow-400 drop-shadow-lg" />
                    </div>
                );
            case 'reminders':
                return (
                    <div className="p-5 h-full flex flex-col bg-neutral-800/80">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2 text-orange-400">
                                <span className="font-bold">Reminders</span>
                            </div>
                            <span className="text-2xl font-bold">4</span>
                        </div>
                        <ul className="space-y-3 mt-1">
                            {['Call Mom', 'Buy Milk'].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 group">
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 group-hover:border-orange-400 transition-colors" />
                                    <span className="text-sm font-medium truncate">{item}</span>
                                </li>
                            ))}
                        </ul>
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
                                <Zap size={16} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold tracking-wider uppercase">Tesla Model 3</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-bold text-white">240<span className="text-base text-zinc-500 font-normal ml-1">mi</span></div>
                                    <div className="text-xs text-green-400 mt-1">Connected</div>
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
            style={{ ...style, width: w, height: h }}
            className={`${baseClasses} rounded-[2rem] active:scale-[1.02] active:shadow-3xl active:z-50`}
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
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-sm font-medium text-white/80 shadow-xl pointer-events-none">
                {draggingId ? "Release to snap" : "Drag widgets to organize"}
            </div>
        </div>
    );
}