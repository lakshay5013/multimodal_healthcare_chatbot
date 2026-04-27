"use client"

import { useRef, useMemo, type ReactElement } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

/* ── DNA Strand Geometry ── */
function DNAStrand() {
    const groupRef = useRef<THREE.Group>(null!)

    // Auto-rotate slowly
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3
        }
    })

    const { spheres, rungs } = useMemo(() => {
        const sphereData: { pos: [number, number, number]; color: string; strand: number }[] = []
        const rungData: { start: [number, number, number]; end: [number, number, number]; color: string }[] = []

        const turns = 4
        const pointsPerTurn = 16
        const totalPoints = turns * pointsPerTurn
        const helixRadius = 1.2
        const helixHeight = 8
        const halfHeight = helixHeight / 2

        for (let i = 0; i <= totalPoints; i++) {
            const t = i / totalPoints
            const angle = t * turns * Math.PI * 2
            const y = t * helixHeight - halfHeight

            // Strand A
            const ax = Math.cos(angle) * helixRadius
            const az = Math.sin(angle) * helixRadius
            sphereData.push({ pos: [ax, y, az], color: "#00D4FF", strand: 0 })

            // Strand B (180° offset)
            const bx = Math.cos(angle + Math.PI) * helixRadius
            const bz = Math.sin(angle + Math.PI) * helixRadius
            sphereData.push({ pos: [bx, y, bz], color: "#38BDF8", strand: 1 })

            // Rungs (base pairs) — every 2nd point
            if (i % 2 === 0) {
                const rungColors = ["#06B6D4", "#0EA5E9", "#00D4FF", "#7DD3FC"]
                rungData.push({
                    start: [ax, y, az],
                    end: [bx, y, bz],
                    color: rungColors[i % rungColors.length],
                })
            }
        }

        return { spheres: sphereData, rungs: rungData }
    }, [])

    return (
        <group ref={groupRef}>
            {/* Strand spheres */}
            {spheres.map((s, i) => (
                <mesh key={`sphere-${i}`} position={s.pos}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial
                        color={s.color}
                        emissive={s.color}
                        emissiveIntensity={0.6}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>
            ))}

            {/* Connecting rungs (base pairs) */}
            {rungs.map((r, i) => {
                const start = new THREE.Vector3(...r.start)
                const end = new THREE.Vector3(...r.end)
                const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
                const direction = new THREE.Vector3().subVectors(end, start)
                const length = direction.length()

                // Build orientation quaternion
                const quaternion = new THREE.Quaternion()
                const up = new THREE.Vector3(0, 1, 0)
                quaternion.setFromUnitVectors(up, direction.clone().normalize())

                return (
                    <mesh key={`rung-${i}`} position={mid} quaternion={quaternion}>
                        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
                        <meshStandardMaterial
                            color={r.color}
                            emissive={r.color}
                            emissiveIntensity={0.4}
                            transparent
                            opacity={0.7}
                            roughness={0.3}
                            metalness={0.6}
                        />
                    </mesh>
                )
            })}

            {/* Backbone connections (tubes connecting spheres along each strand) */}
            {spheres.reduce<ReactElement[]>((acc, s, i, arr) => {
                if (i < arr.length - 2 && arr[i + 2]?.strand === s.strand) {
                    const start = new THREE.Vector3(...s.pos)
                    const end = new THREE.Vector3(...arr[i + 2].pos)
                    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
                    const direction = new THREE.Vector3().subVectors(end, start)
                    const length = direction.length()
                    const quaternion = new THREE.Quaternion()
                    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())

                    acc.push(
                        <mesh key={`backbone-${i}`} position={mid} quaternion={quaternion}>
                            <cylinderGeometry args={[0.04, 0.04, length, 6]} />
                            <meshStandardMaterial
                                color={s.color}
                                emissive={s.color}
                                emissiveIntensity={0.3}
                                transparent
                                opacity={0.5}
                                roughness={0.4}
                                metalness={0.5}
                            />
                        </mesh>
                    )
                }
                return acc
            }, [])}
        </group>
    )
}

/* ── Floating Particles ── */
function Particles({ count = 80 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 12,
            ] as [number, number, number],
            speed: 0.2 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2,
            scale: 0.02 + Math.random() * 0.04,
        }))
    }, [count])

    useFrame(({ clock }) => {
        particles.forEach((p, i) => {
            const t = clock.elapsedTime * p.speed + p.offset
            dummy.position.set(
                p.position[0] + Math.sin(t) * 0.5,
                p.position[1] + Math.cos(t * 0.7) * 0.3,
                p.position[2]
            )
            dummy.scale.setScalar(p.scale)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#00D4FF" transparent opacity={0.4} />
        </instancedMesh>
    )
}

/* ── Main Exported Component ── */
export default function DNAHelix() {
    return (
        <div className="dna-canvas-wrapper">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                style={{ background: "transparent" }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={1.2} color="#00D4FF" />
                <pointLight position={[-5, -3, 3]} intensity={0.6} color="#38BDF8" />
                <pointLight position={[0, 0, 6]} intensity={0.4} color="#06B6D4" />

                {/* DNA */}
                <DNAStrand />

                {/* Particle field */}
                <Particles count={80} />

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={4}
                    maxDistance={14}
                    autoRotate={false}
                />
            </Canvas>
        </div>
    )
}
