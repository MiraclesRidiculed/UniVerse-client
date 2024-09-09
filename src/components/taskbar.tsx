"use client";

import { FaUser, FaRegBookmark, FaSearch, FaHome } from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

export default function Taskbar() {
	const pathname = usePathname(); 
	return (
		<div className="flex justify-around p-4 fixed bottom-0 w-full z-10">
			<Link
				href={'/home'}
				className={`text-2xl p-3 transition-transform transform hover:scale-125 ${
					pathname === '/home' ? 'text-green-400' : 'text-blue-400'
				}`}
			>
				<FaHome />
			</Link>
			<Link
				href={'/resources'}
				className={`text-2xl p-3 transition-transform transform hover:scale-125 ${
					pathname === '/resources' ? 'text-green-400' : 'text-blue-400'
				}`}
			>
				<FaRegBookmark />
			</Link>
			<Link
				href={'/search'}
				className={`text-2xl p-3 transition-transform transform hover:scale-125 ${
					pathname === '/search' ? 'text-green-400' : 'text-blue-400'
				}`}
			>
				<FaSearch />
			</Link>
			<Link
				href={'/campus'}
				className={`text-2xl p-3 transition-transform transform hover:scale-125 ${
					pathname === '/campus' ? 'text-green-400' : 'text-blue-400'
				}`}
			>
				<FaBuildingColumns />
			</Link>
			<Link
				href={'/profile'}
				className={`text-2xl p-3 transition-transform transform hover:scale-125 ${
					pathname === '/profile' ? 'text-green-400' : 'text-blue-400'
				}`}
			>
				<FaUser />
			</Link>
		</div>
	);
}
