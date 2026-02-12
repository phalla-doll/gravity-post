import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Post } from '../types';
import { PHYSICS_CONFIG } from '../constants';

interface PhysicsWorldProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

// 5 Distinct sizes based on text length - Scaled down for compacter look
// Added logic for Mobile (Dense) vs Desktop modes
const getPostSize = (text: string, isMobile: boolean) => {
  const len = text.length;
  
  if (isMobile) {
    // Dense Mobile Sizes (approx 65-75% of desktop)
    if (len <= 15) return { width: 60, height: 60, radius: 30, fontSize: '0.65rem' };      // XS
    if (len <= 40) return { width: 100, height: 55, radius: 25, fontSize: '0.7rem' };      // S
    if (len <= 80) return { width: 130, height: 65, radius: 32, fontSize: '0.75rem' };     // M
    if (len <= 120) return { width: 160, height: 75, radius: 38, fontSize: '0.8rem' };     // L
    return { width: 190, height: 90, radius: 45, fontSize: '0.85rem' };                    // XL
  }

  // Standard Desktop Sizes
  if (len <= 15) return { width: 80, height: 80, radius: 40, fontSize: '0.75rem' };      // XS: Circle
  if (len <= 40) return { width: 140, height: 70, radius: 35, fontSize: '0.8rem' };      // S: Small Pill
  if (len <= 80) return { width: 190, height: 90, radius: 45, fontSize: '0.85rem' };     // M: Medium Pill
  if (len <= 120) return { width: 240, height: 110, radius: 55, fontSize: '0.9rem' };    // L: Large Blob
  return { width: 280, height: 130, radius: 65, fontSize: '1rem' };                      // XL: Huge Cloud
};

