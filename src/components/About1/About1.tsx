import React from 'react'
import Image from 'next/image'
import styles from './About1.module.css'

export default function About1() {
  return (
    <section id="about1-section" className={styles.container}>
      <div className={styles.glassContent}>
        <div className={styles.imageWrapper}>
          <Image
            src="/gnomos-about-1.png"
            alt="Gnomos Detail"
            width={1200} // Aumentado para garantir resolução em telas maiores
            height={1600}
            quality={100} // Qualidade máxima
            priority // Carrega com prioridade para evitar blur inicial
            className={styles.image}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.textContent}>
          <h2 className={styles.title}>PURE EXTRACTION</h2>
          <p id="about-description" className={styles.description}>
            Derived from the deepest roots of nature, our hydration system combines essential minerals with organic mushroom extracts.
            We believe that true performance comes from within, which is why every drop of Mush Water is meticulously filtered and
            infused with biological wisdom. Experience a new level of cognitive clarity and physical resilience as you upgrade
            your body's core system with the world's first bio-harmonic beverage.
          </p>
        </div>
      </div>
    </section>
  )
}
