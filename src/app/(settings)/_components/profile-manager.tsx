"use client";

import type { UserProfile } from "@/types";

import { useEffect, useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useProfileStore from "@/store/use-profile-store";

import { userKeys } from "@/constants/tanstack-query";
import updateProfile from "@/actions/user/update-profile";

import { XOctagon } from "lucide-react";

import { Divider } from "@/components/ui/divider";
import { Alert, AlertTitle } from "@/components/ui/alert";
import ProfilePreview from "@/app/(settings)/_components/profile-preview";
import ProfileSaveAlert from "@/app/(settings)/_components/profile-save-alert";
import ProfileInfoEditor from "@/app/(settings)/_components/profile-info-editor";

interface ProfileManagerProps {
	user: UserProfile;
}

const ProfileManager = ({ user }: ProfileManagerProps) => {
	const queryClient = useQueryClient();

	// State management for profile data and error handling
	const { data, init, reset, saveProfile } = useProfileStore();
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();

	// Refs to manage DOM elements for dynamic width adjustment
	const parentRef = useRef<HTMLDivElement>(null);
	const fixedDivRef = useRef<HTMLDivElement>(null);

	// Function to handle profile saving
	const handleSave = () => {
		if (!data) return;

		setError("");

		startTransition(() => {
			updateProfile({
				displayName: data.displayName ?? "Unknown",
				bio: data.bio,
				avatar: data.avatar,
				bannerColor: data.banner_color,
			}).then((response) => {
				setError(response?.error);
				saveProfile();
				queryClient.invalidateQueries({ queryKey: userKeys.current });
			});
		});
	};

	// Effect to initialize and clean up profile data
	useEffect(() => {
		if (user) init(user);
		return () => reset(false);
	}, [user, init, reset]);

	// Effect to adjust the width of fixedDivRef based on parentRef's width
	useEffect(() => {
		const setFixedDivWidth = () => {
			if (parentRef.current && fixedDivRef.current) {
				const parentWidth = parentRef.current.offsetWidth;
				fixedDivRef.current.style.width = `${parentWidth}px`;
			}
		};

		// Initial setting of the width
		setFixedDivWidth();

		// Recalculate the width on window resize
		window.addEventListener("resize", setFixedDivWidth);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("resize", setFixedDivWidth);
		};
	}, []);

	return (
		<div ref={parentRef}>
			{error && (
				<Alert variant="danger" className="mb-6">
					<XOctagon />
					<AlertTitle>{error}</AlertTitle>
				</Alert>
			)}
			<div className="flex flex-col gap-y-8 sm:flex-row sm:gap-x-5 sm:space-y-0">
				<div className="sm:order-2 sm:flex-1">
					<ProfilePreview />
				</div>
				<Divider type="solid" className="sm:hidden" />
				<div className="shrink-0 sm:flex-1">
					<ProfileInfoEditor loading={pending} />
				</div>
			</div>
			<div ref={fixedDivRef} className="fixed top-1 z-20 sm:bottom-4 sm:top-auto">
				<ProfileSaveAlert onReset={() => reset(true)} onSave={handleSave} loading={pending} />
			</div>
		</div>
	);
};

export default ProfileManager;
