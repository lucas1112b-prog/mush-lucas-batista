'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Preloader.module.css'

const feedbacks = [
  "Extracting pure nature...",
  "Harmonizing bio-frequencies...",
  "Enhancing cognitive clarity...",
  "Ready to boost your vibe."
]

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLParagraphElement>(null)

  const [feedbackIndex, setFeedbackIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const { contextSafe } = useGSAP({ scope: preloaderRef })

  useGSAP(() => {
    const tl = gsap.timeline()

    // Intervalo para trocar as frases mockadas
    const interval = setInterval(() => {
      setFeedbackIndex(prev => {
        if (prev < feedbacks.length - 1) return prev + 1
        return prev
      })
    }, 800) // Troca a cada 800ms

    tl.fromTo(fillRef.current,
      { height: '0%' },
      {
        height: '100%',
        duration: 3,
        ease: 'power2.inOut',
        onComplete: () => {
          clearInterval(interval)
          setShowButton(true)
        }
      }
    )

  }, { scope: preloaderRef })

  const handleStart = contextSafe(() => {
    window.dispatchEvent(new CustomEvent('start-journey'))
    
    const tl = gsap.timeline()

    tl.fromTo(contentRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.5,
      }
    )

    tl.fromTo(curtainRef.current,
      {
        yPercent: 0,
        borderBottomLeftRadius: '0em',
        borderBottomRightRadius: '0em'
      },
      {
        borderBottomLeftRadius: '5em',
        borderBottomRightRadius: '5em',
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        force3D: true,
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none'
          }
        }
      }
    )
  })

  const LogoSVG = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 415 205" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M322.313 1.40878H353.973V34.6552H382.994V1.40878H414.654V111.291H382.994V67.0564H353.973V111.291H322.313V1.40878Z" fill="currentColor" />
      <path d="M268.237 0C295.807 0 310.317 14.7918 310.317 36.6274H277.602C277.602 30.2881 273.777 26.4844 267.577 26.4844C262.564 26.4844 259.266 29.4428 259.266 33.5282C259.266 36.4866 261.509 38.7406 267.973 39.8676L276.679 41.558C302.93 46.3478 312.296 58.463 312.296 77.9037C312.296 98.1897 297.653 112.7 269.292 112.7C240.666 112.7 225.232 97.4853 225.232 75.0862H257.947C257.947 81.8482 262.168 86.2153 269.688 86.2153C276.283 86.2153 279.581 82.9752 279.581 78.4672C279.581 75.2271 277.471 72.5505 270.215 71.4235L261.509 70.0147C235.126 65.7885 226.552 52.4054 226.552 34.2326C226.552 14.0875 240.535 0 268.237 0Z" fill="currentColor" />
      <path d="M130.351 1.40878H162.01V65.7885C162.01 75.9315 166.627 80.4395 173.223 80.4395C179.819 80.4395 184.436 75.9315 184.436 65.7885V1.40878H214.776V68.606C214.776 97.908 199.87 112.7 172.563 112.7C145.257 112.7 130.351 97.908 130.351 68.606V1.40878Z" fill="currentColor" />
      <path d="M0 1.40878H33.902L57.6466 43.6712L81.3912 1.40878H115.293V111.291H83.6338V53.1098L57.119 98.0488H56.8551L30.3403 53.1098V111.291H0V1.40878Z" fill="currentColor" />
      <path d="M342.132 130.7H379.239C397.633 130.7 410.848 141.797 410.848 157.163C410.848 165.889 406.196 173.287 398.585 177.84L414.654 204.682H385.053L371.944 182.772H367.504V204.682H342.132V130.7ZM367.504 166.173H374.164C380.719 166.173 384.63 162.759 384.63 157.163C384.63 151.661 380.719 148.247 374.164 148.247H367.504V166.173Z" fill="currentColor" />
      <path d="M268.109 130.7H330.483V150.618H293.482V158.206H318.325V176.227H293.482V184.764H331.54V204.682H268.109V130.7Z" fill="currentColor" />
      <path d="M191.947 130.7H260.664V152.515H238.991V204.682H213.619V152.515H191.947V130.7Z" fill="currentColor" />
      <path d="M145.479 130.7H172.331L202.567 204.682H176.137L172.437 194.344H144.316L140.616 204.682H115.244L145.479 130.7ZM150.765 176.322H165.883L158.377 155.361L150.765 176.322Z" fill="currentColor" />
      <path d="M0 130.7H27.4865L40.7012 169.873L53.9158 130.7H74.0021L87.2168 169.873L100.431 130.7H126.861L101.911 204.682H76.5393L62.3732 162.759L48.2071 204.682H24.9493L0 130.7Z" fill="currentColor" />
    </svg>
  )

  return (
    <div ref={preloaderRef} className={styles.preloader}>
      {/* Essa é a div responsável por ser a "cortina" verde que sobe */}
      <div ref={curtainRef} className={styles.curtain} />

      <div ref={contentRef} className={styles.content}>

        <div className={styles.logoContainer}>
          <LogoSVG className={styles.logoBase} />
          <div ref={fillRef} className={styles.logoFillContainer}>
            <LogoSVG className={styles.logoFilled} />
          </div>
        </div>

        <div className={styles.feedbackContainer}>
          <p ref={feedbackRef} className={`${styles.feedbackText} ${showButton ? styles.hidden : ''}`}>
            {feedbacks[feedbackIndex]}
          </p>
          <button
            onClick={handleStart}
            className={`${styles.startBtn} ${showButton ? styles.visible : ''}`}
          >
            <div className={styles.letterContainer}>
              {"START THE JOURNEY".split('').map((char, i) => (
                <span key={i} className={styles.letter} style={{ '--index': i } as React.CSSProperties}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}
