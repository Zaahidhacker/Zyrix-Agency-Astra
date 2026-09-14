"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Assembly } from "./Assembly";
import { storyState } from "./story-state";
export default function Scene() {
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, storyState.mobile ? 1.25 : 1.6]}
      camera={{ position: [0, 0, 8.7], fov: 36, near: 0.1, far: 40 }}
      gl={{
        antialias: !storyState.mobile,
        alpha: true,
        powerPreference: "low-power",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#101112", 0);
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={3} />
      <pointLight position={[-3, -2, 4]} color="#ff4b20" intensity={18} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={4} position={[0, 5, -2]} scale={[12, 5, 1]} />
        <Lightformer
          intensity={3}
          position={[-5, 0, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[7, 5, 1]}
          color="#c3d7ef"
        />
        <Lightformer
          intensity={4}
          position={[5, 1, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          intensity={1}
          position={[0, -4, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 4, 1]}
          color="#ff652f"
        />
      </Environment>
      <Assembly />
    </Canvas>
  );
}
