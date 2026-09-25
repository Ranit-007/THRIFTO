import { ForgotPasswordForm } from "./form";

export const metadata = {
  title: "Reset Password — Nocturne Studio",
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Reset password</h1>
          <p className="auth-card__description">We&apos;ll send you a link to reset your password.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}