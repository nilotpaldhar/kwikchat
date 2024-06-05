/* eslint-disable import/prefer-default-export */

import * as z from "zod";

export const LoginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(1, { message: "Please enter a valid password" }),
});
