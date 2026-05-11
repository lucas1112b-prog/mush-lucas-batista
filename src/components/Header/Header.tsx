import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import styles from './Header.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, ScrollToPlugin, useGSAP)
}

const gifList = [
  '/dance-gifs/Dance Dancing GIF.gif',
  '/dance-gifs/Dance Dog GIF.gif',
  '/dance-gifs/Dance John GIF.gif',
  '/dance-gifs/Dance Party Dancing GIF.gif',
  '/dance-gifs/Happy Dance GIF.gif',
  '/dance-gifs/Tupac Shakur Dancing GIF.gif'
]

export default function Header() {
  const navItems = [
    { name: "Products", target: ".heroWrapper" },
    { name: "About", target: "#about1-section" },
    { name: "Contact", target: "#footer" }
  ]

  const [activeNav, setActiveNav] = useState("Products")
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const markerRef = useRef<HTMLDivElement>(null)

  // No mount, coloca o marker no primeiro link
  useEffect(() => {
    if (linksRef.current[0] && markerRef.current) {
      linksRef.current[0].appendChild(markerRef.current)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent, index: number, target: string) => {
    e.preventDefault()
    const clickedItem = navItems[index].name
    if (clickedItem === activeNav) {
      if (target) {
        gsap.to(window, { duration: 1, scrollTo: target, ease: "power2.inOut" })
      }
      return
    }

    const marker = markerRef.current
    const clickedLink = linksRef.current[index]

    if (marker && clickedLink) {
      // 1. Pega o estado
      const state = Flip.getState(marker)

      // 2. Muda no DOM
      clickedLink.appendChild(marker)
      setActiveNav(clickedItem)

      // 3. Anima
      Flip.from(state, {
        duration: 0.4,
        ease: "back",
      })
    }

    // Scroll Suave
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: target,
        ease: "power2.inOut"
      })
    }
  }

  const [isPlaying, setIsPlaying] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(5) // Inicia com 50% de volume
  const [isModalOpen, setIsModalOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isModalOpen && modalOverlayRef.current && modalContentRef.current) {
      const tl = gsap.timeline()

      tl.fromTo(modalOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )

      tl.fromTo(modalContentRef.current,
        {
          y: 40,
          opacity: 0,
          filter: 'blur(15px)',
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.7,
          ease: 'power4.out'
        },
        "-=0.2"
      )
    }
  }, [isModalOpen])

  // Análise de áudio
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const requestRef = useRef<number | null>(null)
  const smoothEnergyRef = useRef(0)
  const fadeInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.crossOrigin = "anonymous"
    audio.loop = true
    audio.src = "/music-site.mp3"
    audio.volume = volumeLevel / 10
    audioRef.current = audio

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      audio.volume = 1 // Reset no volume se acabar
    })

    const handleAutoStart = () => {
      if (!audio) return

      // Inicia em volume baixo (nível 2 = 20%)
      setVolumeLevel(2)
      audio.volume = 0 // começa mudo para o fade in

      audio.play().then(() => {
        setIsPlaying(true)
        // Precisamos chamar setupAudioAnalysis fora do fluxo do React caso o Contexto precise ser iniciado
        setupAudioAnalysis()
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume()
        }

        // Simula o fade in manual usando o mesmo setInterval
        let vol = 0
        const fade = setInterval(() => {
          vol += 0.01
          if (vol >= 0.2) {
            vol = 0.2
            clearInterval(fade)
          }
          if (audioRef.current) audioRef.current.volume = vol
        }, 30)

      }).catch(e => console.log("Áudio bloqueado pelo navegador", e))
    }

    window.addEventListener('start-journey', handleAutoStart)

    return () => {
      audio.pause()
      audio.src = ""
      window.removeEventListener('start-journey', handleAutoStart)
    }
  }, [])

  const setupAudioAnalysis = () => {
    if (!audioRef.current || audioCtxRef.current) return

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    audioCtxRef.current = new AudioCtx()
    analyserRef.current = audioCtxRef.current.createAnalyser()
    analyserRef.current.fftSize = 512

    sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current)
    sourceRef.current.connect(analyserRef.current)
    analyserRef.current.connect(audioCtxRef.current.destination)

    animateEnergy()
  }

  const animateEnergy = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    let energy = 0
    for (let i = 0; i < dataArray.length; i++) {
      energy += dataArray[i] / 255
    }
    energy /= dataArray.length

    smoothEnergyRef.current += (energy - smoothEnergyRef.current) * 0.15

    if (btnRef.current) {
      btnRef.current.style.setProperty('--energy', smoothEnergyRef.current.toString())
    }

    requestRef.current = requestAnimationFrame(animateEnergy)
  }

  const fadeAudio = (targetVolume: number, callback?: () => void) => {
    if (!audioRef.current) return

    if (fadeInterval.current) clearInterval(fadeInterval.current)

    const startVolume = audioRef.current.volume
    const duration = 600 // ms
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = (targetVolume - startVolume) / steps

    let currentStep = 0

    fadeInterval.current = setInterval(() => {
      currentStep++
      if (audioRef.current) {
        let newVol = startVolume + (volumeStep * currentStep)
        newVol = Math.max(0, Math.min(1, newVol))
        audioRef.current.volume = newVol
      }

      if (currentStep >= steps) {
        if (fadeInterval.current) clearInterval(fadeInterval.current)
        if (callback) callback()
      }
    }, stepTime)
  }

  const popRandomGif = () => {
    const randomGif = gifList[Math.floor(Math.random() * gifList.length)]

    const gifContainer = document.createElement('div')

    // Posição aleatória na tela (evitando as bordas extremas)
    const randomX = Math.random() * 80 + 10 // 10% a 90% da largura
    const randomY = Math.random() * 80 + 10 // 10% a 90% da altura

    Object.assign(gifContainer.style, {
      position: 'fixed',
      left: `${randomX}vw`,
      top: `${randomY}vh`,
      width: '200px',
      height: '200px',
      pointerEvents: 'none',
      zIndex: '10000',
      transform: 'translate(-50%, -50%) scale(0) rotate(-20deg)',
      opacity: '0'
    })

    const img = document.createElement('img')
    img.src = randomGif
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'contain'

    gifContainer.appendChild(img)
    document.body.appendChild(gifContainer)

    const tl = gsap.timeline({
      onComplete: () => {
        if (document.body.contains(gifContainer)) {
          document.body.removeChild(gifContainer)
        }
      }
    })

    tl.to(gifContainer, {
      scale: 1,
      rotate: 10,
      opacity: 1,
      duration: 0.4,
      force3D: true,
      ease: "back.out(1.7)"
    })

    tl.to(gifContainer, {
      y: '-=50',
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      delay: 1,
      force3D: true,
      ease: "power2.in"
    })
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        setupAudioAnalysis()

        if (audioRef.current.volume === 0) {
          fadeAudio(volumeLevel / 10)
        } else {
          audioRef.current.volume = volumeLevel / 10
        }

        audioRef.current.play().then(() => {
          setIsPlaying(true)
          if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume()
          }
        }).catch(e => console.log("Áudio bloqueado pelo navegador", e))

      } else {
        setIsPlaying(false)
        fadeAudio(0, () => {
          audioRef.current?.pause()
        })
      }
    }
  }

  const handleVolumeUp = () => {
    setVolumeLevel(prev => {
      const next = prev >= 10 ? 1 : prev + 1 // Se chegou no max, volta pro min audível (10%)
      if (audioRef.current && isPlaying) {
        audioRef.current.volume = next / 10
      }
      return next
    })
    popRandomGif()
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} ref={navRef}>
        {navItems.map((item, index) => (
          <a
            key={item.name}
            href={item.target}
            ref={(el) => { linksRef.current[index] = el }}
            className={`${styles.link} ${activeNav === item.name ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, index, item.target)}
          >
            <div className={styles.letterContainer}>
              {item.name.split('').map((char, i) => (
                <span key={i} className={styles.letter} style={{ '--index': i } as React.CSSProperties}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </a>
        ))}
        {/* Renderizado no nav, movido pro link via appendChild no mount e click */}
        <div className={styles.marker} ref={markerRef} />
      </nav>
      <div className={styles.rightSection}>
        <button ref={btnRef} onClick={togglePlay} className={styles.playBtnCircle}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <button onClick={handleVolumeUp} className={styles.volumeBtn}>
          <div className={styles.fillBackground} style={{ width: `${volumeLevel * 10}%` }} />
          <div className={styles.btnContent}>
            <span>VOLUME</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>
        </button>

        <button onClick={() => setIsModalOpen(true)} className={styles.buyBtn}>
          <div className={styles.letterContainer}>
            {"BUY".split('').map((char, i) => (
              <span key={i} className={styles.letter} style={{ '--index': i } as React.CSSProperties}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div ref={modalOverlayRef} className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div ref={modalContentRef} className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Website Concept</h3>
            <p>
              This website is a Concept created by <strong>Lucas Batista</strong> (@llucaslbatista). 
              It is not a real store.
            </p>
            <div className={styles.modalActions}>
              <a href="https://instagram.com/llucaslbatista" target="_blank" rel="noreferrer" className={styles.ctaBtn}>
                Contact Me
              </a>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
