import { onMounted, onBeforeUnmount } from 'vue'

export function useParticles(canvasRef) {
  let animFrame = null
  let particles = []
  let canvas, ctx

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particles = build()
  }

  function build() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 130)
    return Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.45 + 0.2,
    }))
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy

      if (p.x <= 0 || p.x >= canvas.width)  p.vx *= -1
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(156,255,0,${p.alpha})`
      ctx.fill()
    }

    animFrame = requestAnimationFrame(draw)
  }

  const onResize = () => resize()

  onMounted(() => {
    canvas = canvasRef.value
    ctx    = canvas.getContext('2d')
    resize()
    draw()
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    if (animFrame) cancelAnimationFrame(animFrame)
    window.removeEventListener('resize', onResize)
  })
}
