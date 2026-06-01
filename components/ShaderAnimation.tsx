'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type ShaderAnimationProps = {
  className?: string;
};

// A WebGL line field for the hero background. Retinted to Direction A: an ink
// base with lines blending cyan-motion into signal, no other hues. Like
// opengraph-image.tsx, the shader runs without the DOM, so it uses hex that
// mirrors the tokens in globals.css. Keep these in sync with @theme.
export function ShaderAnimation({ className = 'h-full w-full' }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } };
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // ink #14171C, signal #2F6BFF, cyan-motion #11C5D4 as normalized rgb.
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        float glow = 0.0;
        for (int i = 0; i < 5; i++) {
          glow += lineWidth * float(i * i) / abs(fract(t + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }

        vec3 ink = vec3(0.078, 0.090, 0.110);
        vec3 signal = vec3(0.184, 0.420, 1.0);
        vec3 cyan = vec3(0.067, 0.773, 0.831);
        vec3 lineColor = mix(cyan, signal, clamp(length(uv) * 0.6, 0.0, 1.0));
        vec3 color = ink + lineColor * glow;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Force the canvas to always visually fill the container via CSS, decoupled
    // from the drawing-buffer pixel size. This guarantees the canvas covers the
    // full fixed wrapper (including behind iOS bars) regardless of when or how
    // clientHeight is measured.
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      // updateStyle = false: keep the canvas at 100% x 100% CSS, only resize the buffer.
      renderer.setSize(width, height, false);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    sceneRef.current = { renderer, uniforms, animationId: 0 };

    // Respect reduced motion: render one static frame, no animation loop.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        const animationId = requestAnimationFrame(animate);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
        if (sceneRef.current) sceneRef.current.animationId = animationId;
      };
      animate();
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  // background mirrors the ink token; ImageResponse-style exception applies.
  return (
    <div ref={containerRef} className={className} style={{ background: '#14171C', overflow: 'hidden' }} />
  );
}
