"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

import Loader from "@/components/ui/loader";

interface InfiniteScrollProps {
	children: React.ReactNode;
	loading?: boolean;
	next: () => void;
	className?: string;
}

const InfiniteScroll = ({ children, loading = false, next, className }: InfiniteScrollProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: "all" });

	useEffect(() => {
		if (inView) next();
	}, [inView, next]);

	return (
		<>
			<div className={className}>{children}</div>
			<div ref={ref}>{loading && <Loader />}</div>
		</>
	);
};

export default InfiniteScroll;
