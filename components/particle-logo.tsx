"use client"

import React, { useEffect, useRef, memo } from 'react';
import type p5 from 'p5';

type P5Instance = p5;

const ModernLogoComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<P5Instance>();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;
    isInitialized.current = true;

    let cleanup: (() => void) | undefined;

    void import('p5').then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (p: P5Instance): void => {
        let time = 0;
        const size = 15;
        const particles: Array<{ angle: number; radius: number; speed: number; offset: number }> = [];
        const numParticles = 40;

        // Initialize swirl particles with phase offset
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            angle: (360 / numParticles) * i,
            radius: p.random(size * 0.5, size * 0.9),
            speed: p.random(0.1, 0.2),
            offset: i * (360 / numParticles)
          });
        }
        
        p.setup = (): void => {
          const canvas = p.createCanvas(50, 50);
          canvas.elt.setAttribute('aria-label', 'Modern Logo');
          canvas.elt.setAttribute('role', 'img');
          p.pixelDensity(window.devicePixelRatio || 2);
          p.angleMode(p.DEGREES);
          p.smooth();
        };

        p.draw = (): void => {
          p.clear();
          p.translate(p.width / 2, p.height / 2);
          p.rotate(30);
          
          time += 0.01;
          const breathe = p.sin(time * 2) * 0.15;

          // Draw main shape
          p.push();
          
          // Create subtle gradient effect
          for (let i = 0; i < 2; i++) {
            const alpha = p.map(i, 0, 1, 255, 60);
            const scale = 1 + i * 0.1 + breathe * 0.03;
            
            p.push();
            p.scale(scale);
            
            // Main shape fill
            p.noStroke();
            p.fill(255, alpha);
            
            // Draw hexagon
            p.beginShape();
            for (let j = 0; j < 6; j++) {
              const angle = (360 / 6) * j;
              const x = p.cos(angle) * size;
              const y = p.sin(angle) * size;
              p.vertex(x, y);
            }
            p.endShape(p.CLOSE);
            
            p.pop();
          }

          // Draw swirling particles with wave effect
          p.noFill();
          particles.forEach((particle, i) => {
            // Update particle position with wave motion
            particle.angle += particle.speed;
            const waveOffset = p.sin(time * 3 + particle.offset) * 2;
            const currentRadius = particle.radius + waveOffset;
            const x = p.cos(particle.angle) * currentRadius;
            const y = p.sin(particle.angle) * currentRadius;
            
            // Draw particle with fading trail
            const baseAlpha = p.map(p.sin(particle.angle + particle.offset), -1, 1, 10, 30);
            p.strokeWeight(0.4);
            
            // Draw curved trail
            const trailLength = 4;
            for (let j = 0; j < trailLength; j++) {
              const trailAngle = particle.angle - j * 3;
              const trailRadius = currentRadius - j * 0.5;
              const tx = p.cos(trailAngle) * trailRadius;
              const ty = p.sin(trailAngle) * trailRadius;
              const trailAlpha = baseAlpha * (1 - j / trailLength);
              p.stroke(255, trailAlpha);
              
              if (j === 0) {
                p.point(x, y);
              } else {
                p.line(x, y, tx, ty);
              }
            }
          });

          p.pop();
        };

        const visibilityHandler = (): void => {
          if (document.hidden) {
            p.noLoop();
          } else {
            p.loop();
          }
        };

        document.addEventListener('visibilitychange', visibilityHandler);
        cleanup = () => {
          document.removeEventListener('visibilitychange', visibilityHandler);
        };
      };

      p5Instance.current = new p5(sketch, containerRef.current);
    });

    return () => {
      cleanup?.();
      p5Instance.current?.remove();
      isInitialized.current = false;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-[50px] h-[50px] flex items-center justify-center bg-transparent select-none"
      aria-hidden="true"
    />
  );
};

export const ParticleLogo = memo(ModernLogoComponent); 