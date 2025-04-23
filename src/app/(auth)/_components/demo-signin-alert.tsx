import { LockKeyholeOpen } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DemoSigninAlert = () => {
	if (process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNT_ALERT !== "true") return null;

	const demoEmail = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL || "demo.user@example.com";
	const demoPassword = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_PASSWORD || "demopass123";

	return (
		<Alert variant="info" border className="mb-4">
			<LockKeyholeOpen />
			<AlertTitle>Instant Access — Try the Demo Account</AlertTitle>
			<AlertDescription>
				<strong>Email:</strong> <code>{demoEmail}</code> <br />
				<strong>Password:</strong> <code>{demoPassword}</code>
				<p className="mt-2 text-xs italic">No signup required — explore all features in seconds.</p>
			</AlertDescription>
		</Alert>
	);
};

export default DemoSigninAlert;
