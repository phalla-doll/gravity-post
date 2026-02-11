import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Post } from '../types';
import { PHYSICS_CONFIG } from '../constants';

interface PhysicsWorldProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

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

  // Function to add a post to the physics world
  const addBodyForPost = useCallback((post: Post, world: Matter.World, containerWidth: number) => {
    if (bodiesMapRef.current.has(post.id)) return;

    const x = Math.random() * (containerWidth - 100) + 50;
    // Increase the vertical spawn range to -5000 to spread out 100 posts
    const y = -Math.random() * 5000 - 100; 
    
    // Create a chamfered rectangle for a "pill" shape
    const body = Matter.Bodies.rectangle(x, y, 160, 60, {
      chamfer: { radius: 25 }, // Rounded corners matching CSS borderRadius
      restitution: 0.5, // Bounciness
      friction: 0.5,
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
        stiffness: 0.1, // Lower stiffness for smoother drag
        damping: 0.1,
        render: { visible: false }
      }
    });

    // Ensure scrolling doesn't interfere
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    Matter.World.add(engine.world, mouseConstraint);
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

          // Prevent text from being upside down for readability
          if (Math.cos(angle) < 0) {
            angle += Math.PI;
          }

          // Apply transform to DOM element
          el.style.transform = `translate(${x - 80}px, ${y - 30}px) rotate(${angle}rad)`;
          
          // Reset if fallen too far out of bounds (glitch safety)
          if (y > height + 200) {
            Matter.Body.setPosition(body, { 
              x: Math.random() * (width - 100) + 50, 
              y: -100 
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

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

  }, [posts, addBodyForPost]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !engineRef.current) return;
      // Ideally update wall positions here if dynamic resizing is needed
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-slate-100 touch-none">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {renderedPosts.map((post) => (
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
          className="absolute top-0 left-0 w-[160px] h-[60px] cursor-grab active:cursor-grabbing select-none will-change-transform z-10"
        >
          {/* Inner Visual Container - Handles color, shape, and hover effects */}
          <div 
            className="w-full h-full flex items-center justify-center p-3 text-center shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
            style={{
              backgroundColor: post.color, 
              borderRadius: '25px', // Matches the physics body chamfer
              color: '#1f2937', 
              fontWeight: 600,
              fontSize: '0.85rem',
              lineHeight: '1.1',
              boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span className="line-clamp-2 overflow-hidden text-ellipsis px-1 pointer-events-none">
              {post.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhysicsWorld;