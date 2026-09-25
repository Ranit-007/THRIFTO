"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth.actions";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("callbackUrl") || "/account";

  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form className="auth-form" action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state?.error && (
        <div className="auth-form__error" style={{ marginBottom: "1rem", fontSize: "0.9rem" }} role="alert">
          {state.error}
        </div>
      )}

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          className="auth-form__input"
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="auth-form__group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <label className="auth-form__label" htmlFor="password">Password</label>
          <Link href="/forgot-password" style={{ fontSize: "0.75rem", color: "rgb(var(--color-ash))", textDecoration: "underline" }}>
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          className="auth-form__input"
          required
        />
      </div>

      <button
        type="submit"
        className="button button--dark auth-form__submit"
        disabled={isPending}
      >
        <span>{isPending ? "Signing in..." : "Sign in"}</span>
        {isPending ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
      </button>

      <div className="auth-form__footer">
        Don&apos;t have an account? <Link href="/register" className="auth-form__link">Create one</Link>
      </div>
    </form>
  );
}