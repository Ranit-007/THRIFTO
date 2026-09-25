import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Reset Password — Nocturne Studio",
};

export default function ResetPasswordPage() {
  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Reset link invalid</h1>
          <p className="auth-card__description">Email delivery is not configured, so this page is unreachable via valid tokens.</p>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/login" className="button button--dark" style={{ width: "100%", justifyContent: "center" }}>
            Return to login <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}