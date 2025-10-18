import React, { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function CreatePitch({ user }){
  const [idea, setIdea] = useState('')
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')

  const onGenerate = async () => {
    if(!idea.trim()) return setNote('Please enter an idea.')
    setLoading(true)
    setNote('Calling AI service...')

    try{
      // Placeholder: call your server-side AI endpoint which uses Gemini/OpenAI securely.
      // Implement a server function at /api/generate that accepts { idea, tone } and returns structured pitch.
      const res = await fetch('/api/generate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ idea, tone })
      })

      if(!res.ok) throw new Error('AI service error')
      const data = await res.json()
      // expected: { name, tagline, pitch, problem, solution, audience, landingCopy }
      const pitchDoc = {
        owner: user.uid,
        idea,
        tone,
        generated: data,
        createdAt: serverTimestamp()
      }
      await addDoc(collection(db, 'pitches'), pitchDoc)
      setNote('Pitch generated and saved.')
      setIdea('')
    }catch(err){
      console.error(err)
      setNote('AI generation failed — check server logs / implement /api/generate.')
    }finally{
      setLoading(false)
      setTimeout(()=>setNote(''),4000)
    }
  }

  return (
    <div className="card">
      <h3>Create a new pitch</h3>
      <label>Idea (short)</label>
      <textarea value={idea} onChange={e=>setIdea(e.target.value)} rows={3} />
      <label>Tone</label>
      <select value={tone} onChange={e=>setTone(e.target.value)}>
        <option>Professional</option>
        <option>Casual</option>
        <option>Playful</option>
      </select>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={onGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Pitch'}</button>
        <small style={{marginLeft:12,color:'#6b7280'}}>{note}</small>
      </div>
    </div>
  )
}
