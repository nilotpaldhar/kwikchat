import Link from "next/link";

import { TokenVerificationStatus } from "@/types";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";

import { CheckCircle, Info, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerificationFeedback from "@/app/(auth)/_components/verification-feedback";

interface VerificationPageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

/** Validating the verification token */
const validateToken = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);
	if (!existingToken) {
		return {
			data: {},
			status: TokenVerificationStatus.InvalidToken,
		};
	}

	const hasExpired = new Date(existingToken.expires) < new Date();
	if (hasExpired) {
		return {
			data: {},
			status: TokenVerificationStatus.TokenExpired,
		};
	}

	const existingUser = await getUserByEmail(existingToken.email);
	if (!existingUser) {
		return {
			data: {},
			status: TokenVerificationStatus.InvalidTokenEmail,
		};
	}

	try {
		await prisma.user.update({
			where: { id: existingUser.id },
			data: {
				emailVerified: new Date(),
				email: existingToken.email,
			},
		});

		await prisma.verificationToken.delete({
			where: { id: existingToken.id },
		});

		return {
			data: { email: existingUser.email },
			status: TokenVerificationStatus.Default,
		};
	} catch (error) {
		return {
			data: null,
			status: TokenVerificationStatus.VerificationFailed,
		};
	}
};

const VerificationFeedbackInvalid = () => (
	<div className="flex items-center h-full">
		<VerificationFeedback icon={XOctagon} heading="Email Verification Failed">
			<p>
				It seems that the email verification link is invalid. Don&apos;t worry! Simply request a new
				link by signing in again.
			</p>
			<Button className="w-full" asChild>
				<Link href="/sign-in">Try Agian!</Link>
			</Button>
		</VerificationFeedback>
	</div>
);

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
	const token = searchParams?.token;

	/** Token doesn't exist */
	if (!token || Array.isArray(token)) {
		return <VerificationFeedbackInvalid />;
	}

	const { data, status } = await validateToken(token);

	/** Token verified */
	if (status === TokenVerificationStatus.Default && data?.email) {
		return (
			<div className="flex items-center h-full">
				<VerificationFeedback icon={CheckCircle} heading="Email Verified">
					<p>
						Congratulations! Your email address <strong>{data.email}</strong>, has been successfully
						verified.
					</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Sign In Now</Link>
					</Button>
				</VerificationFeedback>
			</div>
		);
	}

	/** Token expired */
	if (status === TokenVerificationStatus.TokenExpired) {
		return (
			<div className="flex items-center h-full">
				<VerificationFeedback icon={Info} heading="Verification Link Expired">
					<p>
						It seems that the email verification link has expired. No worries! Simply request a new
						link by signing in again.
					</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Try Agian!</Link>
					</Button>
				</VerificationFeedback>
			</div>
		);
	}

	return <VerificationFeedbackInvalid />;
};

export default VerificationPage;
