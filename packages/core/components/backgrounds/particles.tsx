"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export interface ParticlesProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /**
   * Number of particles to render
   * @default 50
   */
  quantity?: number
  /**
   * Whether particles should be stationary
   * @default false
   */
  stationary?: boolean
  /**
   * Particle color (CSS color value)
   * @default "currentColor"
   */
  color?: string
  /**
   * Minimum particle size
   * @default 0.5
   */
  minSize?: number
  /**
   * Maximum particle size
   * @default 2
   */
  maxSize?: number
  /**
   * Particle speed multiplier
   * @default 1
   */
  speed?: number
  /**
   * Whether to draw connecting lines between nearby particles
   * @default false
   */
  connectParticles?: boolean
  /**
   * Maximum distance for connecting particles
   * @default 100
   */
  connectDistance?: number
}

/**
 * Animated particle background component using canvas.
 *
 * @example
 * <div className="relative h-96 w-full overflow-hidden bg-background">
 *   <Particles className="absolute inset-0" />
 * </div>
 *
 * @example
 * <Particles
 *   quantity={100}
 *   color="#6366f1"
 *   connectParticles
 *   speed={0.5}
 * />
 */
export function Particles({
  className,
  quantity = 50,
  stationary = false,
  color = "currentColor",
  minSize = 0.5,
  maxSize = 2,
  speed = 1,
  connectParticles = false,
  connectDistance = 100,
  ...props
}: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const particlesRef = React.useRef<Particle[]>([])
  const animationFrameRef = React.useRef<number>(0)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const createParticles = () => {
      const rect = canvas.getBoundingClientRect()
      particlesRef.current = []

      for (let i = 0; i < quantity; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.5 + 0.5,
        })
      }
    }

    const getColor = () => {
      if (color === "currentColor") {
        const style = getComputedStyle(canvas)
        return style.color || "#000000"
      }
      return color
    }

    const drawParticles = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const particleColor = getColor()

      particlesRef.current.forEach((particle, i) => {
        // Update position if not stationary and not reduced motion
        if (!stationary && !shouldReduceMotion) {
          particle.x += particle.vx
          particle.y += particle.vy

          // Bounce off edges
          if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1

          // Keep in bounds
          particle.x = Math.max(0, Math.min(rect.width, particle.x))
          particle.y = Math.max(0, Math.min(rect.height, particle.y))
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Draw connections
        if (connectParticles) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const other = particlesRef.current[j]
            if (!other) continue

            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectDistance) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = particleColor
              ctx.globalAlpha = (1 - distance / connectDistance) * 0.2
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      })

      ctx.globalAlpha = 1

      if (!shouldReduceMotion && !stationary) {
        animationFrameRef.current = requestAnimationFrame(drawParticles)
      }
    }

    resizeCanvas()
    createParticles()
    drawParticles()

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
      createParticles()
    })
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      resizeObserver.disconnect()
    }
  }, [
    quantity,
    stationary,
    color,
    minSize,
    maxSize,
    speed,
    connectParticles,
    connectDistance,
    shouldReduceMotion,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      {...props}
    />
  )
}
