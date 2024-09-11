"use client";

import React, { useRef, useEffect } from "react";

const ProfileBio = ({ bio = "" }: { bio?: string }) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		if (textareaRef.current) {
			const textarea = textareaRef.current;
			textarea.style.height = "auto"; // Reset the height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scrollHeight
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [bio]);

	return (
		<textarea
			rows={1}
			ref={textareaRef}
			value={bio}
			disabled
			onChange={() => adjustHeight()}
			className="w-full resize-none overflow-hidden border-none bg-transparent"
		/>
	);
};

export default ProfileBio;
