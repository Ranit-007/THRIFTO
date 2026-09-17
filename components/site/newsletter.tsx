"use client";

import { ArrowUpRight } from "lucide-react";
import { LoaderCircle, Check } from "lucide-react";
import { type FormEvent, useState } from "react";
import { store } from "@/config/store";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!email) {
      setStatus("error");
      setMessage("Enter your email address to continue.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Use a valid email address.");
      return;
    }

    setStatus("loading");
    window.setTimeout(() => {
      setStatus("error");
      setMessage("Newsletter delivery is not connected in this demo, so your address has not been saved.");
    }, 500);
  }

  return (
    <section className="newsletter" id="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter__glow" aria-hidden="true" />
      <div className="newsletter__content page-shell">
        <p className="eyebrow">06 / STAY IN THE LOOP</p>
        <h2 id="newsletter-title">{store.newsletter.title}</h2>
        <p className="newsletter__description">{store.newsletter.description}</p>
        <form className="newsletter__form" noValidate onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="YOUR EMAIL ADDRESS"
            aria-invalid={status === "error"}
            aria-describedby="newsletter-notice"
            onChange={() => {
              if (status !== "idle") setStatus("idle");
              if (message) setMessage("");
            }}
          />
          <button type="submit" aria-label="Subscribe to newsletter" disabled={status === "loading"}>
            <span>{status === "loading" ? "Checking" : "Enter"}</span>
            {status === "loading" ? <LoaderCircle className="newsletter__spinner" aria-hidden="true" size={17} /> : status === "success" ? <Check aria-hidden="true" size={18} /> : <ArrowUpRight aria-hidden="true" size={18} />}
          </button>
        </form>
        <p id="newsletter-notice" className={`newsletter__notice newsletter__notice--${status}`} aria-live="polite">{message || store.newsletter.disclaimer}</p>
      </div>
    </section>
  );
}
