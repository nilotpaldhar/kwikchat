"use client";

import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SignupSchema } from "@/schemas";

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
import Checkbox from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

const SigupForm = () => {
	const [pending, setPending] = useState(false);

	const form = useForm<z.infer<typeof SignupSchema>>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			fullName: "",
			username: "",
			email: "",
			password: "",
			tos: false,
		},
	});

	const onSubmit = (values: z.infer<typeof SignupSchema>) => {
		// eslint-disable-next-line no-console
		console.log({ values });
		setPending(true);
		setTimeout(() => setPending(false), 5000);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<div className="flex flex-col space-y-5">
					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="James Brown" disabled={pending} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input type="text" placeholder="james_brown" disabled={pending} {...field} />
								</FormControl>
								<FormMessage />
								<FormDescription>Please only use numbers, letters or underscores _</FormDescription>
							</FormItem>
						)}
					/>
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
								<FormDescription>
									Must contain 1 uppercase letter, 1 number, min 8 characters
								</FormDescription>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tos"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-2 space-y-0">
								<FormControl className="mt-0.5">
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="flex items-center flex-wrap gap-1">
										<span>I agree to KwikChat&apos;s</span>
										<Button variant="link" className="p-0 h-max" asChild>
											<Link href="/terms-of-service">TOS</Link>
										</Button>
										<span>and</span>
										<Button variant="link" className="p-0 h-max" asChild>
											<Link href="/privacy-policy">Privacy Policy</Link>
										</Button>
									</FormLabel>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full space-x-2" disabled={pending}>
						{pending && <Loader2 size={18} className="animate-spin" />}
						<span>{pending ? "Sign Up..." : "Sign Up"}</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SigupForm;
