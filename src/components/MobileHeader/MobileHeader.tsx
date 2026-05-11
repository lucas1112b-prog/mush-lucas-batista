'use client'

import React, { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import styles from './MobileHeader.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, ScrollToPlugin, useGSAP)
}

const navItems = [
  { name: 'Products', target: '.heroWrapper' },
  { name: 'About', target: '#about1-section' },
  { name: 'Contact', target: '#footer' },
]

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const buyBtnRef = useRef<HTMLButtonElement>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Animate menu open/close
  useGSAP(() => {
    if (!menuRef.current) return

    const items = [...linksRef.current.filter(Boolean), buyBtnRef.current]

    if (isMenuOpen) {
      // Reveal menu container
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      )
      // Stagger links
      gsap.fromTo(
        items,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.05,
        }
      )
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power3.in',
      })
    }
  }, [isMenuOpen])

  // Modal animation
  useGSAP(() => {
    if (isModalOpen && modalOverlayRef.current && modalContentRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        modalOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      tl.fromTo(
        modalContentRef.current,
        { y: 40, opacity: 0, filter: 'blur(15px)', scale: 0.95 },
        { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.6, ease: 'power4.out' },
        '-=0.15'
      )
    }
  }, [isModalOpen])

  const handleNavClick = (target: string) => {
    setIsMenuOpen(false)
    gsap.to(window, { duration: 1, scrollTo: target, ease: 'power2.inOut' })
  }

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg width="120" height="59" viewBox="0 0 415 205" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M322.313 1.40878H353.973V34.6552H382.994V1.40878H414.654V111.291H382.994V67.0564H353.973V111.291H322.313V1.40878Z" fill="black"/>
            <path d="M268.237 0C295.807 0 310.317 14.7918 310.317 36.6274H277.602C277.602 30.2881 273.777 26.4844 267.577 26.4844C262.564 26.4844 259.266 29.4428 259.266 33.5282C259.266 36.4866 261.509 38.7406 267.973 39.8676L276.679 41.558C302.93 46.3478 312.296 58.463 312.296 77.9037C312.296 98.1897 297.653 112.7 269.292 112.7C240.666 112.7 225.232 97.4853 225.232 75.0862H257.947C257.947 81.8482 262.168 86.2153 269.688 86.2153C276.283 86.2153 279.581 82.9752 279.581 78.4672C279.581 75.2271 277.471 72.5505 270.215 71.4235L261.509 70.0147C235.126 65.7885 226.552 52.4054 226.552 34.2326C226.552 14.0875 240.535 0 268.237 0Z" fill="black"/>
            <path d="M130.351 1.40878H162.01V65.7885C162.01 75.9315 166.627 80.4395 173.223 80.4395C179.819 80.4395 184.436 75.9315 184.436 65.7885V1.40878H214.776V68.606C214.776 97.908 199.87 112.7 172.563 112.7C145.257 112.7 130.351 97.908 130.351 68.606V1.40878Z" fill="black"/>
            <path d="M0 1.40878H33.902L57.6466 43.6712L81.3912 1.40878H115.293V111.291H83.6338V53.1098L57.119 98.0488H56.8551L30.3403 53.1098V111.291H0V1.40878Z" fill="black"/>
            <path d="M342.132 130.7H379.239C397.633 130.7 410.848 141.797 410.848 157.163C410.848 165.889 406.196 173.287 398.585 177.84L414.654 204.682H385.053L371.944 182.772H367.504V204.682H342.132V130.7ZM367.504 166.173H374.164C380.719 166.173 384.63 162.759 384.63 157.163C384.63 151.661 380.719 148.247 374.164 148.247H367.504V166.173Z" fill="black"/>
            <path d="M268.109 130.7H330.483V150.618H293.482V158.206H318.325V176.227H293.482V184.764H331.54V204.682H268.109V130.7Z" fill="black"/>
            <path d="M191.947 130.7H260.664V152.515H238.991V204.682H213.619V152.515H191.947V130.7Z" fill="black"/>
            <path d="M145.479 130.7H172.331L202.567 204.682H176.137L172.437 194.344H144.316L140.616 204.682H115.244L145.479 130.7ZM150.765 176.322H165.883L158.377 155.361L150.765 176.322Z" fill="black"/>
            <path d="M0 130.7H27.4865L40.7012 169.873L53.9158 130.7H74.0021L87.2168 169.873L100.431 130.7H126.861L101.911 204.682H76.5393L62.3732 162.759L48.2071 204.682H24.9493L0 130.7Z" fill="black"/>
          </svg>
        </div>

        {/* Burger Toggle */}
        <button
          className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </header>

      {/* Floating Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.menu}>
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.target}
              ref={(el) => { linksRef.current[index] = el }}
              className={styles.menuLink}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item.target)
              }}
            >
              {item.name}
            </a>
          ))}
          <button
            ref={buyBtnRef}
            className={styles.buyBtn}
            onClick={() => {
              setIsMenuOpen(false)
              setIsModalOpen(true)
            }}
          >
            BUY
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          ref={modalOverlayRef}
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            ref={modalContentRef}
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Website Concept</h3>
            <p>
              This website is a Concept created by <strong>Lucas Batista</strong> (@llucaslbatista).
              It is not a real store.
            </p>
            <div className={styles.modalActions}>
              <a
                href="https://instagram.com/llucaslbatista"
                target="_blank"
                rel="noreferrer"
                className={styles.ctaBtn}
              >
                Contact Me
              </a>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
