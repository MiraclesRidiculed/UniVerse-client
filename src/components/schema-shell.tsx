import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ActionLink {
	href: string;
	label: string;
}

interface PageShellProps {
	eyebrow: string;
	title: string;
	description: string;
	actions?: ActionLink[];
	children: ReactNode;
}

interface StatCardProps {
	label: string;
	value: string;
	hint: string;
}

interface SectionPanelProps {
	kicker: string;
	title: string;
	description?: string;
	children: ReactNode;
}

export function PageShell({
	eyebrow,
	title,
	description,
	actions = [],
	children,
}: PageShellProps) {
	return (
		<main className="mx-auto min-h-screen max-w-6xl px-4 pb-32 pt-6 sm:px-6 lg:px-8">
			<section className="surface-panel relative overflow-hidden p-6 sm:p-8">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_28%)]" />
				<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl space-y-4">
						<p className="surface-eyebrow">{eyebrow}</p>
						<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
							{title}
						</h1>
						<p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
							{description}
						</p>
					</div>
					{actions.length > 0 ? (
						<div className="flex flex-wrap gap-3">
							{actions.map((action) => (
								<Link
									key={action.href}
									href={action.href}
									className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-teal-300/40 hover:bg-teal-300/10"
								>
									{action.label}
									<ArrowRight className="h-4 w-4" />
								</Link>
							))}
						</div>
					) : null}
				</div>
			</section>
			<div className="mt-8 space-y-8">{children}</div>
		</main>
	);
}

export function StatCard({ label, value, hint }: StatCardProps) {
	return (
		<div className="surface-panel p-5">
			<p className="surface-eyebrow">{label}</p>
			<p className="mt-4 text-3xl font-semibold text-white">{value}</p>
			<p className="mt-2 text-sm leading-6 text-slate-300">{hint}</p>
		</div>
	);
}

export function SectionPanel({
	kicker,
	title,
	description,
	children,
}: SectionPanelProps) {
	return (
		<section className="surface-panel p-5 sm:p-6">
			<div className="mb-6 space-y-2">
				<p className="surface-eyebrow">{kicker}</p>
				<h2 className="text-2xl font-semibold text-white">{title}</h2>
				{description ? (
					<p className="max-w-3xl text-sm leading-6 text-slate-300">
						{description}
					</p>
				) : null}
			</div>
			{children}
		</section>
	);
}

export function SchemaChip({ children }: { children: ReactNode }) {
	return <span className="surface-chip">{children}</span>;
}
