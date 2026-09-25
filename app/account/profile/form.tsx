"use client";

import { useActionState, useEffect } from "react";
import { updateProfile } from "@/lib/actions/account.actions";
import { ArrowUpRight, LoaderCircle, Check } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export function ProfileForm({ initialName }: { initialName: string }) {
  const { toast: addToast } = useToast();
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success) {
      addToast({ type: "success", title: "Profile updated" });
    } else if (state?.error) {
      addToast({ type: "error", title: "Update failed", description: state.error });
    }
  }, [state, addToast]);

  return (
    <form className="auth-form" action={formAction}>
      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="auth-form__input"
          defaultValue={initialName}
          aria-invalid={!!state?.validationErrors?.name}
          required
        />
        {state?.validationErrors?.name && (
          <p className="auth-form__error">{state.validationErrors.name[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="button button--dark auth-form__submit"
        style={{ width: "auto", alignSelf: "flex-start" }}
        disabled={isPending}
      >
        <span>{isPending ? "Saving..." : "Save changes"}</span>
        {isPending ? <LoaderCircle size={16} className="animate-spin" /> : state?.success ? <Check size={16} /> : <ArrowUpRight size={16} />}
      </button>
    </form>
  );
}