import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Post } from '../types';
import { PHYSICS_CONFIG } from '../constants';

interface PhysicsWorldProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

// 5 Distinct sizes based on text length - Scaled down for compacter look
const getPostSize = (text: string) => {
  const len = text.length;
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
  
  // Ref to track click start position for distinguishing drag vs click
  const clickStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // We keep track of bodies to sync with DOM
  const bodiesMapRef = useRef<Map<string, Matter.Body>>(new Map());
  
  // State to force re-render of DOM elements when physics updates
  const [renderedPosts, setRenderedPosts] = useState<Post[]>([]);
  
  // Track which post is being dragged
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // State to trigger re-initialization on resize
  const [sceneKey, setSceneKey] = useState(0);

  // Handle Resize with Debounce
  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
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

    const { width, height, radius } = getPostSize(post.text);

    // Randomize X, ensuring it stays within bounds
    const x = Math.random() * (containerWidth - width) + width / 2;
    
    // Spawn just above the viewport
    // We spread them vertically slightly (-100 to -600) so they don't all collide instantly if added in bulk
    const y = -Math.random() * 500 - 100; 
    
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      chamfer: { radius: radius }, 
      restitution: 0.3, // Slightly less bouncy for stacking
      friction: 0.6,    // More friction for stability
      density: 0.001,
      label: post.id,
      angle: (Math.random() - 0.5) * 0.5 // Random slight rotation
    });

    Matter.World.add(world, body);
    bodiesMapRef.current.set(post.id, body);
  }, []);

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
    const floor = Matter.Bodies.rectangle(width / 2, height + PHYSICS_CONFIG.WALL_THICKNESS / 2, width, PHYSICS_CONFIG.WALL_THICKNESS, { 
      isStatic: true,
      render: { visible: false }
    });
    
    // Walls
    const leftWall = Matter.Bodies.rectangle(0 - PHYSICS_CONFIG.WALL_THICKNESS / 2, height / 2, PHYSICS_CONFIG.WALL_THICKNESS, height * 5, { 
      isStatic: true,
      render: { visible: false } 
    });
    const rightWall = Matter.Bodies.rectangle(width + PHYSICS_CONFIG.WALL_THICKNESS / 2, height / 2, PHYSICS_CONFIG.WALL_THICKNESS, height * 5, { 
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
    
    // Add drag events for visual feedback
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
      posts.forEach(post => {
        const body = bodiesMapRef.current.get(post.id);
        const el = document.getElementById(`post-${post.id}`);
        if (body && el) {
          const { x, y } = body.position;
          let angle = body.angle;
          
          // Get dynamic dimensions to calculate center offset
          const { width, height: postHeight } = getPostSize(post.text);

          // Prevent text from being upside down for readability
          if (Math.cos(angle) < 0) {
            angle += Math.PI;
          }

          // Apply transform to DOM element (centering based on dynamic width/height)
          el.style.transform = `translate(${x - width / 2}px, ${y - postHeight / 2}px) rotate(${angle}rad)`;
          
          // Reset if fallen too far out of bounds (glitch safety)
          if (y > height + 200) {
            Matter.Body.setPosition(body, { 
              x: Math.random() * (width - 100) + 50, 
              y: -200 
            });
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
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
      // Important: Clear bodies map so they are re-created in the next sync
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

  }, [posts, addBodyForPost, sceneKey]); // Depend on sceneKey to re-populate after reset

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden touch-none">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none sticky top-0">
         <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {renderedPosts.map((post) => {
        const { width, height, radius, fontSize } = getPostSize(post.text);
        const isDragged = draggedId === post.id;
        
        return (
          <div
            key={post.id}
            id={`post-${post.id}`}
            onPointerDown={(e) => {
              clickStartRef.current = { x: e.clientX, y: e.clientY };
            }}
            onClick={(e) => {
              if (!clickStartRef.current) return;
              const dist = Math.hypot(
                e.clientX - clickStartRef.current.x,
                e.clientY - clickStartRef.current.y
              );
              // If moved less than 10px, treat as click
              if (dist < 10) {
                onPostClick(post);
              }
              clickStartRef.current = null;
            }}
            className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing select-none will-change-transform ${isDragged ? 'z-50' : 'z-10'}`}
            style={{ width, height }}
          >
            {/* Inner Visual Container - Glassmorphism & Gradient Effects */}
            <div 
              className={`
                w-full h-full flex items-center justify-center px-3 py-1 text-center transition-all duration-300 ease-out
                ${isDragged ? 'scale-110 brightness-105' : 'hover:scale-105 active:scale-95'}
              `}
              style={{
                // Enhanced Gradient Background: 
                // 1. White specular highlight (Top-Left)
                // 2. Base Color
                background: `
                  linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.05) 100%),
                  ${post.color}
                `,
                borderRadius: `${radius}px`,
                color: '#1f2937', 
                fontWeight: 600,
                fontSize: fontSize,
                lineHeight: '1.2',
                // Glass-like Border
                border: '1px solid rgba(255,255,255,0.5)',
                // Soft shadow + Inset shine for volume
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