const PhysicsWorld: React.FC<PhysicsWorldProps> = ({ posts, onPostClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // Track mobile state for sizing
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  
  // State to force re-render of DOM elements when physics updates
  const [renderedPosts, setRenderedPosts] = useState<Post[]>([]);
  
  // Track which post is being dragged
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Interaction tracking for reliable Click vs Drag detection
  // We store this in a ref to persist across re-renders without causing them
  const interactionRef = useRef<{ id: string; startX: number; startY: number; startTime: number } | null>(null);

  // State to trigger re-initialization on resize
  const [sceneKey, setSceneKey] = useState(0);

  // We keep track of bodies to sync with DOM
  const bodiesMapRef = useRef<Map<string, Matter.Body>>(new Map());

  // Handle Resize with Debounce
  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
        setSceneKey(prev => prev + 1);
      }, 300); // Debounce to avoid performance thrashing
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Function to add a post to the physics world
  const addBodyForPost = useCallback((post: Post, world: Matter.World, containerWidth: number) => {
    if (bodiesMapRef.current.has(post.id)) return;

    const { width, height, radius } = getPostSize(post.text, isMobile);

    // Randomize X, ensuring it stays within bounds
    // Clamp x so it doesn't spawn partially inside walls
    const safeXMin = width / 2 + 10;
    const safeXMax = containerWidth - width / 2 - 10;
    const x = Math.max(safeXMin, Math.min(safeXMax, Math.random() * containerWidth));
    
    // Spawn Y Position Logic:
    // Check if post is "fresh" (created in last 2 seconds)
    // This allows fresh posts to drop from just above screen, while bulk loads scatter high up.
    const isFresh = (Date.now() - post.createdAt) < 2000;

    const y = isFresh 
        ? -height - 100 // Just above the viewport
        : -Math.random() * 2500 - 200; // Scattered high up for initial load
    
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      chamfer: { radius: radius }, 
      restitution: 0.3, // Slightly less bouncy for stacking
      friction: 0.6,    // More friction for stability
      density: 0.001,
      label: post.id,
      angle: (Math.random() - 0.5) * 0.5 // Random slight rotation
    });

    // Give fresh posts a downward velocity nudge so they don't get stuck sleeping
    if (isFresh) {
       Matter.Body.setVelocity(body, { x: 0, y: 10 });
    }

    Matter.World.add(world, body);
    bodiesMapRef.current.set(post.id, body);
  }, [isMobile]); // Re-create logic if mobile state changes

  // Initialize Physics Engine
  useEffect(() => {
    if (!containerRef.current) return;

    // Use full height of the container (which is now viewport height)
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // World bounds (Floor, Walls)
    // Floor is slightly below viewport to ensure they stack visibly on bottom edge
    const floor = Matter.Bodies.rectangle(width / 2, height + PHYSICS_CONFIG.WALL_THICKNESS / 2, width, PHYSICS_CONFIG.WALL_THICKNESS, { 
      isStatic: true,
      render: { visible: false }
    });
    
    // Walls - Extended height to guide falling posts
    const leftWall = Matter.Bodies.rectangle(0 - PHYSICS_CONFIG.WALL_THICKNESS / 2, height / 2 - 1000, PHYSICS_CONFIG.WALL_THICKNESS, height * 5, { 
      isStatic: true,
      render: { visible: false } 
    });
    const rightWall = Matter.Bodies.rectangle(width + PHYSICS_CONFIG.WALL_THICKNESS / 2, height / 2 - 1000, PHYSICS_CONFIG.WALL_THICKNESS, height * 5, { 
      isStatic: true, 
      render: { visible: false }
    });

    Matter.World.add(engine.world, [floor, leftWall, rightWall]);

    // --- Mouse Control for Dragging ---
    const mouse = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1, 
        damping: 0.1,
        render: { visible: false }
      }
    });

    // Ensure scrolling doesn't interfere
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    Matter.World.add(engine.world, mouseConstraint);
    
    // Track dragging state purely for visual feedback (cursor style)
    Matter.Events.on(mouseConstraint, 'startdrag', (event: any) => {
      setDraggedId(event.body.label);
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    });

    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      setDraggedId(null);
      if (containerRef.current) containerRef.current.style.cursor = 'default';
    });
    // -------------------------------

    // Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Render loop for syncing DOM
    let animationFrameId: number;
    const updateLoop = () => {
      // Iterate over all active physics bodies
      bodiesMapRef.current.forEach((body, id) => {
        const el = document.getElementById(`post-${id}`);
        // Only update if the DOM element exists
        if (body && el) {
          const { x, y } = body.position;
          let angle = body.angle;
          
          // Safety check for bounds
          if (body.bounds) {
             const bWidth = body.bounds.max.x - body.bounds.min.x; 
             const bHeight = body.bounds.max.y - body.bounds.min.y;

             // Prevent text from being upside down for readability
             if (Math.cos(angle) < 0) {
               angle += Math.PI;
             }
   
             // Apply transform
             el.style.transform = `translate(${x - bWidth / 2}px, ${y - bHeight / 2}px) rotate(${angle}rad)`;
             // Important: Reveal the element now that it's positioned
             el.style.opacity = '1'; 
             
             // Glitch safety: Reset if fallen too far out of bounds
             if (y > height + 200) {
               Matter.Body.setPosition(body, { 
                 x: Math.random() * (bWidth - 100) + 50, 
                 y: -200 
               });
               Matter.Body.setVelocity(body, { x: 0, y: 0 });
             }
          }
        }
      });
      animationFrameId = requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      bodiesMapRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey]); // Re-run on resize

  // Sync Posts with Physics World
  useEffect(() => {
    if (!engineRef.current || !containerRef.current) return;
    
    const world = engineRef.current.world;
    const width = containerRef.current.clientWidth;

    posts.forEach(post => {
      addBodyForPost(post, world, width);
    });
    
    setRenderedPosts(posts);

    // Cleanup bodies of removed posts
    const activeIds = new Set(posts.map(p => p.id));
    bodiesMapRef.current.forEach((body, id) => {
      if (!activeIds.has(id)) {
        Matter.World.remove(world, body);
        bodiesMapRef.current.delete(id);
      }
    });

  }, [posts, addBodyForPost, sceneKey]); 

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden touch-none">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none sticky top-0">
         <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {renderedPosts.map((post) => {
        const { width, height, radius, fontSize } = getPostSize(post.text, isMobile);
        const isDragged = draggedId === post.id;
        
        return (
          <div
            key={post.id}
            id={`post-${post.id}`}
            // React Events for reliable Click vs Drag Detection
            onPointerDown={(e) => {
               // Record start of interaction
               interactionRef.current = {
                   id: post.id,
                   startX: e.clientX,
                   startY: e.clientY,
                   startTime: Date.now()
               };
            }}
            onPointerUp={(e) => {
               const start = interactionRef.current;
               if (!start || start.id !== post.id) return;

               const deltaX = Math.abs(e.clientX - start.startX);
               const deltaY = Math.abs(e.clientY - start.startY);
               const dist = Math.hypot(deltaX, deltaY);
               const timeDiff = Date.now() - start.startTime;

               // Mobile Click Logic:
               // If moved less than 15px and released within 600ms, treat as click.
               // We ignore the Matter.js 'isDragging' state here because sometimes Matter
               // thinks it's dragging even for micro-movements, but UI-wise it's a click.
               if (dist < 15 && timeDiff < 600) {
                   onPostClick(post);
               }
               
               // Reset
               interactionRef.current = null;
            }}
            className={`absolute top-0 left-0 opacity-0 cursor-grab active:cursor-grabbing select-none will-change-transform pointer-events-auto ${isDragged ? 'z-50' : 'z-10'}`}
            style={{ width, height }}
          >
            {/* Inner Visual Container - Glassmorphism & Gradient Effects */}
            <div 
              className={`
                w-full h-full flex items-center justify-center px-3 py-1 text-center transition-all duration-300 ease-out animate-pop-in
                ${isDragged ? 'scale-110 brightness-105' : 'hover:scale-105 active:scale-95'}
              `}
              style={{
                background: `
                  linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.05) 100%),
                  ${post.color}
                `,
                borderRadius: `${radius}px`,
                color: '#1f2937', 
                fontWeight: 600,
                fontSize: fontSize,
                lineHeight: '1.2',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: isDragged 
                  ? '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255,255,255,0.5)' 
                  : '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
              }}
            >
              <span className="line-clamp-3 overflow-hidden text-ellipsis pointer-events-none drop-shadow-sm">
                {post.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhysicsWorld;