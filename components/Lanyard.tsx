/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Image as DreiImage, Text } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// replace with your own imports, see the usage snippet for details
import cardGLB from './card.glb';
import lanyard from './lanyard.png';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: '420px 0px 420px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        frameloop={isActive ? 'always' : 'never'}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60} paused={!isActive}>
          <Band isMobile={isMobile} active={isActive} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2.2}
            color="#B19EEF"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2.8}
            color="#03b3c3"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2.6}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, active = true }) {
  const cardBaseScale = 2.38;
  const cardBaseOffset: [number, number, number] = [0, -1.14, -0.05];
  const band = useRef() as any,
    fixed = useRef() as any,
    j1 = useRef() as any,
    j2 = useRef() as any,
    j3 = useRef() as any,
    card = useRef() as any;
  const cardVisual = useRef<THREE.Group>(null);
  const idleTime = useRef(Math.random() * 100);
  const idleYaw = useRef(0);
  const idleYawInitialized = useRef(false);
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const targetQuat = new THREE.Quaternion();
  const correctedQuat = new THREE.Quaternion();
  const targetEuler = new THREE.Euler();
  const tmpEuler = new THREE.Euler();
  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as any, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  const profileTexture = useTexture('/profile.jpg');
  profileTexture.colorSpace = THREE.SRGBColorSpace;

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!active && !dragged) return;
    idleTime.current += delta;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 14 : 24));
      ang.copy(card.current.angvel());
      if (!dragged) {
        const t = idleTime.current;
        const cycle = (t * (1 / 8.8)) % 1;
        const swing = 0.5 - 0.5 * Math.cos(cycle * Math.PI * 2); // 0 -> 1 -> 0, continuous
        const baseYaw = swing * Math.PI;
        const holdBias = Math.abs(swing - 0.5) * 2;
        const holdWeight = THREE.MathUtils.smoothstep(holdBias, 0.55, 1);
        const sideDrift = Math.sin(t * 0.23 + 0.7) * 0.11 + Math.sin(t * 0.13 + 2.2) * 0.06;
        const holdHover = Math.sin(t * 0.85) * 0.15 + Math.sin(t * 0.41 + 1.2) * 0.08;
        const transitionHover = Math.sin(t * 0.85) * 0.045 + Math.sin(t * 0.41 + 1.2) * 0.025;
        const readableSideRange = 0.26;
        const readableHoldOffset = THREE.MathUtils.clamp(holdHover, -readableSideRange, readableSideRange);
        const targetYawRaw =
          baseYaw +
          readableHoldOffset * holdWeight +
          (transitionHover + sideDrift * 0.35) * (1 - holdWeight);

        const rot = card.current.rotation();
        tmpQuat.set(rot.x, rot.y, rot.z, rot.w);
        tmpEuler.setFromQuaternion(tmpQuat, 'YXZ');
        if (!idleYawInitialized.current) {
          idleYaw.current = tmpEuler.y;
          idleYawInitialized.current = true;
        }
        const yawToTarget = Math.atan2(Math.sin(targetYawRaw - idleYaw.current), Math.cos(targetYawRaw - idleYaw.current));
        const yawSmooth = 1 - Math.exp(-delta * (2.1 + holdWeight * 0.7));
        idleYaw.current += yawToTarget * yawSmooth;
        const targetYaw = idleYaw.current;
        const yawError = Math.atan2(Math.sin(targetYaw - tmpEuler.y), Math.cos(targetYaw - tmpEuler.y));
        const targetSpinY = THREE.MathUtils.clamp(yawError * 1.1, -0.16, 0.16);

        const wobbleX = Math.sin(t * 0.92 + 0.9) * 0.055;
        const wobbleZ = Math.sin(t * 0.74 + 2.1) * 0.04;
        const holdPitch = Math.sin(t * 0.92 + 0.9) * 0.028;
        const holdRoll = Math.sin(t * 0.74 + 2.1) * 0.02;
        targetEuler.set(holdPitch, targetYaw, holdRoll, 'YXZ');
        targetQuat.setFromEuler(targetEuler);
        correctedQuat.copy(tmpQuat).slerp(targetQuat, 0.04 + holdWeight * 0.1);
        card.current.setRotation(correctedQuat, true);

        card.current.setAngvel({
          x: THREE.MathUtils.lerp(ang.x, THREE.MathUtils.lerp(wobbleX, wobbleX * 0.4, holdWeight), 0.08),
          y: THREE.MathUtils.lerp(ang.y, targetSpinY, 0.08 + holdWeight * 0.08),
          z: THREE.MathUtils.lerp(ang.z, THREE.MathUtils.lerp(wobbleZ, wobbleZ * 0.4, holdWeight), 0.08)
        });
      }
    }

    if (cardVisual.current) {
      const t = idleTime.current;
      const pop = 1 + Math.sin(t * 1.1) * 0.02 + Math.sin(t * 0.47 + 1.4) * 0.01;
      cardVisual.current.scale.setScalar(cardBaseScale * pop);
    }
  });

  (curve as any).curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardVisual}
            scale={cardBaseScale}
            position={cardBaseOffset}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => {
              try { (e.target as any).releasePointerCapture(e.pointerId); } catch (err) { }
              drag(false);
            }}
            onPointerDown={e => {
              try { (e.target as any).setPointerCapture(e.pointerId); } catch (err) { }
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
            onPointerCancel={() => drag(false)}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.25}
                roughness={0.85}
                metalness={0.7}
              />
            </mesh>

            {/* FRONT FRAME */}
            <mesh position={[0, 0.53, 0.01]}>
              <planeGeometry args={[0.765, 1.085]} />
              <meshPhysicalMaterial
                color="#07070c"
                metalness={0.55}
                roughness={0.38}
                clearcoat={1}
                clearcoatRoughness={0.22}
              />
            </mesh>

            {/* FRONT FACE: IMAGE */}
            <mesh position={[0, 0.53, 0.0125]}>
              <planeGeometry args={[0.742, 1.068]} />
              <meshPhysicalMaterial
                map={profileTexture}
                roughness={0.2}
                metalness={0.2}
                clearcoat={0.85}
                clearcoatRoughness={0.2}
                transparent={false}
              />
            </mesh>

            {/* FRONT GLASS TINT */}
            <mesh position={[0, 0.53, 0.013]}>
              <planeGeometry args={[0.742, 1.068]} />
              <meshBasicMaterial
                color="#B19EEF"
                transparent
                opacity={dragged || hovered ? 0.11 : 0.06}
              />
            </mesh>

            <group position={[0, 0.53, 0.014]}>
              <mesh position={[0, -0.35, -0.0002]}>
                <planeGeometry args={[0.62, 0.115]} />
                <meshBasicMaterial color="#030308" transparent opacity={0.56} />
              </mesh>
              <Text position={[0, -0.332, 0]} fontSize={0.024} color="#FFFFFF" anchorX="center" anchorY="middle" letterSpacing={0.05}>
                DRAG CARD TO SEE OTHER SIDE
              </Text>
              <Text position={[0, -0.375, 0]} fontSize={0.02} color="#D9CCFF" anchorX="center" anchorY="middle" letterSpacing={0.1}>
                {'< TAP / HIT / DRAG >'}
              </Text>
            </group>

            {/* BACK FACE PANEL */}
            <mesh position={[0, 0.53, -0.0115]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.73, 1.05]} />
              <meshPhysicalMaterial
                color="#05060b"
                emissive="#2D1B4E"
                emissiveIntensity={0.3}
                metalness={0.35}
                roughness={0.52}
                clearcoat={1}
                clearcoatRoughness={0.32}
              />
            </mesh>

            {/* BACK FACE: PREMIUM ID TYPOGRAPHY */}
            <group position={[0, 0.53, -0.0125]} rotation={[0, Math.PI, 0]}>
              <Text position={[0, 0.31, 0]} fontSize={0.028} color="#B19EEF" anchorX="center" anchorY="middle" letterSpacing={0.18}>
                AI SYSTEMS
              </Text>

              <Text position={[0, 0.16, 0]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
                VEDANSH AGARWAL
              </Text>

              <Text position={[0, -0.03, 0]} fontSize={0.033} color="#03b3c3" anchorX="center" anchorY="middle" letterSpacing={0.09}>
                DATA SCIENTIST | AI ENGINEER
              </Text>

              <Text position={[0, -0.18, 0]} fontSize={0.025} color="#9CA3AF" anchorX="center" anchorY="middle" letterSpacing={0.11}>
                MACHINE LEARNING · GEN-AI
              </Text>

              <mesh position={[0, -0.275, 0]}>
                <planeGeometry args={[0.5, 0.008]} />
                <meshBasicMaterial color="#03b3c3" transparent opacity={0.65} />
              </mesh>

              <Text position={[0, -0.35, 0]} fontSize={0.02} color="#d7ccff" anchorX="center" anchorY="middle" letterSpacing={0.1}>
                FLIP BACK FOR PHOTO SIDE
              </Text>
            </group>

            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#d8cdfa"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1.05}
          transparent
          opacity={0.95}
        />
      </mesh>
    </>
  );
}
