import { RegisterForm } from "./form";

export const metadata = {
  title: "Create Account — Nocturne Studio",
};

export default function RegisterPage() {
  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__description">Join Nocturne Studio for exclusive access.</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}