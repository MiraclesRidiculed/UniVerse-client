'use client';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { get, patch } from '@/lib/RestHandler';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';

interface Handles {
	instagram: string;
	github: string;
	facebook: string;
	linkedin: string;
}

interface Student {
	picture: string;
	id: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	handles: Handles;
}

const platforms: Array<keyof Handles> = ['github', 'linkedin', 'instagram', 'facebook'];

const ProfilePage: React.FC = () => {
	const { user, isLoading } = useUser();

	if (isLoading) return;
	if (!user) redirect('/api/auth/login');
	const [student, setstudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedHandles, setUpdatedHandles] = useState<Handles | null>(null);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const data: Student = await get('/client/students/nigga123');
				setstudent(data);
				setUpdatedHandles(data.handles);
			} catch (error: any) {
				setError(error.message || 'Failed to fetch student data');
			} finally {
				setLoading(false);
			}
		};

		fetchStudentData();
	}, []);

	const handleEditToggle = () => {
		setEditMode(!editMode);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUpdatedHandles(prev => prev ? { ...prev, [name]: value } : null);
	};

	const saveLinks = async () => {
		if (updatedHandles && student) {
			try {
				await patch(`/client/students/${student.id}`, updatedHandles, {
					json: false
				});
				console.log('Done');
				setstudent({ ...student, handles: updatedHandles });
			} catch (error: any) {
				setError(error.message || 'Failed to save links');
			}
		}

		setEditMode(false);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gray-900 shadow-md rounded-lg p-6">
				<div className="flex items-center space-x-4">
					<Avatar className="w-24 h-24">
						{student?.picture ? (
							<AvatarImage src={student.picture} alt={student.name} />
						) : (
							<AvatarFallback className="bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
								{student?.name ? student.name[0] : 'N/A'}
							</AvatarFallback>
						)}
					</Avatar>

					<div>
						<h1 className="text-3xl font-semibold mb-3">{student?.name || 'student Name'}</h1>
						<p className="text-blue-200">{student?.email || 'student@example.com'}</p>
						<p className="text-blue-200">Department: {student?.department || 'N/A'}</p>
						<p className="text-blue-200">Batch: {student?.batch || 'N/A'}</p>
					</div>
				</div>
			</div>

			<div className="bg-gray-900 shadow-md rounded-lg p-6 mt-5">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold">Connections</h2>
					<button onClick={handleEditToggle} className="text-sm text-blue-200">
						{editMode ? 'Cancel' : 'Edit'}
					</button>
				</div>
				{editMode ? (
					<div className="mt-4 space-y-4">
						{platforms.map((platform) => (
							<div key={platform} className="flex items-center space-x-2">
								<label className="text-white capitalize">{platform}</label>
								<input
									type="text"
									name={platform}
									value={updatedHandles?.[platform] || ''}
									onChange={handleInputChange}
									className="w-full bg-gray-200 rounded px-3 py-1 text-gray-900"
								/>
							</div>
						))}
						<button onClick={saveLinks} className="bg-blue-500 text-white py-1 px-4 rounded">
							Save
						</button>
					</div>
				) : (
					<div className="mt-4 flex-col space-y-4">
						{student?.handles.github && (
							<Link
								href={student.handles.github}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-blue-300"
							>
								<FaGithub className="w-6 h-6" />
								<h3>GitHub</h3>
							</Link>
						)}
						{student?.handles.linkedin && (
							<Link
								href={student.handles.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-blue-500"
							>
								<FaLinkedin className="w-6 h-6" />
								<h3>LinkedIn</h3>
							</Link>
						)}
						{student?.handles.instagram && (
							<Link
								href={student.handles.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-pink-500"
							>
								<FaInstagram className="w-6 h-6" />
								<h3>Instagram</h3>
							</Link>
						)}
						{student?.handles.facebook && (
							<Link
								href={student.handles.facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-blue-600"
							>
								<FaFacebook className="w-6 h-6" />
								<h3>Facebook</h3>
							</Link>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
