"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/lib/actions/auth.actions";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  if (state?.message) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "rgb(var(--color-ink))", marginBottom: "2rem", lineHeight: 1.6 }}>{state.message}</p>
        <Link href="/login" className="button button--dark" style={{ width: "100%", justifyContent: "center" }}>
          Return to login <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" action={formAction}>
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
          required
        />
      </div>

      <button
        type="submit"
        className="button button--dark auth-form__submit"
        disabled={isPending}
      >
        <span>{isPending ? "Sending..." : "Send link"}</span>
        {isPending ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
      </button>

      <div className="auth-form__footer">
        Remembered your password? <Link href="/login" className="auth-form__link">Sign in</Link>
      </div>
    </form>
  );
}