'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Hero from "@/components/Hero/Hero";
import About1 from "@/components/About1/About1";
import About2 from "@/components/About2/About2";
import About3 from "@/components/About3/About3";
import About4 from "@/components/About4/About4";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const about1Ref = useRef<HTMLDivElement>(null)
  const about2Ref = useRef<HTMLDivElement>(null)
  const about3Ref = useRef<HTMLDivElement>(null)
  const about4Ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Inicializar Lenis
    const lenis = new Lenis()

    // Sincronizar Lenis com ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Pin do Hero
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    })

    // Efeito de Fade e Blur no Hero quando o About1 sobe
    gsap.to(heroRef.current, {
      opacity: 0,
      filter: 'blur(8px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#about1-section',
        start: 'top 95%',
        end: 'top 20%',
        scrub: 1,
      }
    })

    // Pin do About1
    ScrollTrigger.create({
      trigger: about1Ref.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    })

    // Efeito de Fade e Blur no About1 quando o About2 sobe
    gsap.to(about1Ref.current, {
      opacity: 0,
      filter: 'blur(8px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#about2-section',
        start: 'top 95%',
        end: 'top 20%',
        scrub: 1,
      }
    })

    // Pin do About2
    ScrollTrigger.create({
      trigger: about2Ref.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    })

    // Fade/Blur do About2 quando o About3 sobe
    gsap.to(about2Ref.current, {
      opacity: 0,
      filter: 'blur(8px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#about3-section',
        start: 'top 95%',
        end: 'top 20%',
        scrub: 1,
      }
    })

    // Pin do About3
    ScrollTrigger.create({
      trigger: about3Ref.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: false,
    })

    // Fade/Blur do About3 quando o About4 sobe
    gsap.to(about3Ref.current, {
      opacity: 0,
      filter: 'blur(8px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#about4-section',
        start: 'top 95%',
        end: 'top 20%',
        scrub: 1,
      }
    })

  }, { scope: container })

  return (
    <main className={styles.container} ref={container}>
      <Header />
      <MobileHeader />
      {/* Camada de Ruído (Noise) */}
      <div className={styles.noiseOverlay} />

      <div ref={heroRef} className={styles.heroWrapper}>
        <Hero />
      </div>
      <div ref={about1Ref} className={styles.about1Wrapper}>
        <About1 />
      </div>
      <div ref={about2Ref} className={styles.about2Wrapper}>
        <About2 />
      </div>
      <div ref={about3Ref} className={styles.about3Wrapper}>
        <About3 />
      </div>
      <div ref={about4Ref} className={styles.about4Wrapper}>
        <About4 />
      </div>
    </main>
  );
}
