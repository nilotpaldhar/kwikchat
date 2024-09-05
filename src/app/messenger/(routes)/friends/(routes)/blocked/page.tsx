"use client";

import { useState } from "react";

import SearchBar from "@/components/search-bar";
import BlockedUserDirectory from "@/app/messenger/(routes)/friends/_components/blocked-user-directory";

const FriendsBlockedPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex flex-col space-y-8">
			<div>
				<SearchBar placeholder="Search" onSearch={(searchTerm) => setSearchQuery(searchTerm)} />
			</div>
			<BlockedUserDirectory searchQuery={searchQuery} />
		</div>
	);
};

export default FriendsBlockedPage;
