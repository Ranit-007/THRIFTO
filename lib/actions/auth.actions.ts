"use server";

import { z } from "zod";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function register(prevState: unknown, formData: FormData) {
  try {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        error: "Invalid fields. Please check your inputs.",
        validationErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function login(prevState: unknown, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirectTo") as string) || "/account";

    if (!email || !password) {
      return { error: "Please enter both email and password." };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Let Next.js handle redirect error
  }
}

export async function forgotPassword(prevState: unknown, formData: FormData) {
  const email = formData.get("email");
  if (!email) {
    return { error: "Email is required." };
  }

  return {
    message: "If an account exists with this email, you will receive a password reset link. (Note: Email delivery is currently unconfigured in this environment)."
  };
}