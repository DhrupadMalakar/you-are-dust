import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, Float, Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const stages = [
  {
    title: "Sometimes life becomes too much.",
    subtitle: "Thoughts collapse inward. The world feels impossibly heavy.",
    cameraZ: 18
  },
  {
    title: "Your worries feel infinite.",
    subtitle: "Like standing at the edge of an event horizon.",
    cameraZ: 14
  },
  {
    title: "But even infinities have scale.",
    subtitle: "Beyond the dark, galaxies drift in silence.",
    cameraZ: 10
  },
  {
    title: "One galaxy.",
    subtitle: "Among hundreds of billions.",
    cameraZ: 7
  },
  {
    title: "One star.",
    subtitle: "A small fire in a spiral of ancient light.",
    cameraZ: 5
  },
  {
    title: "One planet.",
    subtitle: "Blue. Fragile. Alive.",
    cameraZ: 3.8
  },
  {
    title: "Find yourself.",
    subtitle: "Type your city. Let the universe become local.",
    cameraZ: 3
  }
];

function BlackHole() {
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={ref} position={[0, 0, -8]}>
      <mesh>
        <torusGeometry args={[3.3, 0.16, 64, 256]} />
        <meshStandardMaterial color="#ffb15c" emissive="#ff7a1a" emissiveIntensity={2.8} />
      </mesh>
      <mesh rotation={[0.25, 0.1, 0]}>
        <torusGeometry args={[2.5, 0.09, 64, 256]} />
        <meshStandardMaterial color="#fff1c7" emissive="#ffb15c" emissiveIntensity={1.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <pointLight intensity={8} distance={12} color="#ff944d" />
    </group>
  );
}

function Galaxy({ position, scale = 1 }) {
  const ref = useRef();

  const points = useMemo(() => {
    const vertices = [];
    for (let i = 0; i < 1400; i++) {
      const radius = Math.random() * 3.5;
      const branch = (i % 4) * Math.PI * 0.5;
      const spin = radius * 1.8;
      const angle = branch + spin + (Math.random() - 0.5) * 0.55;

      vertices.push(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.22,
        Math.sin(angle) * radius
      );
    }
    return new Float32Array(vertices);
  }, []);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.035;
  });

  return (
    <points ref={ref} position={position} scale={scale}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} color="#d9e6ff" transparent opacity={0.88} />
    </points>
  );
}

function SolarSystem() {
  const group = useRef();

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      <pointLight intensity={7} distance={12} color="#ffd27a" />

      {[1.2, 1.8, 2.45, 3.15].map((r, i) => (
        <group key={r} rotation={[0.2, i * 0.9, 0]}>
          <mesh>
            <torusGeometry args={[r, 0.006, 16, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
          </mesh>
          <mesh position={[r, 0, 0]}>
            <sphereGeometry args={[0.07 + i * 0.025, 32, 32]} />
            <meshStandardMaterial color={i === 2 ? "#6aa7ff" : "#a89f92"} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Earth() {
  const ref = useRef();

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.09;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.1}>
      <mesh ref={ref} position={[0, 0, 0]} scale={1.1}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial color="#2f6fff" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh scale={1.13}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
      <mesh position={[-0.25, 0.18, 0.92]} scale={[0.38, 0.14, 0.02]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#e7f0ff" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.28, -0.22, 0.91]} scale={[0.32, 0.11, 0.02]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#e7f0ff" transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function Universe({ stage }) {
  const cameraTarget = stages[stage]?.cameraZ || 8;

  useFrame(({ camera }, delta) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTarget, delta * 0.7);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#01030a"]} />
      <ambientLight intensity={0.35} />
      <Stars radius={120} depth={70} count={8000} factor={4} saturation={0} fade speed={0.35} />
      <Sparkles count={120} scale={16} size={2.5} speed={0.18} opacity={0.45} />

      {stage <= 2 && <BlackHole />}

      {stage >= 2 && (
        <>
          <Galaxy position={[-4.5, 1.2, -4]} scale={0.8} />
          <Galaxy position={[3.6, -1.1, -3]} scale={0.55} />
          <Galaxy position={[0, 0, -2]} scale={stage >= 3 ? 1.25 : 0.85} />
        </>
      )}

      {stage >= 4 && <SolarSystem />}
      {stage >= 5 && <Earth />}

      {stage === 6 && (
        <Text
          position={[0, -1.7, 0]}
          fontSize={0.16}
          color="#eaf1ff"
          anchorX="center"
          anchorY="middle"
        >
          you are here
        </Text>
      )}
    </>
  );
}

function App() {
  const [stage, setStage] = useState(0);
  const [city, setCity] = useState("");
  const [submittedCity, setSubmittedCity] = useState("");

  function next() {
    setStage((s) => Math.min(s + 1, stages.length - 1));
  }

  function back() {
    setStage((s) => Math.max(s - 1, 0));
  }

  function submitCity(e) {
    e.preventDefault();
    if (!city.trim()) return;
    setSubmittedCity(city.trim());
  }

  return (
    <main>
      <Canvas camera={{ position: [0, 0, 18], fov: 52 }}>
        <Universe stage={stage} />
      </Canvas>

      <section className="overlay">
        <AnimatePresence mode="wait">
          {!submittedCity ? (
            <motion.div
              key={stage}
              className="panel"
              initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
            >
              <p className="kicker">You are dust. You are okay.</p>
              <h1>{stages[stage].title}</h1>
              <p className="subtitle">{stages[stage].subtitle}</p>

              {stage === 6 ? (
                <form onSubmit={submitCity} className="cityForm">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                    autoFocus
                  />
                  <button type="submit">Find me</button>
                </form>
              ) : (
                <button onClick={next}>Continue</button>
              )}

              <div className="nav">
                <button onClick={back} disabled={stage === 0}>
                  Back
                </button>
                <span>{stage + 1} / {stages.length}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              className="panel final"
              initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1 }}
            >
              <p className="kicker">Found: {submittedCity}</p>
              <h1>You are here.</h1>
              <p className="subtitle">
                A city on a planet. A planet around a star. A star inside a galaxy.
                A galaxy among billions.
              </p>
              <h2>Tiny. Temporary. Precious.</h2>
              <p className="closing">You are dust. You are okay.</p>
              <button onClick={() => {
                setSubmittedCity("");
                setCity("");
                setStage(0);
              }}>
                Begin again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
export default App;
