'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	BookMarked,
	Building2,
	House,
	Search,
	UserRound,
} from 'lucide-react';

const items = [
	{ href: '/home', label: 'Home', icon: House },
	{ href: '/resources', label: 'Resources', icon: BookMarked },
	{ href: '/search', label: 'Search', icon: Search },
	{ href: '/campus', label: 'Campus', icon: Building2 },
	{ href: '/profile', label: 'Profile', icon: UserRound },
];

export default function Taskbar() {
	const pathname = usePathname();
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4">
			<nav className="pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full border border-white/10 bg-slate-950/80 p-2 shadow-[0_24px_70px_-34px_rgba(45,212,191,0.55)] backdrop-blur-xl">
				{items.map((item) => {
					const active = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex min-w-[4.6rem] flex-col items-center gap-1 rounded-full px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] transition ${
								active
									? 'bg-teal-300/15 text-teal-200'
									: 'text-slate-400 hover:bg-white/5 hover:text-white'
							}`}
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
