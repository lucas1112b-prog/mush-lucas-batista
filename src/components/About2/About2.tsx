import React from 'react'
import Image from 'next/image'
import styles from './About2.module.css'

export default function About2() {
  return (
    <section id="about2-section" className={styles.container}>
      <div className={styles.glassContent}>
        <div className={styles.imageWrapper}>
          <Image
            src="/gnomos-about-2.png" // Vou manter a mesma imagem por enquanto, se você quiser outra depois, basta trocar aqui
            alt="About 2 Detail"
            width={1200}
            height={1600}
            quality={100}
            className={styles.image}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.textContent}>
          <h2 className={styles.title}>NEXT GENERATION</h2>
          <p id="about2-description" className={styles.description}>
            Evolving beyond our initial breakthrough, we continue to redefine the limits of performance.
            This next step in our journey brings enhanced formulation and deeper integration with nature.
            Prepare to unlock new dimensions of focus, energy, and well-being. The future of bio-harmonic
            hydration is here, ready to fuel your most ambitious days.
          </p>
        </div>
      </div>
    </section>
  )
}
