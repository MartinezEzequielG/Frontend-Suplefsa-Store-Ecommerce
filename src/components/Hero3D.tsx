// src/components/Hero3D.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

export default function Hero3D() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#C1BB9B]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <mesh>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <meshStandardMaterial color="#3A4330" roughness={0.3} metalness={0.7} />
          </mesh>
        </Float>
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      </Canvas>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-[#3A4330] drop-shadow-lg">HAMSA EYEWEAR</h1>
        <p className="mt-4 text-lg md:text-2xl text-[#3A4330]">Lentes con diseño y actitud</p>
      </motion.div>
    </section>
  );
}