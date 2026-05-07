'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LiquidCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // --- CONFIGURAÇÕES DE FÍSICA ---
    let currentSimScale = window.innerWidth < 768 ? 0.4 : 0.6
    const waveSpeed = 1
    const damping = 0.98
    const rippleSize = 20

    // --- TEXT CANVAS ---
    const textCanvas = document.createElement('canvas')
    const textCtx = textCanvas.getContext('2d')
    const textTexture = new THREE.CanvasTexture(textCanvas)

    const img = new Image()
    img.src = '/background-mush-h1-hero.png'

    function drawContent() {
      if (!textCtx) return
      const w = textCanvas.width = window.innerWidth
      const h = textCanvas.height = window.innerHeight
      textCtx.clearRect(0, 0, w, h)

      // --- H1 ---
      const fontSizeTitle = w * 0.126
      textCtx.font = `800 ${fontSizeTitle}px pacaembu-light, sans-serif`
      textCtx.textAlign = 'center'
      textCtx.textBaseline = 'top'

      if (img.complete && img.naturalWidth) {
        const pattern = textCtx.createPattern(img, 'repeat')
        if (pattern) {
          const scale = fontSizeTitle / 400
          pattern.setTransform(new DOMMatrix().scale(scale))
          textCtx.fillStyle = pattern
        }
      } else {
        textCtx.fillStyle = 'white'
      }
      textCtx.fillText('PURE ENERGY', w / 2, h * 0.2)

      // --- H2 ---
      const fontSizeSub = 32
      textCtx.font = `600 ${fontSizeSub}px pacaembu-light, sans-serif`
      textCtx.textAlign = 'center'
      textCtx.textBaseline = 'bottom'
      const baseY = h * 0.94

      const line1 = " your system."
      const upgradeWord = "Upgrade"
      const fullLine1 = upgradeWord + line1
      const line1Width = textCtx.measureText(fullLine1).width
      let startX1 = (w - line1Width) / 2
      textCtx.textAlign = 'left'
      textCtx.fillStyle = '#83DDB8'
      textCtx.fillText(upgradeWord, startX1, baseY - fontSizeSub * 1.2)
      textCtx.fillStyle = '#505050'
      textCtx.fillText(line1, startX1 + textCtx.measureText(upgradeWord).width, baseY - fontSizeSub * 1.2)

      const line2Prefix = "Beyond "
      const hydrationWord = "hydration"
      const fullLine2 = line2Prefix + hydrationWord + "."
      const line2Width = textCtx.measureText(fullLine2).width
      let startX2 = (w - line2Width) / 2
      textCtx.fillStyle = '#505050'
      textCtx.fillText(line2Prefix, startX2, baseY)
      textCtx.fillStyle = '#71DB9A'
      textCtx.fillText(hydrationWord, startX2 + textCtx.measureText(line2Prefix).width, baseY)
      textCtx.fillStyle = '#505050'
      textCtx.fillText(".", startX2 + textCtx.measureText(line2Prefix + hydrationWord).width, baseY)

      textTexture.needsUpdate = true
    }

    img.onload = drawContent

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const resolution = new THREE.Vector2(
      Math.max(1, Math.floor(window.innerWidth * currentSimScale)),
      Math.max(1, Math.floor(window.innerHeight * currentSimScale))
    )

    let rtA = new THREE.WebGLRenderTarget(resolution.x, resolution.y, {
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })
    let rtB = rtA.clone()

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: resolution },
        uMouse: { value: new THREE.Vector3(-1, -1, 0) },
        uDelta: { value: waveSpeed },
        uDamping: { value: damping },
        uRippleSize: { value: rippleSize },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec3 uMouse;
        uniform float uDelta;
        uniform float uDamping;
        uniform float uRippleSize;
        varying vec2 vUv;
        void main() {
          vec2 texel = 1.0 / uResolution;
          vec4 data = texture2D(uTexture, vUv);
          float pressure = data.x;
          float velocity = data.y;
          float p_right = texture2D(uTexture, vUv + vec2(texel.x, 0.0)).x;
          float p_left  = texture2D(uTexture, vUv + vec2(-texel.x, 0.0)).x;
          float p_up    = texture2D(uTexture, vUv + vec2(0.0, texel.y)).x;
          float p_down  = texture2D(uTexture, vUv + vec2(0.0, -texel.y)).x;
          float laplacian = (p_right + p_left + p_up + p_down) * 0.25 - pressure;
          velocity += uDelta * laplacian;
          pressure += uDelta * velocity;
          velocity *= 0.99;
          pressure *= uDamping;
          if (uMouse.z > 0.5) {
            float dist = distance(vUv * uResolution, uMouse.xy);
            pressure += exp(-dist * dist / (uRippleSize * uRippleSize)) * 0.5;
          }
          gl_FragColor = vec4(pressure, velocity, (p_right - p_left), (p_up - p_down));
        }`
    })

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uContentTexture: { value: textTexture },
      },
      transparent: true,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uContentTexture;
        varying vec2 vUv;
        void main() {
          vec4 data = texture2D(uTexture, vUv);
          vec2 distortion = data.zw * 0.1;
          vec4 color = texture2D(uContentTexture, vUv + distortion);
          float spec = pow(max(0.0, data.z + data.w), 4.0) * 0.5;
          color.rgb += spec;
          gl_FragColor = color;
        }`
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const simMesh = new THREE.Mesh(geometry, simMaterial)
    const displayMesh = new THREE.Mesh(geometry, displayMaterial)

    const mouse = new THREE.Vector3(-1, -1, 0)
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX * currentSimScale
      mouse.y = (window.innerHeight - e.clientY) * currentSimScale
      mouse.z = 1
    }
    window.addEventListener('mousemove', onMouseMove)

    let animationId: number
    const animate = () => {
      simMaterial.uniforms.uTexture.value = rtB.texture
      simMaterial.uniforms.uMouse.value.copy(mouse)
      renderer.setRenderTarget(rtA)
      scene.add(simMesh)
      renderer.render(scene, camera)
      scene.remove(simMesh)

      displayMaterial.uniforms.uTexture.value = rtA.texture
      renderer.setRenderTarget(null)
      scene.add(displayMesh)
      renderer.render(scene, camera)
      scene.remove(displayMesh)

      let temp = rtA
      rtA = rtB
      rtB = temp
      mouse.z *= 0.95
      animationId = requestAnimationFrame(animate)
    }

    drawContent()
    animate()

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      drawContent()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        containerRef.current?.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
