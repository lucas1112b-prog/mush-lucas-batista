import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './About4.module.css'

// Componente auxiliar que quebra o texto em <span> de letras
const AnimatedText = ({ text }: { text: string }) => {
  return (
    <>
      {text.split('').map((char, index) => {
        // Se for espaço, mantemos um espaço normal dentro do span para que o CSS consiga quebrar a linha (word-wrap)
        if (char === ' ') {
          return <span key={index} className="random-char" style={{ opacity: 0 }}> </span>
        }
        return (
          <span key={index} className="random-char" style={{ opacity: 0 }}>
            {char}
          </span>
        )
      })}
    </>
  )
}

export default function About4() {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll(`.${styles.title} .random-char`)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    })


    chars?.forEach((char) => {
      tl.to(char, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
      }, Math.random() * 1.5)
    })

  }, { scope: containerRef })

  return (
    <section id="about4-section" ref={containerRef} className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          <AnimatedText text="ELEVATING HYDRATION TO A " />
          <span className={styles.highlight}><AnimatedText text="NEW DIMENSION" /></span>
        </h2>
      </div>
    </section>
  )
}
