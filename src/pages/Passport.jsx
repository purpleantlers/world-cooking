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

// Ink stamp
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
      {/* Outer dashed ring */}
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

      {/* Country label */}
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

// Page shell
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

// Main Passport page
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

  // Cover
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
            <svg
              width='1024'
              height='1024'
              viewBox='0 0 1024 1024'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M617.654 383.756L618.101 387.186L612.961 388.25L612.277 395.557H618.434L626.624 394.768L630.852 389.742L626.358 387.994L623.897 385.162L620.201 379.177L618.434 370.711L611.488 372.127L609.54 375.11V378.474L612.885 380.763L617.654 383.756Z'
                fill='white'
              />
              <path
                d='M611.736 386.569L612.107 381.989L608.031 380.231L602.33 381.552L598.102 388.336V392.735H603.033L611.736 386.569Z'
                fill='white'
              />
              <path
                d='M566.677 337.058L596.448 328.823L603.519 315.165L561.399 296.296L510.935 296.296L527.088 328.823L545.457 353.21L566.677 337.058Z'
                fill='white'
              />
              <path
                d='M543.554 698.634L524.333 714.116L519.621 730.286L570.059 730.077L599.538 716.889L609.615 706.567L588.042 691.616L565.501 688.815L543.554 698.634Z'
                fill='white'
              />
              <path
                d='M582.463 362.86V364.712L583.331 366.07L585.314 366.832L587.965 365.652L589.839 364.712L590.299 361.481L587.31 362.86L583.86 362.4L582.463 362.86Z'
                fill='white'
              />
              <path
                d='M494.393 406.018L493.139 409.249H487.067V412.384H488.512C488.512 412.384 488.597 413.049 488.721 413.923L492.445 413.61L494.773 412.165L495.381 409.249L498.393 408.992L499.581 406.541L496.816 405.971L494.393 406.018Z'
                fill='white'
              />
              <path
                d='M478.745 411.709L478.508 414.778L482.907 414.407L483.363 411.329L480.722 409.248L478.745 411.709Z'
                fill='white'
              />
              <path
                d='M742.951 509.61C742.885 502.855 742.543 496.147 741.906 489.544C739.768 467.529 734.504 446.427 726.618 426.645C726.029 425.173 725.488 423.681 724.86 422.227C714.352 397.4 699.596 374.797 681.534 355.291C680.346 354.017 679.139 352.763 677.933 351.528C674.522 347.984 671.016 344.526 667.386 341.21C626.321 303.822 571.782 281 511.999 281C451.713 281 396.785 304.231 355.605 342.188C346.009 351.034 337.192 360.687 329.191 371.025C299.015 410.056 281 458.95 281 511.995C281 639.379 384.632 743 512.009 743C601.608 743 679.396 691.693 717.687 616.937C725.877 600.956 732.253 583.92 736.547 566.067C737.64 561.535 738.581 556.984 739.398 552.376C741.725 539.254 742.999 525.763 742.999 511.995C743.008 511.197 742.961 510.409 742.951 509.61ZM699.473 417.286L700.812 415.785C702.57 419.196 704.214 422.664 705.781 426.18L703.596 426.094L699.473 426.664V417.286ZM666.094 376.982L666.132 366.664C669.761 370.512 673.258 374.474 676.603 378.578L672.441 384.773L657.894 384.64L656.982 381.609L666.094 376.982ZM387.435 351.338V350.948H392.062L392.461 349.362H400.034V352.668L397.858 355.576H387.426L387.435 351.338ZM394.827 361.647C394.827 361.647 399.455 360.858 399.854 360.858C400.253 360.858 399.854 365.476 399.854 365.476L389.421 366.132L387.435 363.756L394.827 361.647ZM714.19 453.344H697.287L686.988 445.676L676.146 446.731V453.344H672.716L669.011 450.702L650.236 445.942V433.781L626.444 435.633L619.071 439.595H609.627L605 439.13L593.531 445.496V457.477L570.091 474.389L572.039 481.61H576.79L575.545 488.489L572.201 489.715L572.02 507.691L592.277 530.76H601.094L601.627 529.354H617.475L622.045 525.126H631.034L635.965 530.067L649.362 531.454L647.585 549.269L662.455 575.521L654.626 590.485L655.158 597.535L661.324 603.683V620.633L669.419 631.521V645.602H676.412C637.495 693.384 578.262 723.988 511.99 723.988C395.103 723.997 300.003 628.89 300.003 511.995C300.003 482.57 306.046 454.522 316.925 429.03V422.417L324.507 413.21C327.139 408.241 329.961 403.396 332.973 398.673L333.315 402.521L324.507 413.21C321.78 418.36 319.243 423.624 316.934 429.03V441.097L325.742 445.334V462.104L334.189 476.517L341.059 477.572L341.942 472.631L333.838 460.128L332.251 447.976H337.001L339.006 460.479L350.722 477.572L347.7 483.092L355.149 494.484L373.649 499.064V496.071L381.05 497.126L380.347 502.408L386.162 503.473L395.141 505.924L407.825 520.375L424.025 521.601L425.612 534.817L414.524 542.57L414.001 554.371L412.415 561.592L428.453 581.668L429.679 588.547C429.679 588.547 435.494 590.124 436.206 590.124C436.909 590.124 449.242 599.464 449.242 599.464V635.75L453.641 636.985L450.648 653.726L458.05 663.598L456.682 680.187L466.459 697.375L479.01 708.339L491.628 708.567L492.863 704.51L483.59 696.7L484.122 692.824L485.785 688.073L486.136 683.227L479.865 683.037L476.701 679.066L481.908 674.059L482.611 670.277L476.796 668.614L477.138 665.099L485.424 663.845L498.023 657.793L502.251 650.039L515.467 633.127L512.465 619.901L516.522 612.861L528.674 613.231L536.855 606.752L539.497 581.231L548.57 569.706L550.157 562.305L541.881 559.654L536.418 550.694L517.748 550.504L502.944 544.86L502.241 534.304L497.301 525.668L483.913 525.468L476.179 513.325L469.309 509.971L468.958 513.677L456.454 514.418L451.874 508.043L438.829 505.392L428.082 517.81L411.17 514.941L409.944 495.881L397.602 493.772L402.552 484.423L401.136 479.054L384.917 489.895L374.713 488.651L371.074 480.679L373.297 472.46L378.922 462.094L391.872 455.539L416.88 455.529L416.814 463.159L425.802 467.339L425.09 454.303L431.569 447.786L444.643 439.196L445.537 433.154L458.573 419.586L472.435 411.909L471.21 410.902L480.597 402.065L484.037 402.978L485.614 404.954L489.177 401.001L490.051 400.612L486.146 400.061L482.184 398.74V394.939L484.284 393.22H488.911L491.03 394.151L492.863 397.856L495.106 397.514V397.191L495.752 397.41L502.251 396.412L503.172 393.239L506.878 394.17V397.609L503.438 399.975H503.448L503.952 403.747L515.724 407.377C515.724 407.377 515.733 407.424 515.752 407.519L518.46 407.291L518.641 402.189L509.31 397.942L508.778 395.49L516.522 392.849L516.864 385.438L508.769 380.507L508.237 368.013L497.139 373.467H493.091L494.156 363.956L479.048 360.393L472.796 365.115V379.519L461.556 383.082L457.052 392.469L452.169 393.258V381.248L441.603 379.785L436.32 376.345L434.192 368.564L453.09 357.504L462.335 354.692L463.266 360.906L468.416 360.64L468.815 357.514L474.203 356.744L474.298 355.652L471.979 354.692L471.447 351.386L478.07 350.825L482.07 346.663L482.288 346.359L482.336 346.378L483.552 345.124L497.472 343.366L503.629 348.592L487.486 357.191L508.028 362.036L510.688 355.167H519.667L522.84 349.181L516.493 347.595V340.022L496.588 331.205L482.849 332.792L475.096 336.849L475.628 346.711L467.523 345.476L466.278 340.022L474.041 332.972L459.95 332.269L455.903 333.495L454.145 338.245L459.428 339.138L458.373 344.421L449.394 344.953L447.988 348.469L434.962 348.83C434.962 348.83 434.6 341.438 434.078 341.438C433.555 341.438 444.292 341.257 444.292 341.257L452.055 333.675L447.817 331.556L442.183 337.029L432.833 336.497L427.199 328.744H415.217L402.714 338.084H414.172L415.217 341.438L412.244 344.203L424.928 344.554L426.866 349.134L412.586 348.602L411.892 345.077L402.913 343.138L398.153 340.497L387.464 340.583C422.458 315.091 465.49 300.003 511.999 300.003C565.607 300.003 614.587 320.041 651.956 352.963L649.438 357.466L639.661 361.295L635.537 365.77L636.487 370.987L641.533 371.69L644.573 379.291L653.276 375.785L654.711 385.951H652.089L644.944 384.897L637.019 386.227L629.352 397.058L618.387 398.778L616.8 408.165L621.428 409.258L620.088 415.291L609.199 413.106L599.213 415.291L597.094 420.849L598.824 432.517L604.686 435.263L614.52 435.206L621.161 434.607L623.185 429.325L633.561 415.842L640.392 417.239L647.12 411.158L648.374 415.909L664.925 427.073L662.901 429.79L655.443 429.391L658.312 433.458L662.901 434.465L668.279 432.222L668.165 425.743L670.55 424.545L668.631 422.512L657.59 416.355L654.683 408.175H663.861L666.797 411.082L674.702 417.895L675.035 426.132L683.225 434.854L686.275 422.902L691.947 419.804L693.012 429.581L698.551 435.662L709.601 435.472C711.739 440.973 713.658 446.569 715.34 452.28L714.19 453.344ZM406.999 385.951L412.548 383.31L417.564 384.507L415.835 391.243L410.419 392.963L406.999 385.951ZM436.444 401.809V406.17H423.769L419.018 404.849L420.206 401.809L426.296 399.291H434.619V401.809H436.444ZM442.278 407.89V412.118L439.104 414.161L435.152 414.892C435.152 414.892 435.152 408.555 435.152 407.89H442.278ZM438.705 406.17V401.144L443.066 405.115L438.705 406.17ZM440.691 416.336V420.45L437.66 423.491H430.923L431.978 418.873L435.161 418.598L435.817 417.011L440.691 416.336ZM423.911 407.89H430.914L421.935 420.441L418.229 418.455L419.028 413.172L423.911 407.89ZM452.587 414.892V418.997H445.85L444.007 416.336V412.517H444.539L452.587 414.892ZM446.363 409.248L448.283 407.234L451.523 409.248L448.929 411.386L446.363 409.248ZM717.63 464.042L718.295 463.263C718.57 464.46 718.865 465.657 719.131 466.874L717.63 464.042Z'
                fill='white'
              />
              <path
                d='M316.934 422.417L316.934 429.03C319.243 423.633 321.79 418.37 324.516 413.21L316.934 422.417Z'
                fill='white'
              />
              <path
                d='M875.812 283.325L876.051 732.059L875.968 735.928C875.972 743.825 867.931 746.177 860.5 747.525C857.528 748.064 855.736 748.063 852.763 747.521C845.331 746.165 837.288 743.804 837.284 735.907C837.279 728.01 837.282 732.039 837.282 732.039L837.22 615.987L806.637 615.971L806.617 580.345L808.428 537.615L812.098 483.754C817.291 428.376 824.503 372.598 842.688 321.46C848.646 308.063 853.775 291.957 868.2 284.522C870.588 283.418 871.944 283.323 875.812 283.325ZM858.809 646.945C857.282 646.544 855.673 646.582 854.168 647.054C852.663 647.527 851.322 648.416 850.3 649.618C849.364 650.839 848.776 652.29 848.6 653.818C848.424 655.347 848.665 656.895 849.299 658.298C849.769 659.285 850.436 660.166 851.258 660.886C852.081 661.606 853.042 662.151 854.082 662.486C855.567 662.865 857.127 662.836 858.596 662.403C860.065 661.969 861.389 661.147 862.429 660.023C863.412 658.762 864.031 657.255 864.219 655.666C864.408 654.078 864.159 652.468 863.5 651.01C862.513 649.105 860.834 647.651 858.809 646.945ZM853.933 677.89C852.539 678.525 851.3 679.519 850.416 680.771C849.531 682.022 848.995 683.485 848.862 685.012C848.763 686.681 849.172 688.341 850.036 689.773C850.9 691.204 852.179 692.34 853.702 693.03C855.088 693.6 856.606 693.77 858.082 693.521C859.559 693.271 860.936 692.612 862.057 691.619C863.22 690.461 864.04 689.003 864.424 687.407C864.809 685.81 864.743 684.138 864.234 682.576C863.444 680.624 861.934 679.049 860.017 678.177C858.1 677.304 855.922 677.202 853.933 677.89Z'
                fill='white'
              />
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M167.562 491.331C201.252 479.06 234.156 472.31 234.178 416.931C234.19 386.956 217.814 317.663 205.81 297.249L193.079 415.611L172.924 415.619L157.165 297.269L142.533 415.632L121.155 415.64L109.272 297.288C97.126 318.009 80.0677 386.542 80.0557 416.606C80.0338 471.392 113.904 478.62 147.396 490.924C148.666 528.911 155.395 644.123 131.305 730.11C125.086 752.282 143.462 759.641 156.98 759.635C170.31 759.63 188.723 751.871 182.679 730.09C159.065 644.596 165.947 531.783 166.872 491.361L167.562 491.331Z'
                fill='white'
              />
            </svg>
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

  // Profile
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

  // Build
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
      {/* Book */}
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

      {/* Navigation */}
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

      {/* Stamp detail modal */}
      <StampDetail
        tasted={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onDelete={deleteCountry}
      />
    </div>
  )
}

export default Passport
