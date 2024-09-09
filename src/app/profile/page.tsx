'use client';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface Handles {
	instagram: string;
	github: string;
	facebook: string;
	linkedin: string;
}

interface User {
	picture: string;
	id: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	handles: Handles;
}

const ProfilePage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch(
					'http://13.201.122.170:7000/client/students/nigga123',
				);
				if (!res.ok) {
					return console.error(res.text);
					// Redirect to loading page later
				}

				const data: User = await res.json();
				setUser(data);
				console.log(data);
			} catch (error: any) {
				setError(error.message || 'Failed to fetch user data');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gray-900 shadow-md rounded-lg p-6">
				<div className="flex items-center space-x-4">
					<Avatar className="w-24 h-24">
						{user?.picture ?
							<AvatarImage src={user.picture} alt={user.name} />
						:	<AvatarFallback className="bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
								{user?.name ? user.name[0] : 'N/A'}
							</AvatarFallback>
						}
					</Avatar>

					<div >
						<h1 className="text-3xl font-semibold mb-3">
							{user?.name || 'User Name'}
						</h1>
						<p className="text-blue-200">
							{user?.email || 'user@example.com'}
						</p>
						<p className="text-blue-200">
							Department: {user?.department || 'N/A'}
						</p>
						<p className="text-blue-200">
							Batch: {user?.batch || 'N/A'}
						</p>
					</div>
				</div>
			</div>
			<div className="bg-gray-900 shadow-md rounded-lg p-6 mt-5">
				<h2 className="text-2xl font-semibold text">Connections</h2>
				<div className="mt-4 flex-col space-y-4">
					<Link
						href={
							user?.handles.github || 'https://github.com/example'
						}
						target="_blank"
						rel="noopener noreferrer"
						className={'max-w-fit flex space-x-2 text-pink-500' + (user?.handles.github ? '' : 'hidden')}
					>
						<FaGithub className="w-6 h-6" />
						<h3>GitHub</h3>
					</Link>
					<Link
						href={
							user?.handles.linkedin ||
							'https://linkedin.com/in/example'
						}
						target="_blank"
						rel="noopener noreferrer"
						className={'max-w-fit flex space-x-2 text-pink-500' + (user?.handles.linkedin ? '' : 'hidden')}
					>
						<FaLinkedin className="w-6 h-6" />
						<h3>LinkedIn</h3>
					</Link>
					<Link
						href={
							user?.handles.instagram ||
							'https://instagram.com/example'
						}
						target="_blank"
						rel="noopener noreferrer"
						className={'max-w-fit flex space-x-2 text-pink-500' + (user?.handles.instagram ? '' : 'hidden')}
					>
						<FaInstagram className="w-6 h-6" />
						<h3>Instagram</h3>
					</Link>
					<Link
						href={
							user?.handles.facebook ||
							'https://facebook.com/example'
						}
						target="_blank"
						rel="noopener noreferrer"
						className={'max-w-fit flex space-x-2 text-pink-500' + (user?.handles.facebook ? '' : 'hidden')}
					>
						<FaFacebook className="w-6 h-6" />
						<h3>Facebook</h3>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
