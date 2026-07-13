import { useState, useEffect, useRef } from 'react'

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1655091273851-7bdc2e578a88?w=600&q=80',
    caption: 'Pad Thai, Thailand',
  },
  {
    url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    caption: 'Sushi, Japan',
  },
  {
    url: 'https://images.unsplash.com/photo-1622620545384-90592d78ecb2?w=600&q=80',
    caption: 'Ceviche, Peru',
  },
  {
    url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    caption: 'Picanha, Brazil',
  },
  {
    url: 'https://images.unsplash.com/photo-1643019237176-8ae0859f1123?w=600&q=80',
    caption: 'Tagine, Morocco',
  },
  {
    url: 'https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?w=600&q=80',
    caption: 'Jollof Rice, Gambia',
  },
  {
    url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&q=80',
    caption: 'Cheese Burger, United States',
  },
  {
    url: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80',
    caption: 'Tacos, Mexico',
  },
  {
    url: 'https://images.unsplash.com/photo-1621841957884-1210fe19d66d?w=600&q=80',
    caption: 'Paella, Spain',
  },
  {
    url: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=600&q=80',
    caption: 'Margherita Pizza, Italy',
  },
]

// One rotation per slide — extended to cover any slide count
const ROTATIONS = [-6, 4, -3, 7, -5, 3, -8, 5, -4, 6]

function getSlideStyle(offset, totalSlides) {
  if (offset === 0) {
    return { x: '0%', rotate: ROTATIONS[0], scale: 1, opacity: 1, zIndex: 10 }
  }
  const adj =
    offset > totalSlides / 2
      ? offset - totalSlides
      : offset < -(totalSlides / 2)
        ? offset + totalSlides
        : offset

  if (adj === -1) {
    return {
      x: '-65%',
      rotate: ROTATIONS[1] - 4,
      scale: 0.88,
      opacity: 0.7,
      zIndex: 5,
    }
  }
  if (adj === 1) {
    return {
      x: '65%',
      rotate: ROTATIONS[2] + 4,
      scale: 0.88,
      opacity: 0.7,
      zIndex: 5,
    }
  }
  const side = adj < 0 ? -1 : 1
  return {
    x: `${side * 160}%`,
    rotate: ROTATIONS[Math.abs(adj) % ROTATIONS.length],
    scale: 0.8,
    opacity: 0,
    zIndex: 1,
  }
}

function PolaroidCarousel() {
  const [current, setCurrent] = useState(0)
  const animatingRef = useRef(false)
  const autoRef = useRef(null)
  const hovered = useRef(false)

  // Use a ref for current so the interval always sees the latest value
  const currentRef = useRef(0)
  const [display, setDisplay] = useState(0)

  const goTo = (next) => {
    if (animatingRef.current || next === currentRef.current) return
    animatingRef.current = true
    currentRef.current = next
    setDisplay(next)
    setTimeout(() => {
      animatingRef.current = false
    }, 450)
  }

  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!hovered.current) {
        goTo((currentRef.current + 1) % slides.length)
      }
    }, 2000)
    return () => clearInterval(autoRef.current)
  }, [])

  return (
    <div className='flex flex-col gap-3 items-center w-full select-none'>
      <div className='relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden'>
        {slides.map((slide, i) => {
          const offset = (i - display + slides.length) % slides.length
          const style = getSlideStyle(offset, slides.length)

          return (
            <div
              key={i}
              aria-hidden={i !== display}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 'clamp(150px, 40vw, 200px)',
                marginLeft: 'calc(clamp(150px, 40vw, 200px) / -2)',
                marginTop: '-130px',
                zIndex: style.zIndex,
                transform: `translateX(${style.x}) rotate(${style.rotate}deg) scale(${style.scale})`,
                opacity: style.opacity,
                transition:
                  'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '10px 10px 36px',
                  border: '1px solid #e8e2d8',
                  boxShadow: '0 4px 16px rgba(28,20,16,0.12)',
                }}
              >
                <img
                  src={slide.url}
                  alt={slide.caption}
                  style={{
                    width: '100%',
                    height: 'clamp(120px, 25vw, 180px)',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '11px',
                    color: '#6B5F58',
                    textAlign: 'center',
                    marginTop: '8px',
                    fontStyle: 'italic',
                    lineHeight: '1.4',
                  }}
                >
                  {slide.caption}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PolaroidCarousel
