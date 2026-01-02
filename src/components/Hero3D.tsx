// src/components/Hero3D.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

function Barbell() {
  return (
    <group>
      {/* Barra central (acero negro) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>

      {/* Marcas de agarre (naranja) */}
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.3, 32]} />
        <meshStandardMaterial 
          color="#ff9800" 
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.3, 32]} />
        <meshStandardMaterial 
          color="#ff9800" 
          roughness={0.4}
        />
      </mesh>

      {/* Disco izquierdo grande (45kg) - azul */}
      <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial 
          color="#2196f3" 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>

      {/* Aro interior disco izquierdo (detalle metálico) */}
      <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.09, 32]} />
        <meshStandardMaterial 
          color="#0d0d0d" 
          roughness={0.4} 
          metalness={0.9}
        />
      </mesh>

      {/* Disco derecho grande (45kg) - azul */}
      <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial 
          color="#2196f3" 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>

      {/* Aro interior disco derecho */}
      <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.09, 32]} />
        <meshStandardMaterial 
          color="#0d0d0d" 
          roughness={0.4} 
          metalness={0.9}
        />
      </mesh>

      {/* Disco medio izquierdo (20kg) - naranja */}
      <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 32]} />
        <meshStandardMaterial 
          color="#ff9800" 
          roughness={0.3} 
          metalness={0.2}
        />
      </mesh>

      {/* Disco medio derecho (20kg) - naranja */}
      <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 32]} />
        <meshStandardMaterial 
          color="#ff9800" 
          roughness={0.3} 
          metalness={0.2}
        />
      </mesh>

      {/* Collares de seguridad (plateados) */}
      <mesh position={[-1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      <mesh position={[1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>

      {/* Brillo en la barra (reflejo) */}
      <mesh position={[0, 0.08, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <section
      className="
        relative
        flex flex-col-reverse md:flex-row
        items-center justify-center
        overflow-hidden
        bg-gradient-to-br from-[#1565c0] via-[#2196f3] to-[#42a5f5]
        min-h-[340px] md:min-h-[60vh]
        py-6 md:py-0
      "
    >
      {/* Texto principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="
          z-10
          w-full md:w-1/2
          flex flex-col items-center justify-center
          px-4 md:px-12
          text-center
          bg-[rgba(10,37,64,0.85)] md:bg-transparent
          py-4 md:py-0
          rounded-xl md:rounded-none
          shadow-lg md:shadow-none
          mb-2 md:mb-0
        "
      >
        <h1
          className="
            text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-extrabold
            text-white drop-shadow-[0_4px_24px_rgba(33,150,243,0.7)]
            uppercase tracking-wide
            animate-pulse
            mb-3 md:mb-4
          "
        >
          Suplementación Formosa
        </h1>
        <p
          className="
            text-sm xs:text-base sm:text-lg md:text-2xl
            text-white font-semibold drop-shadow-lg
            mb-1 md:mb-4
          "
        >
          Fuerza, energía y rendimiento para tu mejor versión
        </p>
      </motion.div>

      {/* Canvas 3D */}
      <div
        className="
          w-full md:w-1/2
          flex items-center justify-center
          h-[220px] xs:h-[260px] sm:h-[300px] md:h-[60vh]
          min-h-[200px] max-h-[320px] md:max-h-none
          mb-4 md:mb-0
        "
        style={{ minWidth: 0 }}
      >
        <Canvas camera={{ position: [0, 0.5, 4], fov: 50 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight 
            position={[-3, 2, 3]} 
            intensity={0.8} 
            angle={0.4} 
            penumbra={0.5}
            castShadow
          />
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <Barbell />
          </Float>
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.2}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </section>
  );
}