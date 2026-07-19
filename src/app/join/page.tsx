'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Scale } from 'lucide-react';
import { ALL_ROLES, CHAPTERS } from '@/lib/domain';
import { db, firebaseConfigured } from '@/lib/firebase';

export default function JoinPage() {
  const [form, setForm] = useState({ name: '', email: '', role: '', city: '', headline: '', notes: '' });
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!firebaseConfigured) return setState('error');
    setState('saving');
    try {
      const chapter = CHAPTERS.find((item) => item.city === form.city);
      await addDoc(collection(db, 'participants'), {
        ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), notes: form.notes.trim(),
        chapterId: chapter?.id ?? null, status: 'pending', source: 'public_registration',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setState('saved');
    } catch (error) { console.error(error); setState('error'); }
  }
  return <main className="min-h-screen bg-slate-950 text-white">
    <nav className="border-b border-white/10 px-6 py-5"><div className="mx-auto flex max-w-5xl items-center justify-between">
      <span className="flex items-center gap-2 font-semibold"><Scale className="text-blue-400"/> BEAM Law</span>
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-300"><ArrowLeft size={16}/> Back home</Link>
    </div></nav>
    <section className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[.22em] text-blue-400">Volunteer network</p>
      <h1 className="text-4xl font-bold">Join the team</h1>
      <p className="mt-4 text-slate-400">Register once to be considered for legal aid, IP support, and governance reform cases.</p>
      {state === 'saved' ? <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8"><h2 className="text-xl font-semibold">Application received</h2><p className="mt-2 text-slate-300">Your participant profile is pending admin review.</p></div> :
      <form onSubmit={submit} className="mt-10 grid gap-5 rounded-2xl border border-white/10 bg-white/[.04] p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
          <Field label="Email"><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
          <Field label="Role"><select required value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="">Select a role</option>{ALL_ROLES.map(role=><option key={role}>{role}</option>)}</select></Field>
          <Field label="Chapter / City"><select required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}><option value="">Select a city</option>{CHAPTERS.map(c=><option key={c.id}>{c.city}</option>)}</select></Field>
        </div>
        <Field label="Headline"><input required value={form.headline} onChange={e=>setForm({...form,headline:e.target.value})} placeholder="Housing attorney and community advocate"/></Field>
        <Field label="Notes"><textarea rows={5} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Experience, interests, and availability"/></Field>
        <button disabled={state==='saving'} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">{state==='saving'?'Submitting…':'Submit for review'}</button>
        {state==='error'&&<p className="text-sm text-red-400">Submission failed. Please try again or contact the team.</p>}
      </form>}
    </section>
  </main>;
}

function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="grid gap-2 text-sm font-medium text-slate-300">{label}<span className="contents [&_input]:rounded-lg [&_input]:border [&_input]:border-white/10 [&_input]:bg-slate-900 [&_input]:px-4 [&_input]:py-3 [&_select]:rounded-lg [&_select]:border [&_select]:border-white/10 [&_select]:bg-slate-900 [&_select]:px-4 [&_select]:py-3 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-white/10 [&_textarea]:bg-slate-900 [&_textarea]:px-4 [&_textarea]:py-3">{children}</span></label> }
