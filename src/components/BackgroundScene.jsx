"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { particleCountForDevice, shouldUseWebGL } from "@/lib/webgl";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.055;
    vec2 p = uv * vec2(1.35, 1.0);
    float n = fbm(p * 2.4 + vec2(t, -t * 0.55));
    float n2 = fbm(p * 3.1 - vec2(t * 0.42, t * 0.68));

    vec3 cream = vec3(0.957, 0.937, 0.902);
    vec3 gold = vec3(0.78, 0.655, 0.46);
    vec3 burgundy = vec3(0.42, 0.176, 0.235);
    vec3 ink = vec3(0.173, 0.141, 0.125);

    vec3 col = mix(cream, gold, smoothstep(0.28, 0.72, n));
    col = mix(col, burgundy, smoothstep(0.58, 0.95, n2) * 0.38);
    col = mix(col, ink, smoothstep(0.82, 1.0, n) * 0.12);

    vec2 c1 = vec2(0.28 + sin(t * 0.85) * 0.07, 0.62 + cos(t * 0.55) * 0.05);
    vec2 c2 = vec2(0.74 + cos(t * 0.5) * 0.08, 0.34 + sin(t * 0.7) * 0.06);
    float o1 = 0.16 / (length(uv - c1) + 0.18);
    float o2 = 0.11 / (length(uv - c2) + 0.22);
    col += gold * o1 * 0.09;
    col += burgundy * o2 * 0.07;

    float vignette = smoothstep(1.15, 0.25, length(uv - 0.5));
    col = mix(col * 0.88, col, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SilkPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader,
        fragmentShader,
      }),
    [],
  );
  const { viewport } = useThree();

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh scale={[viewport.width * 1.15, viewport.height * 1.15, 1]} position={[0, 0, -1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function GoldDust({ count }) {
  const points = useRef(null);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.elapsedTime;
    points.current.rotation.y = t * 0.018;
    points.current.rotation.x = Math.sin(t * 0.04) * 0.06;
    points.current.position.y = Math.sin(t * 0.12) * 0.08;
  });

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.018}
        color="#e4c79a"
        transparent
        opacity={0.48}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ count }) {
  return (
    <>
      <SilkPlane />
      <GoldDust count={count} />
    </>
  );
}

function MeshFallback() {
  return <div className="mesh-fallback absolute inset-0" aria-hidden />;
}

export default function BackgroundScene() {
  const [mode, setMode] = useState("pending");
  const [frameloop, setFrameloop] = useState("always");
  const [count, setCount] = useState(220);

  useEffect(() => {
    const enabled = shouldUseWebGL();
    setMode(enabled ? "webgl" : "css");
    setCount(particleCountForDevice());

    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {mode !== "webgl" ? <MeshFallback /> : null}
      {mode === "webgl" ? (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={frameloop}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
            depth: false,
          }}
          camera={{ position: [0, 0, 5], fov: 42 }}
          style={{ pointerEvents: "none" }}
        >
          <AdaptiveDpr pixelated />
          <Scene count={count} />
        </Canvas>
      ) : null}
    </div>
  );
}
