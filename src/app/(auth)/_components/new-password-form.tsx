"use client";

import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";

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

import { Loader2 } from "lucide-react";

const NewPasswordForm = () => {
	const [pending, setPending] = useState(false);

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		// eslint-disable-next-line no-console
		console.log({ values });
		setPending(true);
		setTimeout(() => setPending(false), 5000);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<div className="flex flex-col space-y-4">
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

export default NewPasswordForm;
