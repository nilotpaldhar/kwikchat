"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetSchema } from "@/schemas";

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

const ResetForm = () => {
	const [pending, setPending] = useState(false);

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
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
								<FormDescription>Enter the email with which you’ve registered</FormDescription>
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

export default ResetForm;
