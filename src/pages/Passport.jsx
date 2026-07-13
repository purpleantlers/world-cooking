import { useState, useEffect, useRef } from 'react'
import { countryFlagCodes } from '../utils/countryFlagCodes'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import PassportProfile from '../components/PassportProfile'
import StampDetail from '../components/StampDetail'
import Progress from '../components/Progress'
import { Link } from 'react-router-dom'

const STAMPS_PER_PAGE = 6

const rotationFor = (index) => {
  const angles = [-8, 6, -4, 10, -10, 4]
  return angles[index % angles.length]
}

const chunk = (items, size) => {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

// ── Ink-smudge stamp ──────────────────────────────────────────────────────────
function InkStamp({ tasted, index, onClick }) {
  const flagCode = countryFlagCodes[tasted.country]

  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation()
        onClick(tasted)
      }}
      className='flex flex-col items-center gap-2 cursor-pointer focus:outline-none group'
      style={{ transform: `rotate(${rotationFor(index)}deg)` }}
    >
      {/* Outer dashed ring — real stamp border feel */}
      <div className='stamp-ink-outer'>
        {/* Inner ink-bleed shadow ring */}
        <div className='stamp-ink-ring'>
          {flagCode ? (
            <span className={`fi fi-${flagCode} passport-stamp block`} />
          ) : (
            <span className='passport-stamp flex items-center justify-center bg-primary-100 text-xs font-bold text-primary'>
              {tasted.country.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Country label — mono ink-stamp style */}
      <span className='text-[9px] font-mono font-bold tracking-widest uppercase text-center truncate w-20 text-primary/60 group-hover:text-primary transition-colors duration-300'>
        {tasted.country}
      </span>
    </button>
  )
}

