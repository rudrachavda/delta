"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    Battery,
    CloudSun,
    CheckSquare,
    BatteryCharging,
    Zap,
    Car,
    Wind
} from 'lucide-react';

// --- Constants & Config ---
const GRID_SIZE = 160; // Base unit size in pixels
const GAP = 24;        // Gap between widgets

// Helper to calculate dimensions (Col/Row spans)
const getWidgetConfig = (size) => {
    switch (size) {
        case 'small': return { colSpan: 1, rowSpan: 1 };
        case 'medium': return { colSpan: 2, rowSpan: 1 };
        case 'large': return { colSpan: 2, rowSpan: 2 };
        default: return { colSpan: 1, rowSpan: 1 };
    }
};

// Helper to get pixel dimensions from spans
const getDimensions = (size) => {
    const { colSpan, rowSpan } = getWidgetConfig(size);
    return {
        w: colSpan * GRID_SIZE + (colSpan - 1) * GAP,
        h: rowSpan * GRID_SIZE + (rowSpan - 1) * GAP
    };
};

// --- Mock Data ---
// We now store col/row instead of raw X/Y for easier collision math, 
// but we'll calculate X/Y on the fly for rendering.
const INITIAL_WIDGETS = [
    { id: '1', type: 'battery', size: 'small', col: 0, row: 0 },
    { id: '2', type: 'weather', size: 'medium', col: 2, row: 0 },
    { id: '3', type: 'calendar', size: 'large', col: 0, row: 2 },
    { id: '4', type: 'reminders', size: 'small', col: 4, row: 0 },
    { id: '5', type: 'car', size: 'medium', col: 4, row: 2 },
];

const WidgetCard = ({ widget, isGhost = false, isValid = true, style }) => {
    const { w, h } = getDimensions(widget.size);

    // Dynamic styles for the ghost based on validity
    let ghostStyles = 'bg-white/20 border-white/30';
    if (isGhost) {
        ghostStyles = isValid 
            ? 'bg-green-500/20 border-green-400/50' // Valid spot
            : 'bg-red-500/20 border-red-400/50';    // Invalid spot
    }

    const baseClasses = `
    absolute transition-all duration-200 ease-out select-none overflow-hidden
    ${isGhost 
        ? `${ghostStyles} border-2 border-dashed z-0` 
        : 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl z-10 hover:border-white/20'
    }
    rounded-[2rem] text-white flex flex-col
  `;

    if (isGhost) {
        return <div style={{ ...style, width: w, height: h }} className={baseClasses} />;
    }

    // --- Widget Content Renderers ---
    const renderContent = () => {
        switch (widget.type) {
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
                            <div className="border-l-4 border-gray-300 pl-3 py-1 opacity-50">
                                <p className="text-xs text-gray-500 font-bold uppercase">4:00 PM</p>
                                <p className="font-semibold text-sm">Gym</p>
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
                                <CheckSquare size={20} className="fill-current text-neutral-800" />
                                <span className="font-bold">Reminders</span>
                            </div>
                            <span className="text-2xl font-bold">4</span>
                        </div>
                        <ul className="space-y-3 mt-1">
                            <li className="flex items-center space-x-3 group">
                                <div className="w-4 h-4 rounded-full border-2 border-white/30 group-hover:border-orange-400 transition-colors" />
                                <span className="text-sm font-medium truncate">Call Mom</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <div className="w-4 h-4 rounded-full border-2 border-white/30 group-hover:border-orange-400 transition-colors" />
                                <span className="text-sm font-medium truncate">Buy Milk</span>
                            </li>
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
                                    <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                                        <Zap size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="p-4">Unknown Widget</div>;
        }
    };

    return (
        <div
            style={{
                ...style,
                width: w,
                height: h,
                cursor: 'grab',
            }}
            className={`${baseClasses} active:cursor-grabbing active:scale-[1.02] active:shadow-3xl active:z-50`}
        >
            {renderContent()}
        </div>
    );
};

export default function Grid() {
    const [widgets, setWidgets] = useState(INITIAL_WIDGETS);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    // Update container size on mount/resize
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

    // --- Geometry Helpers ---

    const getPixelPosition = (col, row) => ({
        x: GAP + col * (GRID_SIZE + GAP),
        y: GAP + row * (GRID_SIZE + GAP)
    });

    // Convert pixel coordinate to nearest Grid Column/Row
    const getGridPosition = (x, y) => {
        const col = Math.round((x - GAP) / (GRID_SIZE + GAP));
        const row = Math.round((y - GAP) / (GRID_SIZE + GAP));
        return { col, row };
    };

    // Check if a widget at (col, row) with (colSpan, rowSpan) overlaps any OTHER widget
    const isOverlapping = (id, col, row, colSpan, rowSpan) => {
        for (const w of widgets) {
            if (w.id === id) continue; // Skip self

            const { colSpan: wColSpan, rowSpan: wRowSpan } = getWidgetConfig(w.size);
            
            // Check intersection
            const isIntersecting = !(
                col + colSpan <= w.col ||     // Left of w
                col >= w.col + wColSpan ||    // Right of w
                row + rowSpan <= w.row ||     // Above w
                row >= w.row + wRowSpan       // Below w
            );

            if (isIntersecting) return true;
        }
        return false;
    };

    // Check if widget is within the container bounds
    const isOutOfBounds = (col, row, colSpan, rowSpan) => {
        if (col < 0 || row < 0) return true;
        
        // Calculate max cols/rows based on current container size
        const maxCols = Math.floor((containerSize.width - GAP) / (GRID_SIZE + GAP));
        const maxRows = Math.floor((containerSize.height - GAP) / (GRID_SIZE + GAP));
        
        return (col + colSpan > maxCols) || (row + rowSpan > maxRows); 
    };

    const handleMouseDown = (e, id, currentX, currentY) => {
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

        // Calculate potential snap position
        const { col, row } = getGridPosition(mousePos.x, mousePos.y);
        
        // Get size of dragging widget
        const widget = widgets.find(w => w.id === draggingId);
        const { colSpan, rowSpan } = getWidgetConfig(widget.size);

        // Validate Move
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
        } else {
            // Optional: You could show a "shake" animation here
            // For now, it just snaps back to original position (handled by state reset below)
        }

        setDraggingId(null);
    };

    const bgStyle = {
        backgroundImage: `url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-screen overflow-hidden bg-gray-900 text-white relative select-none"
            style={bgStyle}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            
            {/* Debug Grid (Optional) */}
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
                    
                    // Logic for position:
                    // If dragging, follow mouse. 
                    // If idle, use the Grid Col/Row converted to Pixels.
                    let x, y;
                    if (isDragging) {
                        x = mousePos.x;
                        y = mousePos.y;
                    } else {
                        const pos = getPixelPosition(widget.col, widget.row);
                        x = pos.x;
                        y = pos.y;
                    }

                    // Ghost Calculation
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
                                <WidgetCard widget={widget} />
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