import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function AuthForm(){
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      if(isLogin){
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <div style={{marginTop:12}}>
          <button className="btn" type="submit">{isLogin ? 'Login' : 'Create account'}</button>
          <button type="button" style={{marginLeft:8}} onClick={()=>setIsLogin(v=>!v)}>{isLogin ? 'Go to Signup' : 'Have an account? Login'}</button>
        </div>
      </form>
    </div>
  )
}