function StampGrid({ stamps, onStampClick }) {
  return (
    <div className='grid grid-cols-2 gap-6 p-4 z-30'>
      {stamps.map((tasted, index) => (
        <InkStamp
          key={tasted.country}
          tasted={tasted}
          index={index}
          onClick={onStampClick}
        />
      ))}
    </div>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────
const PAGE_BG = '#F8F3E8'
const COVER_BG = '#1C1410'

function PageShell({ pageNumber, totalPages, isCover = false, children }) {
  return (
    <div
      className='relative w-full h-full flex flex-col overflow-hidden'
      style={{ backgroundColor: isCover ? COVER_BG : PAGE_BG }}
    >
      {!isCover && (
        <>
          {/* Inner border */}
          <div className='absolute inset-2 border border-primary/10 rounded-xl pointer-events-none z-0' />
          {/* Watermark */}
          <div
            className='absolute inset-0 flex items-center justify-center pointer-events-none z-0'
            aria-hidden='true'
          >
            <span
              className='text-4xl font-black tracking-widest rotate-[-35deg] whitespace-nowrap select-none'
              style={{ color: 'rgba(139,46,26,0.04)' }}
            >
              WORLD COOKING
            </span>
          </div>
        </>
      )}

      <div className='relative flex-1 flex items-center justify-center overflow-hidden z-10'>
        {children}
      </div>

      {!isCover && pageNumber !== undefined && (
        <div
          className='relative flex justify-between items-center px-4 py-2 text-[10px] font-mono tracking-widest z-10 select-none'
          style={{
            color: 'rgba(139,46,26,0.35)',
            borderTop: '1px solid rgba(139,46,26,0.08)',
          }}
        >
          <span>WORLD COOKING</span>
          <span>
            {pageNumber} / {totalPages}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
function Passport({ challengeData }) {
  const { user } = useAuth()
  const { profile, loading: profileLoading, updateProfile } = useProfile(user)
  const {
    countriesTasted = [],
    deleteCountry,
    world = [],
    countryChallenge,
  } = challengeData

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  )
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('passport_page_index')
    return saved ? parseInt(saved, 10) : 0
  })
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const pointerStartX = useRef(null)
  const pointerStartY = useRef(null)
  const isDragging = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    localStorage.setItem('passport_page_index', currentIndex)
  }, [currentIndex])

  if (profileLoading || !profile) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-sm text-text-muted animate-pulse'>
          Loading passport…
        </p>
      </div>
    )
  }

  const stampPages = chunk(countriesTasted, STAMPS_PER_PAGE)

  // ── Cover ──
  const coverPage = (
    <PageShell isCover>
      <div className='flex flex-col items-center justify-around w-full h-full select-none pointer-events-none px-8'>
        {/* Logo circle with amber ring */}
        <div
          className='w-32 h-32 rounded-full flex items-center justify-center'
          style={{ border: '2px solid rgba(196,132,58,0.6)', padding: '6px' }}
        >
          <div
            className='w-full h-full rounded-full flex items-center justify-center'
            style={{ border: '1px dashed rgba(196,132,58,0.35)' }}
          >
            <img
              src='logo.png'
              alt='logo'
              className='w-16 h-16 object-contain'
            />
          </div>
        </div>

        <div className='flex flex-col gap-2 items-center'>
          <p
            className='text-[10px] tracking-[0.3em] uppercase font-mono'
            style={{ color: 'rgba(196,132,58,0.5)' }}
          >
            Culinary Chronicles
          </p>
          <h2
            className='text-2xl font-bold tracking-[0.2em] uppercase'
            style={{
              color: 'rgba(196,132,58,0.85)',
              fontFamily: 'Georgia, serif',
            }}
          >
            Passport
          </h2>
          <div
            className='w-20 h-px mt-1'
            style={{ background: 'rgba(196,132,58,0.3)' }}
          />
          <p
            className='text-[9px] tracking-widest uppercase font-mono mt-1'
            style={{ color: 'rgba(196,132,58,0.35)' }}
          >
            World Cooking
          </p>
        </div>
      </div>
    </PageShell>
  )

  // ── Profile page ──
  const profilePage = (totalPages) => (
    <PageShell pageNumber={2} totalPages={totalPages}>
      <div className='w-full h-full flex flex-col justify-between p-4 relative z-30 overflow-hidden'>
        <PassportProfile
          profile={profile}
          issueDate={user?.created_at}
          onUpdate={updateProfile}
        />
        <div
          className='mt-2 pt-3 px-2'
          style={{ borderTop: '1px solid rgba(139,46,26,0.08)' }}
        >
          <span
            className='text-[10px] font-mono font-bold uppercase tracking-widest block mb-2'
            style={{ color: 'rgba(139,46,26,0.4)' }}
          >
            Travel Achievements
          </span>
          <Progress
            tasted={countriesTasted.length}
            total={world.length || 195}
            nextCountry={countryChallenge || null}
            compact
          />
        </div>
      </div>
    </PageShell>
  )

  // ── Build views ──
  const views = []

  if (isMobile) {
    const totalPages = 2 + (stampPages.length === 0 ? 1 : stampPages.length)
    views.push({ type: 'cover', content: coverPage })
    views.push({ type: 'profile', content: profilePage(totalPages) })

    if (stampPages.length === 0) {
      views.push({
        type: 'stamps',
        content: (
          <PageShell pageNumber={3} totalPages={totalPages}>
            <p
              className='text-sm text-center px-6 select-none'
              style={{ color: 'rgba(139,46,26,0.4)' }}
            >
              No stamps yet — complete a challenge to earn your first one.
            </p>
          </PageShell>
        ),
      })
    } else {
      stampPages.forEach((stamps, i) => {
        views.push({
          type: 'stamps',
          content: (
            <PageShell pageNumber={3 + i} totalPages={totalPages}>
              <StampGrid stamps={stamps} onStampClick={setSelectedCountry} />
            </PageShell>
          ),
        })
      })
    }
  } else {
    const totalStampPages =
      stampPages.length === 0
        ? 2
        : stampPages.length % 2 === 0
          ? stampPages.length
          : stampPages.length + 1
    const totalPages = 2 + totalStampPages

    views.push({ type: 'cover', left: null, right: coverPage })
    views.push({
      type: 'profile',
      left: <PageShell pageNumber={1} totalPages={totalPages} />,
      right: profilePage(totalPages),
    })

    if (stampPages.length === 0) {
      views.push({
        type: 'stamps',
        left: (
          <PageShell pageNumber={3} totalPages={4}>
            <StampGrid stamps={[]} onStampClick={setSelectedCountry} />
          </PageShell>
        ),
        right: (
          <PageShell pageNumber={4} totalPages={4}>
            <p
              className='text-sm text-center px-6 select-none'
              style={{ color: 'rgba(139,46,26,0.4)' }}
            >
              No stamps yet — complete a challenge to earn your first one.
            </p>
          </PageShell>
        ),
      })
    } else {
      for (let i = 0; i < stampPages.length; i += 2) {
        const leftStamps = stampPages[i] || []
        const rightStamps = stampPages[i + 1] || []
        const leftPageNum = 3 + i
        views.push({
          type: 'stamps',
          left: (
            <PageShell pageNumber={leftPageNum} totalPages={totalPages}>
              <StampGrid
                stamps={leftStamps}
                onStampClick={setSelectedCountry}
              />
            </PageShell>
          ),
          right: (
            <PageShell pageNumber={leftPageNum + 1} totalPages={totalPages}>
              {rightStamps.length > 0 ? (
                <StampGrid
                  stamps={rightStamps}
                  onStampClick={setSelectedCountry}
                />
              ) : (
                <></>
              )}
            </PageShell>
          ),
        })
      }
    }
  }

  const safeIndex =
    currentIndex >= views.length ? views.length - 1 : currentIndex
  const activeView = views[safeIndex] || views[0]

  const handleNext = () => {
    if (safeIndex < views.length - 1 && !isFlipping) {
      setIsFlipping(true)
      setCurrentIndex(safeIndex + 1)
      setTimeout(() => setIsFlipping(false), 500)
    }
  }

  const handlePrev = () => {
    if (safeIndex > 0 && !isFlipping) {
      setIsFlipping(true)
      setCurrentIndex(safeIndex - 1)
      setTimeout(() => setIsFlipping(false), 500)
    }
  }

  const handlePointerDown = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('input') ||
      e.target.closest('select')
    )
      return
    isDragging.current = true
    pointerStartX.current = e.clientX
    pointerStartY.current = e.clientY
  }

  const handlePointerUp = (e) => {
    if (!isDragging.current || pointerStartX.current === null) return
    const diffX = e.clientX - pointerStartX.current
    const diffY = e.clientY - pointerStartY.current
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < -50) handleNext()
      else if (diffX > 50) handlePrev()
    }
    isDragging.current = false
    pointerStartX.current = null
    pointerStartY.current = null
  }

  const bookWidth = isMobile
    ? '100%'
    : activeView.type === 'cover'
      ? '340px'
      : '680px'

  return (
    <div className='max-w-4xl mx-auto w-full px-4 py-10 flex flex-col items-center gap-6'>
      {/* ── Book ── */}
      <div className='relative flex items-center justify-center w-full'>
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className={`relative flex rounded-xl overflow-hidden transition-all duration-300 ease-in-out touch-none select-none ${
            isDragging.current ? 'cursor-grabbing' : 'cursor-grab'
          } ${isFlipping ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'}`}
          style={{
            width: bookWidth,
            height: isMobile ? '440px' : '480px',
            maxWidth: isMobile ? '340px' : 'none',
            boxShadow:
              '0 20px 60px rgba(28,20,16,0.25), 0 4px 12px rgba(28,20,16,0.15)',
          }}
        >
          {isMobile ? (
            <div className='w-full h-full relative overflow-hidden'>
              {activeView.content}
            </div>
          ) : (
            <>
              {activeView.type !== 'cover' && (
                <div className='w-1/2 h-full relative z-10 overflow-hidden'>
                  {activeView.left}
                  {/* Spine shadow */}
                  <div className='absolute top-0 right-0 w-6 h-full bg-linear-to-l from-black/8 to-transparent pointer-events-none z-20' />
                </div>
              )}
              <div
                className='h-full relative overflow-hidden transition-all duration-300 ease-in-out z-10'
                style={{ width: activeView.type === 'cover' ? '100%' : '50%' }}
              >
                {activeView.right}
                {activeView.type !== 'cover' && (
                  <div className='absolute top-0 left-0 w-6 h-full bg-linear-to-r from-black/8 to-transparent pointer-events-none z-20' />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className='flex items-center gap-4 select-none'>
        <button
          type='button'
          onClick={handlePrev}
          disabled={safeIndex === 0 || isFlipping}
          aria-label='Previous page'
          className='w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer text-lg font-semibold'
        >
          ‹
        </button>

        <div
          className='flex gap-2 max-w-[200px] overflow-x-auto py-1.5'
          role='tablist'
          aria-label='Passport pages'
        >
          {views.map((_, index) => (
            <button
              key={index}
              type='button'
              role='tab'
              aria-selected={index === safeIndex}
              aria-label={`Page ${index + 1}`}
              onClick={() => {
                if (index !== safeIndex && !isFlipping) setCurrentIndex(index)
              }}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 shrink-0 ${
                index === safeIndex
                  ? 'bg-primary w-4'
                  : 'bg-border w-2 hover:bg-primary/40'
              }`}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={handleNext}
          disabled={safeIndex === views.length - 1 || isFlipping}
          aria-label='Next page'
          className='w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer text-lg font-semibold'
        >
          ›
        </button>
      </div>

      {/* ── Stamp detail modal ── */}
      <StampDetail
        tasted={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onDelete={deleteCountry}
      />
    </div>
  )
}

export default Passport
