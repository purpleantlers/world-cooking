import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Auth from './components/Auth'
import Completed from './components/Completed'
import Home from './pages/Home'
import ChallengePage from './pages/ChallengePage'
import Passport from './pages/Passport'
import Journal from './pages/Journal'
import { useChallengeData } from './hooks/useChallengeData'
import { useAuth } from './context/AuthContext'
import Footer from './components/Footer'

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const challengeData = useChallengeData(user)
  const {
    countriesTasted,
    world,
    handleReset,
    loading: dataLoading,
  } = challengeData

  if (authLoading || (user && dataLoading)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-sm tracking-wide text-text-muted'>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  if (countriesTasted.length >= world.length) {
    return <Completed handleReset={handleReset} />
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Nav onSignOut={signOut} />

      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home challengeData={challengeData} />} />
          <Route
            path='/challenge'
            element={<ChallengePage challengeData={challengeData} />}
          />
          <Route
            path='/passport'
            element={<Passport challengeData={challengeData} />}
          />
          <Route
            path='/journal'
            element={<Journal challengeData={challengeData} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
