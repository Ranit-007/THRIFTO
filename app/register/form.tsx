"use client";

import { useActionState, useEffect } from "react";
import { register } from "@/lib/actions/auth.actions";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(register, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state, router]);

  return (
    <form className="auth-form" action={formAction}>
      {state?.error && (
        <div className="auth-form__error" style={{ marginBottom: "1rem", fontSize: "0.9rem" }} role="alert">
          {state.error}
        </div>
      )}

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="auth-form__input"
          aria-invalid={!!state?.validationErrors?.name}
          required
        />
        {state?.validationErrors?.name && (
          <p className="auth-form__error">{state.validationErrors.name[0]}</p>
        )}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          className="auth-form__input"
          aria-invalid={!!state?.validationErrors?.email}
          required
        />
        {state?.validationErrors?.email && (
          <p className="auth-form__error">{state.validationErrors.email[0]}</p>
        )}
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="auth-form__input"
          aria-invalid={!!state?.validationErrors?.password}
          required
        />
        {state?.validationErrors?.password && (
          <p className="auth-form__error">{state.validationErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="button button--dark auth-form__submit"
        disabled={isPending || state?.success}
      >
        <span>{isPending ? "Creating account..." : state?.success ? "Success" : "Create account"}</span>
        {isPending ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
      </button>

      <div className="auth-form__footer">
        Already have an account? <Link href="/login" className="auth-form__link">Sign in</Link>
      </div>
    </form>
  );
}