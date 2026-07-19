'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseBusiness, LayoutDashboard, LogOut, Scale, Shapes, Users } from 'lucide-react';
import { logOut, useAdminAuth } from './AdminAuth';

const nav = [{href:'/admin',label:'Overview',icon:LayoutDashboard},{href:'/admin/cases',label:'Cases',icon:BriefcaseBusiness},{href:'/admin/participants',label:'Participants',icon:Users},{href:'/admin/areas',label:'Practice Areas',icon:Shapes}];
export function AdminShell({children,title,eyebrow}:{children:React.ReactNode;title:string;eyebrow?:string}) {
 const path=usePathname(); const {user,authorized}=useAdminAuth();
 if(!authorized) return null;
 return <div className="min-h-screen bg-[#080b12] text-slate-100"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0c1019] p-5 lg:block">
  <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 pb-6 font-semibold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600"><Scale size={20}/></span>BEAM Law Admin</Link>
  <nav className="mt-6 grid gap-2">{nav.map(({href,label,icon:Icon})=><Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${path===href||href!='/admin'&&path.startsWith(href)?'bg-blue-600 text-white':'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={18}/>{label}</Link>)}</nav>
  <div className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-5"><p className="truncate text-xs text-slate-500">{user?.email}</p><button onClick={logOut} className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white"><LogOut size={16}/> Sign out</button></div>
 </aside><main className="lg:pl-64"><header className="border-b border-white/10 px-6 py-7 lg:px-10"><p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-400">{eyebrow||'Law & Justice League'}</p><h1 className="mt-2 text-3xl font-semibold">{title}</h1><div className="mt-5 flex gap-2 overflow-x-auto lg:hidden">{nav.map(n=><Link className="rounded-lg bg-white/5 px-3 py-2 text-sm" key={n.href} href={n.href}>{n.label}</Link>)}</div></header><div className="p-6 lg:p-10">{children}</div></main></div>;
}

