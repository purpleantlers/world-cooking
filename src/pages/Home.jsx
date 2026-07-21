import { useNavigate, Link } from 'react-router-dom'
import Hero from '../components/Hero'

const steps = [
  {
    number: '01',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='currentColor'
        className='w-6 h-6'
      >
        <path
          fillRule='evenodd'
          d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 1011.672 8.214l-.46-.46a2.252 2.252 0 01-.422-.586l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 01-1.384-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.41-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525'
          clipRule='evenodd'
        />
      </svg>
    ),
    color: 'bg-primary-100 text-primary',
    label: 'Choose Your Destination',
    description:
      'Select a country or discover a random one. Each destination reveals curated signature recipes representing its heritage.',
  },
  {
    number: '02',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-6 h-6'
      >
        <path
          d='M13.0726 19H6.18332C5.35082 19 4.55423 18.7053 3.94024 18.1703C3.3278 17.6365 2.94976 16.9095 2.87542 16.1226L2.46372 12.4685C2.4278 12.1491 2.67064 11.8624 3.00623 11.8282C3.34195 11.7944 3.64307 12.0251 3.67908 12.3444L4.09132 16.0037C4.09173 16.0074 4.09214 16.0111 4.09241 16.0147C4.18861 17.0535 5.08748 17.8369 6.18342 17.8369H13.0726C14.1685 17.8369 15.0674 17.0535 15.1636 16.0147C15.164 16.0114 15.1642 16.0081 15.1647 16.0047L15.5716 12.3373C15.6069 12.0179 15.9073 11.7854 16.2434 11.82C16.5791 11.8536 16.8224 12.1399 16.787 12.4593L16.3807 16.122C16.3064 16.9092 15.9284 17.6364 15.3158 18.1702C14.7017 18.7053 13.9051 19 13.0726 19Z'
          fill='currentColor'
        />
        <path
          d='M22.9223 12.3618H16.1645L15.9473 14.4129H22.9223C23.515 14.4129 24 13.9514 24 13.3873C24 12.8233 23.5151 12.3618 22.9223 12.3618Z'
          fill='currentColor'
        />
        <path
          d='M15.9707 7.67751H10.8746C10.9228 7.54682 10.9493 7.40641 10.9493 7.26001C10.9493 6.56412 10.3565 6 9.62525 6C8.89402 6 8.30113 6.56408 8.30113 7.26001C8.30113 7.40637 8.32766 7.54682 8.37588 7.67751H3.27986C2.57598 7.67751 2 8.22557 2 8.89544C2 9.5653 2.57593 10.1134 3.27986 10.1134H15.9708C16.6747 10.1134 17.2506 9.5653 17.2506 8.89544C17.2506 8.22562 16.6746 7.67751 15.9707 7.67751Z'
          fill='currentColor'
        />
      </svg>
    ),
    color: 'bg-accent-100 text-primary',
    label: 'Cook & Document',
    description:
      'Follow the guided journal to prepare your meal. Log your experience, photograph the results, and note the cultural flavors.',
  },
  {
    number: '03',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-6 h-6'
      >
        <path
          d='M8.11111 12.5556L9.78767 14.2321C10.1696 14.614 10.3606 14.805 10.5776 14.8691C10.7682 14.9253 10.9721 14.9161 11.1569 14.8428C11.3672 14.7593 11.5401 14.5519 11.8859 14.1369L16.4444 8.66667M16.8097 3.95394C17.6307 3.97737 18.4446 4.30236 19.0711 4.92889C19.6976 5.55543 20.0226 6.36933 20.046 7.19023C20.0692 8.00258 20.0808 8.40874 20.1047 8.50329C20.1557 8.70567 20.0963 8.5625 20.2033 8.74169C20.2533 8.8254 20.5324 9.12084 21.0904 9.71161C21.6543 10.3087 22 11.114 22 12C22 12.886 21.6543 13.6913 21.0904 14.2883C20.5324 14.8791 20.2533 15.1746 20.2033 15.2583C20.0963 15.4374 20.1557 15.2943 20.1047 15.4967C20.0808 15.5912 20.0692 15.9974 20.046 16.8098C20.0226 17.6307 19.6976 18.4446 19.0711 19.0711C18.4446 19.6977 17.6307 20.0227 16.8097 20.046C15.9973 20.0692 15.5912 20.0808 15.4967 20.1047C15.2943 20.1557 15.4374 20.0964 15.2583 20.2034C15.1746 20.2534 14.8791 20.5324 14.2883 21.0904C13.6913 21.6543 12.886 22 12 22C11.114 22 10.3087 21.6543 9.71163 21.0904C9.12082 20.5324 8.82541 20.2534 8.7417 20.2034C8.56251 20.0964 8.70567 20.1557 8.50329 20.1047C8.40876 20.0808 8.0025 20.0692 7.19023 20.046C6.36931 20.0227 5.5554 19.6977 4.92886 19.0711C4.3023 18.4446 3.97732 17.6307 3.95391 16.8097C3.93073 15.9973 3.91916 15.5912 3.89531 15.4967C3.84428 15.2943 3.90358 15.4374 3.79657 15.2582C3.74658 15.1746 3.46758 14.8791 2.90958 14.2883C2.3457 13.6913 2 12.886 2 12C2 11.114 2.3457 10.3087 2.90958 9.71165C3.46758 9.12085 3.74658 8.82543 3.79657 8.74172C3.90358 8.56253 3.84428 8.70569 3.89531 8.50332C3.91916 8.40878 3.93073 8.00261 3.95391 7.19029C3.97732 6.36937 4.3023 5.55544 4.92886 4.92889C5.5554 4.30234 6.36931 3.97737 7.19023 3.95394C8.00258 3.93077 8.40876 3.91919 8.50329 3.89534C8.70567 3.84431 8.56251 3.90361 8.7417 3.7966C8.82541 3.74661 9.12084 3.46758 9.71163 2.90959C10.3087 2.3457 11.114 2 12 2C12.886 2 13.6913 2.34571 14.2883 2.9096C14.8792 3.4676 15.1746 3.7466 15.2583 3.79659C15.4374 3.9036 15.2943 3.84431 15.4967 3.89534C15.5912 3.91918 15.9973 3.93077 16.8097 3.95394Z'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    color: 'bg-secondary-100 text-secondary',
    label: 'Earn Your Stamp',
    description:
      'Upon completion, receive a unique digital passport stamp. Build your collection and track your global culinary progress.',
  },
]

