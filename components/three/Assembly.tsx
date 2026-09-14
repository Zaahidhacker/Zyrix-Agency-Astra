"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Mesh, MathUtils, MeshPhysicalMaterial } from "three";
import { frameGeometry } from "./geometry";
import { storyState as state } from "./story-state";
export function Assembly() {
  const group = useRef<Group>(null);
  const frames = useRef<Mesh[]>([]);
  const { invalidate, viewport } = useThree();
  const geometry = useMemo(() => frameGeometry(state.mobile ? 2 : 4), []);
  const materials = useMemo(
    () => [
      new MeshPhysicalMaterial({
        color: "#b8bdc5",
        metalness: 1,
        roughness: 0.24,
        clearcoat: 0.65,
        clearcoatRoughness: 0.25,
      }),
      new MeshPhysicalMaterial({
        color: "#d3a525",
        metalness: 0.7,
        roughness: 0.27,
        emissive: "#8f6500",
        emissiveIntensity: 0.2,
      }),
    ],
    [],
  );
  const remaining = useRef(100);
  const sample = useRef({ frames: 0, time: 0, adapted: false });
  const count = state.mobile ? 7 : 10;
  useEffect(() => {
    const wake = () => {
      if (state.visible && !document.hidden) {
        remaining.current = state.reduced ? 1 : 75;
        invalidate();
      }
    };
    ["pointermove", "resize", "zyrix:frame", "visibilitychange"].forEach(
      (event) => window.addEventListener(event, wake, { passive: true }),
    );
    wake();
    return () => {
      ["pointermove", "resize", "zyrix:frame", "visibilitychange"].forEach(
        (event) => window.removeEventListener(event, wake),
      );
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [geometry, materials, invalidate]);
  useFrame(({ camera, setDpr }, delta) => {
    if (!group.current || !state.visible || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    if (delta < 0.1 && !sample.current.adapted) {
      sample.current.frames++;
      sample.current.time += delta;
      if (sample.current.frames === 45) {
        if (sample.current.time > 1.5) setDpr(1);
        sample.current.adapted = true;
      }
    }
    const reduced = state.reduced;
    const speed = reduced ? 1 : 1 - Math.exp(-dt * 7);
    const isOwner = state.chapter === "owner";
    const spread =
      state.chapter === "unfold"
        ? state.progress
        : Math.min(1, state.progress) * 0.7 + 0.18;
    const x = state.mobile
      ? 0
      : isOwner
        ? -viewport.width * 0.28
        : state.chapter === "contact"
          ? 0
          : state.chapter === "work"
            ? MathUtils.lerp(
                viewport.width * 0.27,
                -viewport.width * 0.27,
                state.progress,
              )
            : state.chapter === "pricing"
              ? viewport.width * 0.3
              : viewport.width * 0.225;
    const y = state.mobile ? state.targetY * viewport.height : 0.1;
    group.current.position.x = MathUtils.lerp(
      group.current.position.x,
      x,
      speed,
    );
    group.current.position.y = MathUtils.lerp(
      group.current.position.y,
      y,
      speed,
    );
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      0.35 + (reduced ? 0 : state.pointerY * 0.09) + spread * 0.12,
      speed,
    );
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      -0.53 + (reduced ? 0 : state.pointerX * 0.12) + spread * 0.55,
      speed,
    );
    group.current.rotation.z = MathUtils.lerp(
      group.current.rotation.z,
      -0.31 + spread * 0.45,
      speed,
    );
    const scale = state.mobile
      ? 0.54
      : isOwner
        ? 0.72
        : state.chapter === "contact"
          ? 0.65
          : 1.05;
    group.current.scale.setScalar(
      MathUtils.lerp(group.current.scale.x, scale, speed),
    );
    frames.current.forEach((mesh, i) => {
      const relative = i - (count - 1) / 2;
      mesh.position.z = MathUtils.lerp(
        mesh.position.z,
        relative * (0.13 + spread * 0.31),
        speed,
      );
      mesh.rotation.z = MathUtils.lerp(
        mesh.rotation.z,
        relative * (0.045 + spread * 0.065),
        speed,
      );
      const material = mesh.material as MeshPhysicalMaterial;
      material.roughness = 0.2 + spread * 0.1;
      if (i === 0 || i === count - 1)
        material.emissiveIntensity = 0.12 + spread * 0.35;
      const s = 1 - i * 0.035;
      mesh.scale.set(s, s, 1);
    });
    camera.position.z = MathUtils.lerp(
      camera.position.z,
      8.7 - spread * 0.25,
      speed,
    );
    camera.lookAt(0, 0, 0);
    if (--remaining.current > 0 && !reduced) invalidate();
  });
  return (
    <group
      ref={group}
      position={[state.mobile ? 0 : 3, state.mobile ? -0.8 : 0, 0]}
      rotation={[0.35, -0.53, -0.31]}
    >
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) frames.current[i] = el;
          }}
          geometry={geometry}
          material={materials[i === 0 || i === count - 1 ? 1 : 0]}
          position={[0, 0, (i - 4.5) * 0.18]}
          rotation={[0, 0, (i - 4.5) * 0.07]}
        />
      ))}
    </group>
  );
}
