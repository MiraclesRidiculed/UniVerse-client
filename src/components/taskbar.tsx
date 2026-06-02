'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	BookMarked,
	Building2,
	House,
	LogOut,
	Search,
	UserRound,
} from 'lucide-react';
import { useAuth } from './auth-provider';

const items = [
	{ href: '/home', label: 'Home', icon: House },
	{ href: '/resources', label: 'Resources', icon: BookMarked },
	{ href: '/search', label: 'Search', icon: Search },
	{ href: '/campus', label: 'Campus', icon: Building2 },
	{ href: '/profile', label: 'Profile', icon: UserRound },
];

export default function Taskbar() {
	const pathname = usePathname();
	const { student, logout } = useAuth();

	if (pathname === '/') return null;

	return (
		<header className="fixed inset-x-0 top-0 z-20 border-b border-slate-800 bg-slate-950/95">
			<nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link href="/home" className="mr-2 min-w-0">
					<p className="text-base font-semibold text-white">UniVerse</p>
					<p className="hidden text-xs text-slate-400 sm:block">
						{student ? student.name : 'Student platform'}
					</p>
				</Link>
				<div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
					{items.map((item) => {
						const active = pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
									active
										? 'bg-slate-800 text-white'
										: 'text-slate-300 hover:bg-slate-900 hover:text-white'
								}`}
							>
								<Icon className="h-4 w-4 shrink-0" />
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>
				{student ? (
					<button
						type="button"
						onClick={logout}
						className="hidden items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white sm:flex"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</button>
				) : null}
			</nav>
		</header>
	);
}
