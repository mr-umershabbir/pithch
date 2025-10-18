import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './firebase'
import AuthForm from './components/AuthForm'
import CreatePitch from './components/CreatePitch'
import PitchList from './components/PitchList'

export default function App(){
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return () => unsub()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>PitchCraft</h1>
        <div>
          {user ? (
            <>
              <span className="small">Hi, {user.email}</span>
              <button className="btn" onClick={() => signOut(auth)}>Logout</button>
            </>
          ) : null}
        </div>
      </header>

      <main className="container">
        {!user ? (
          <AuthForm />
        ) : (
          <>
            <CreatePitch user={user} />
            <PitchList user={user} />
          </>
        )}
      </main>

      <footer className="footer">
        <small>PitchCraft - Starter • Built for learning</small>
      </footer>
    </div>
  )
}
