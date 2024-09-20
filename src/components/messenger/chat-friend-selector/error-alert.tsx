"use client";

import { XOctagon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
	children?: React.ReactNode;
	retryText?: string;
	closable?: boolean;
	onClick?: () => void;
}

const ErrorAlert = ({
	children,
	retryText = "Retry",
	closable = false,
	onClick,
}: ErrorAlertProps) => (
	<Alert variant="danger" closable={closable}>
		<XOctagon />
		<AlertTitle>
			<span>{children}</span>
			<Button
				variant="link"
				onClick={onClick}
				className="ml-1 h-auto p-0 font-semibold text-red-600 underline"
			>
				{retryText}
			</Button>
		</AlertTitle>
	</Alert>
);

export default ErrorAlert;
