"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SigninSchema } from "@/schemas";

import signin from "@/actions/auth/signin";
import resend2FAToken from "@/actions/auth/resend-2FA-token";
import { SIGNIN_MESSAGE as MESSAGE } from "@/constants/auth";

import Link from "next/link";
import { Loader2, CheckCircle, XOctagon } from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

interface SiginFormProps {
	on2FAConfirmation?: ({ email, showOtp }: { email: string; showOtp: boolean }) => void;
}

const SiginForm = ({ on2FAConfirmation }: SiginFormProps) => {
	const searchParams = useSearchParams();

	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [showOtp, setShowOtp] = useState(false);

	const [oAuthError, setOAuthError] = useState(
		searchParams.get("error") === "OAuthAccountNotLinked"
	);
	const [signinPending, startSigninTransition] = useTransition();
	const [resendPending, startResendTransition] = useTransition();

	const form = useForm<z.infer<typeof SigninSchema>>({
		resolver: zodResolver(SigninSchema),
		defaultValues: {
			email: "",
			password: "",
			otp: "",
		},
	});

	const onSubmit = (values: z.infer<typeof SigninSchema>) => {
		setError("");
		setSuccess("");
		setOAuthError(false);

		startSigninTransition(() => {
			signin(values).then((data) => {
				setError(data?.error);

				if (data?.success && !data?.twoFactor) {
					setSuccess(data.success);
				}

				if (data?.twoFactor) {
					setShowOtp(true);
					if (on2FAConfirmation) {
						on2FAConfirmation({ email: values.email, showOtp: true });
					}
				}
			});
		});
	};

	const onResend = () => {
		setError("");
		setSuccess("");

		const userEmail = form.getValues("email");

		startResendTransition(() => {
			resend2FAToken(userEmail).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<div className="flex flex-col space-y-4">
						{oAuthError && (
							<Alert variant="danger">
								<XOctagon />
								<AlertTitle>{MESSAGE.error.OAuthAccountNotLinked}</AlertTitle>
							</Alert>
						)}
						{error && (
							<Alert variant="danger">
								<XOctagon />
								<AlertTitle>{error}</AlertTitle>
							</Alert>
						)}
						{success && (
							<Alert variant="success">
								<CheckCircle />
								<AlertTitle>{success}</AlertTitle>
							</Alert>
						)}

						{!showOtp ? (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="hello@example.com"
													disabled={signinPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="########"
													disabled={signinPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex justify-end items-center text-right">
									<Button
										className="p-0 h-max text-neutral-500 hover:text-primary-400 dark:text-neutral-300 dark:hover:text-primary-400"
										variant="link"
										asChild
									>
										<Link href="/forgot-password">Forgot Password?</Link>
									</Button>
								</div>
							</>
						) : (
							<FormField
								control={form.control}
								name="otp"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputOTP maxLength={4} {...field} disabled={signinPending || resendPending}>
												<InputOTPSlot
													index={0}
													className="flex-1 w-full h-16 text-2xl font-semibold"
												/>
												<InputOTPSlot
													index={1}
													className="flex-1 w-full h-16 text-2xl font-semibold"
												/>
												<InputOTPSlot
													index={2}
													className="flex-1 w-full h-16 text-2xl font-semibold"
												/>
												<InputOTPSlot
													index={3}
													className="flex-1 w-full h-16 text-2xl font-semibold"
												/>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<Button
							type="submit"
							className="w-full space-x-2"
							disabled={
								signinPending ||
								resendPending ||
								(showOtp && (form.getValues("otp") ?? "")?.length < 4)
							}
						>
							{signinPending && <Loader2 size={18} className="animate-spin" />}
							<span>
								{signinPending && showOtp && "Verifying..."}
								{!signinPending && showOtp && "Verify"}
								{signinPending && !showOtp && "Sign In..."}
								{!signinPending && !showOtp && "Sign In"}
							</span>
						</Button>
					</div>
				</form>
			</Form>
			{showOtp && (
				<div className="flex justify-center">
					<div className="flex flex-col space-y-4">
						<span className="text-muted font-medium text-center">
							Experiencing issues receiving the code?
						</span>
						<Button
							variant="link"
							className="p-0 h-max leading-none"
							onClick={onResend}
							disabled={signinPending || resendPending}
						>
							Resend Code
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default SiginForm;
