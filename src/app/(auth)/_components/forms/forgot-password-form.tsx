"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ForgotPasswordSchema } from "@/schemas";

import forgotPassword from "@/actions/auth/forgot-password";

import { Loader2, CheckCircle, XOctagon } from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

const ForgotPasswordForm = () => {
	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			forgotPassword(values).then((data) => {
				setError(data?.error);

				if (data?.success) {
					setSuccess(data.success);
					form.reset();
				}
			});
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<div className="flex flex-col space-y-4">
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
										disabled={pending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
								<FormDescription>Enter the email with which you&apos;ve registered</FormDescription>
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full space-x-2" disabled={pending}>
						{pending && <Loader2 size={18} className="animate-spin" />}
						<span>{pending ? "Reset Password..." : "Reset Password"}</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ForgotPasswordForm;
