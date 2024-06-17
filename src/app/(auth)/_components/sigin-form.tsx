"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SigninSchema } from "@/schemas";

import signin from "@/actions/auth/signin";

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

const SiginForm = () => {
	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SigninSchema>>({
		resolver: zodResolver(SigninSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof SigninSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			signin(values).then((data) => {
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
									<Input type="password" placeholder="########" disabled={pending} {...field} />
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
							<Link href="/reset">Forgot Password?</Link>
						</Button>
					</div>
					<Button type="submit" className="w-full space-x-2" disabled={pending}>
						{pending && <Loader2 size={18} className="animate-spin" />}
						<span>{pending ? "Sign In..." : "Sign In"}</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SiginForm;
