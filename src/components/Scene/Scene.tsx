'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Center } from '@react-three/drei'
import { Lata } from '../3D/Lata'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Scene.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

function InteractiveModel() {
  const scrollGroupRef = useRef<THREE.Group>(null!)
  const mouseGroupRef = useRef<THREE.Group>(null!)
  const { viewport } = useThree()

  // Criamos uma ref manual para o mouse para garantir que funcione com pointer-events: none
  const mousePos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragRotation = useRef({ x: 0, y: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  // No mobile, a divisão é menor (1.4), o que faz a lata ficar maior em proporção à tela
  const responsiveScale = isMobile ? Math.min(viewport.width / 1.4, 3.5) : Math.min(viewport.width / 2, 2.5)

  useGSAP(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normaliza as coordenadas do mouse de -1 a 1
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1

      if (isDragging.current) {
        const deltaX = e.clientX - lastMousePos.current.x
        const deltaY = e.clientY - lastMousePos.current.y

        // Movimento horizontal gira a lata em seu eixo Y, vertical no eixo X
        dragRotation.current.x += deltaY * 0.01
        dragRotation.current.y += deltaX * 0.01

        lastMousePos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging.current = true
        lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const clientX = e.touches[0].clientX
        const clientY = e.touches[0].clientY

        mousePos.current.x = (clientX / window.innerWidth) * 2 - 1
        mousePos.current.y = -(clientY / window.innerHeight) * 2 + 1

        if (isDragging.current) {
          const deltaX = clientX - lastMousePos.current.x
          const deltaY = clientY - lastMousePos.current.y

          dragRotation.current.x += deltaY * 0.01
          dragRotation.current.y += deltaX * 0.01

          lastMousePos.current = { x: clientX, y: clientY }
        }
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    let mm = gsap.matchMedia()

    mm.add("(min-width: 769px)", () => {
      // Timeline para a animação do About 1
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: '#about1-section',
          start: 'top 95%',
          end: 'top 20%',
          scrub: 1,
        }
      })

      tl1.to(scrollGroupRef.current.position, { x: viewport.width * 0.10, ease: 'none' }, 0)
        .to(scrollGroupRef.current.rotation, { z: -0.2, y: Math.PI * 0.8, x: 0.1, ease: 'none' }, 0)

      // Timeline para a animação de retorno e shrink no About 3
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: '#about3-section',
          start: 'top 95%',
          end: 'top 20%',
          scrub: 1,
        }
      })

      tl3.to(scrollGroupRef.current.position, { x: 0, ease: 'none' }, 0)
        .to(scrollGroupRef.current.rotation, { z: 0, y: 0, x: 0, ease: 'none' }, 0)
        .to(scrollGroupRef.current.scale, { x: 0.9, y: 0.9, z: 0.9, ease: 'none' }, 0)
    })

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      mm.revert()
    }
  }, [viewport.width])

  const lastUpdate = useRef(0)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Trava de 30 FPS para renderização do WebGL (poupa 50% de uso de GPU)
    if (time - lastUpdate.current < 1 / 30) return
    lastUpdate.current = time

    // Usamos a nossa ref manual que pega o mouse de 'window' e adicionamos a rotação por drag
    const targetRotationX = mousePos.current.y * 0.5 + Math.sin(time * 0.5) * 0.1 + dragRotation.current.x
    const targetRotationY = time * 0.3 + (mousePos.current.x * 0.5) + dragRotation.current.y
    const targetRotationZ = mousePos.current.x * 0.2

    // Dobramos o LERP de 0.05 para 0.10 porque o frame rate caiu pela metade, mantendo a mesma velocidade
    mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.x, targetRotationX, 0.10)
    mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.y, targetRotationY, 0.10)
    mouseGroupRef.current.rotation.z = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.z, targetRotationZ, 0.10)

    // Renderiza a cena manualmente neste frame
    state.gl.render(state.scene, state.camera)
  }, 1)

  return (
    <group ref={scrollGroupRef}>
      <group ref={mouseGroupRef} scale={responsiveScale}>
        <Center>
          <Lata />
        </Center>
      </group>
    </group>
  )
}

export default function Scene() {
  return (
    <div className={styles.canvasContainer}>
      {/* Limitando o device-pixel-ratio a 1.5 previne monitores 4K de matarem a GPU desenhando 4x mais pixels */}
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} zoom={3} />

        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <Suspense fallback={null}>
          <InteractiveModel />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  )
}
