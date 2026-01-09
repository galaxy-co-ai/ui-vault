"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
  gravity: number
}

export interface ConfettiProps {
  /**
   * Whether confetti is currently active
   */
  active: boolean
  /**
   * Number of confetti pieces
   * @default 100
   */
  count?: number
  /**
   * Custom colors for confetti pieces
   * @default ["#ff0080", "#7928ca", "#0070f3", "#38bdf8", "#a855f7", "#f97316", "#22c55e"]
   */
  colors?: string[]
  /**
   * Duration in milliseconds before confetti fades
   * @default 3000
   */
  duration?: number
  /**
   * Additional className for the canvas
   */
  className?: string
  /**
   * Callback when confetti animation completes
   */
  onComplete?: () => void
}

/**
 * A celebratory confetti effect component.
 * Renders colorful falling confetti pieces using canvas.
 *
 * @example
 * const [showConfetti, setShowConfetti] = useState(false)
 *
 * <Button onClick={() => setShowConfetti(true)}>Celebrate!</Button>
 * <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
 *
 * @example
 * <Confetti
 *   active={true}
 *   count={200}
 *   colors={["#gold", "#silver"]}
 *   duration={5000}
 * />
 */
export function Confetti({
  active,
  count = 100,
  colors = ["#ff0080", "#7928ca", "#0070f3", "#38bdf8", "#a855f7", "#f97316", "#22c55e"],
  duration = 3000,
  className,
  onComplete,
}: ConfettiProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number | null>(null)
  const piecesRef = React.useRef<ConfettiPiece[]>([])
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (!active || shouldReduceMotion) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Create confetti pieces
    piecesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5 - canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0] ?? "#ff0080",
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 8 + 4,
      gravity: 0.1 + Math.random() * 0.1,
    }))

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const opacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const piece of piecesRef.current) {
        piece.x += piece.vx
        piece.y += piece.vy
        piece.vy += piece.gravity
        piece.rotation += piece.rotationSpeed
        piece.vx *= 0.99

        // Draw confetti piece
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate((piece.rotation * Math.PI) / 180)
        ctx.globalAlpha = opacity
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2)
        ctx.restore()
      }

      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, count, colors, duration, onComplete, shouldReduceMotion])

  if (!active || shouldReduceMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0 z-50", className)}
    />
  )
}
