"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";

import resetPassword from "@/actions/auth/reset-password";

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

const ResetPasswordForm = ({ token, email }: { token: string; email: string }) => {
	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			resetPassword({ values, token, email }).then((data) => {
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="########" disabled={pending} {...field} />
								</FormControl>
								<FormMessage />
								<FormDescription>
									Must contain 1 uppercase letter, 1 number, min 8 characters
								</FormDescription>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="########" disabled={pending} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-row items-center space-x-4">
						<Button type="submit" className="w-full space-x-2" disabled={pending}>
							{pending && <Loader2 size={18} className="animate-spin" />}
							<span>{pending ? "Saving..." : "Save"}</span>
						</Button>
						<Button className="w-full" variant="outline" asChild>
							<Link href="/sign-in">Cancel</Link>
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default ResetPasswordForm;
