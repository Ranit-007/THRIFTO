import { LoginForm } from "./form";

export const metadata = {
  title: "Login — Nocturne Studio",
};

export default function LoginPage() {
  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__description">Enter your details to access your account.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}