function Home({ challengeData }) {
  const navigate = useNavigate()
  const {
    selectCountry,
    handleSelectChange,
    ongoingChallenge,
    countriesTasted,
    randomCountry,
    world,
    countryChallenge,
  } = challengeData

  const handleSelectAndGo = async (e) => {
    await handleSelectChange(e)
    navigate('/challenge')
  }

  const handleRandomAndGo = async () => {
    await randomCountry()
    navigate('/challenge')
  }

  return (
    <div className='flex flex-col'>
      {/* Hero + Progress */}
      <section className='max-w-6xl mx-auto w-full px-6 pt-12 pb-16'>
        <Hero
          selectCountry={selectCountry}
          handleSelectChange={handleSelectAndGo}
          ongoingChallenge={ongoingChallenge}
          countryChallenge={countryChallenge}
          countriesTasted={countriesTasted}
          randomCountry={handleRandomAndGo}
          world={world}
        />

        {/* Ongoing challenge */}
        {ongoingChallenge && (
          <p className='mt-6 text-sm text-text-muted'>
            You have an ongoing challenge:{' '}
            <span className='font-semibold text-text'>{countryChallenge}</span>.{' '}
            <Link
              to='/challenge'
              className='text-primary underline underline-offset-2'
            >
              Continue it →
            </Link>
          </p>
        )}
      </section>

      {/* How the Journey Unfolds */}
      <section className='bg-background border-border py-16'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl text-text italic'>
              How the Journey Unfolds
            </h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-10'>
            {steps.map((step) => (
              <div key={step.number} className='flex flex-col gap-4'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color}`}
                >
                  {step.icon}
                </div>
                <div>
                  <p className='text-xs font-semibold tracking-widest text-text-muted uppercase mb-1'>
                    Step {step.number}
                  </p>
                  <h3 className='text-lg font-bold text-text mb-2'>
                    {step.label}
                  </h3>
                  <p className='text-sm text-text-muted leading-6'>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className='w-full max-w-6xl mx-auto px-6 py-12'>
        <div className='bg-primary rounded-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 px-8 py-10 md:px-12 md:py-12'>
          <div className='flex flex-col gap-3 max-w-sm'>
            <h2 className='text-base font-bold text-white text-nowrap sm:text-2xl'>
              Ready for your next adventure?
            </h2>
            <p className='text-sm text-white/70 leading-6'>
              Your digital journal is waiting. Every ingredient is a story,
              every recipe a connection to a world beyond your kitchen.
            </p>
            <Link
              to='/journal'
              className='self-start mt-2 text-sm font-medium bg-background text-primary px-5 py-2 rounded shadow-text/20 shadow-lg hover:bg-background/90 transition-all duration-300'
            >
              Open My Journal
            </Link>
          </div>

          <div className='hidden sm:block w-48 h-48 shrink-0'>
            <img
              src='https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80'
              alt='Cookbook'
              className='w-full h-full object-cover rounded-lg rotate-3 shadow-xl'
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
