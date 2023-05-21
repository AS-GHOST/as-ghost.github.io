import './Background.css'

import { forwardRef, Fragment, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function Background() {
  const containerRef = useRef<HTMLDivElement>(null)

  const backgroundTexts = ['AS63799', 'GHOST', '103.108.46.0/23', '2400:e860::/32']

  return (
    <div className="background" ref={containerRef}>
      <svg>
        <defs>
          <clipPath id="bg-clip">
            {[...backgroundTexts, ...backgroundTexts].map((text, i) => (
              <Marquee key={i} text={text} y={i + 1} speed={20} reverse={i % 2 === 1} containerRef={containerRef} />
            ))}
          </clipPath>
        </defs>

        <image
          href="/background.jpg"
          clipPath="url(#bg-clip)"
          filter="url(#bg-blur)"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  )
}

type MarqueeProps = {
  text: string
  y: number
  containerRef: RefObject<HTMLDivElement>
  speed?: number
  reverse?: boolean
}

function Marquee({ text, y, containerRef, speed = 50, reverse = false }: MarqueeProps) {
  const [benchmarkWidth, setBenchmarkWidth] = useState(0)
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const benchmarkRef = useRef<SVGTextElement>(null)
  const marqueeRef = useRef<SVGTextElement>(null)

  const calculateWidth = useCallback(() => {
    if (benchmarkRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const benchmarkRect = benchmarkRef.current.getBBox()
      const containerWidth = containerRect.width
      const benchmarkWidth = benchmarkRect.width

      setMultiplier(
        containerWidth && benchmarkWidth && benchmarkWidth < containerWidth
          ? Math.ceil(containerWidth / benchmarkWidth)
          : 1,
      )

      setBenchmarkWidth(benchmarkWidth)
    }
  }, [containerRef])

  const updateMarqueeWidth = useCallback(() => {
    if (marqueeRef.current) {
      const marqueeRect = marqueeRef.current.getBBox()
      const marqueeWidth = marqueeRect.width
      setMarqueeWidth(marqueeWidth)
    }
  }, [marqueeRef])

  useEffect(() => {
    if (!isMounted) return

    calculateWidth()
    if (benchmarkRef.current && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => calculateWidth())
      resizeObserver.observe(containerRef.current)
      resizeObserver.observe(benchmarkRef.current)
      return () => {
        if (!resizeObserver) return
        resizeObserver.disconnect()
      }
    }
  }, [calculateWidth, containerRef, isMounted])

  useEffect(() => {
    if (!isMounted) return

    updateMarqueeWidth()
    if (marqueeRef.current) {
      const resizeObserver = new ResizeObserver(() => updateMarqueeWidth())
      resizeObserver.observe(marqueeRef.current)
      return () => {
        if (!resizeObserver) return
        resizeObserver.disconnect()
      }
    }
  }, [updateMarqueeWidth, marqueeRef, isMounted])

  useEffect(() => {
    calculateWidth()
  }, [calculateWidth, text])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const duration = useMemo(() => {
    return (benchmarkWidth * multiplier) / speed
  }, [benchmarkWidth, multiplier, speed])

  return !isMounted ? null : (
    <>
      <Text benchmark value={text} x={0} y={y} ref={benchmarkRef} />
      <Text
        value={text}
        times={multiplier}
        x={0}
        y={y}
        width={marqueeWidth}
        duration={duration}
        reverse={reverse}
        ref={marqueeRef}
      />
      <Text value={text} times={multiplier} x={1} y={y} width={marqueeWidth} duration={duration} reverse={reverse} />
    </>
  )
}

type TextProps = {
  value: string
  times?: number
  x: number
  y: number
  width?: number
  duration?: number
  reverse?: boolean
  benchmark?: boolean
}

const Text = forwardRef<SVGTextElement, TextProps>(function Text(
  { value, times = 1, x, y, width = 0, duration = 0, reverse = false, benchmark = false },
  ref,
) {
  const texts = useMemo(() => {
    return [...Array(Number.isFinite(times) && times >= 0 ? times : 0)].map((_, i) => {
      return <Fragment key={i}>{value}&nbsp;</Fragment>
    })
  }, [times, value])

  const from = reverse ? '0,0' : `${-1 * width},0`
  const to = reverse ? `${-1 * width},0` : '0,0'

  return (
    <text className={`marquee ${benchmark ? 'benchmark' : ''}`} x={`${x * width}px`} y={`${y}em`} ref={ref}>
      {texts}
      {!benchmark && width !== 0 && (
        <animateTransform
          attributeName="transform"
          type="translate"
          from={from}
          to={to}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      )}
    </text>
  )
})
