import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function PitchList({ user }){
  const [pitches, setPitches] = useState([])

  useEffect(() => {
    const q = query(collection(db,'pitches'), where('owner','==',user.uid), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPitches(items)
    })
    return () => unsub()
  },[user])

  const remove = async (id) => {
    if(!confirm('Delete this pitch?')) return
    await deleteDoc(doc(db,'pitches',id))
  }

  return (
    <div className="card">
      <h3>Your pitches</h3>
      {pitches.length === 0 ? <p className="muted">No pitches yet.</p> : (
        pitches.map(p => (
          <div key={p.id} style={{borderTop:'1px solid #eef2f7',paddingTop:12,marginTop:12}}>
            <strong>{p.generated?.name || '—'}</strong>
            <div style={{color:'#475569'}}>{p.generated?.tagline}</div>
            <p style={{marginTop:8}}>{p.generated?.pitch}</p>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn" onClick={()=>navigator.clipboard.writeText(JSON.stringify(p.generated))}>Copy JSON</button>
              <button onClick={()=>remove(p.id)} style={{background:'#ef4444',color:'white',border:'none',padding:'8px 10px',borderRadius:8}}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
