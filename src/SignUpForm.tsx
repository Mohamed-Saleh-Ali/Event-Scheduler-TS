import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { SignUp } from "./network/Fetches";
import { isApiError } from "./types";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpForm() {
  const [form, setForm] = useState<SignUpFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (authError) setAuthError("");
  };

  const validate = () => {
    const next: SignUpFormErrors = {};

    if (!form.name.trim()) {
      next.name = "Enter your name";
    }

    if (!form.email.trim()) {
      next.email = "Enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }

    if (!form.password) {
      next.password = "Enter a password";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await SignUp(form);
      console.log("Created account:", result);
      navigate("/signin");
    } catch (err) {
      console.error(err);

      if (!isApiError(err)) {
        setAuthError("Something went wrong. Please try again.");
        return;
      }

      switch (err.kind) {
        case "conflict":
          setErrors((prev) => ({ ...prev, email: err.message }));
          break;

        case "validation":
          setErrors((prev) => ({ ...prev, email: err.message }));
          break;

        case "network":
        case "technical":
        case "unknown":
        default:
          setAuthError(err.message || "Something went wrong. Please try again.");
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-10">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

          {authError && (
            <div className="alert bg-red-400 text-black rounded-md mb-5 px-5 py-4">
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text text-base">Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ada Lovelace"
                className={`input input-bordered w-full rounded-md border ${
                  errors.name ? "input-error" : "border-gray-300"
                }`}
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text text-base">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ada@example.com"
                className={`input input-bordered w-full rounded-md border ${
                  errors.email ? "input-error" : "border-gray-300"
                }`}
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text text-base">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input input-bordered w-full rounded-md border ${
                  errors.password ? "input-error" : "border-gray-300"
                }`}
                value={form.password}
                onChange={handleChange}
              />
              <label className="label">
                <span
                  className={`label-text-alt ${
                    errors.password ? "text-error" : "text-base-content/60"
                  }`}
                >
                  {errors.password || "Minimum 8 characters"}
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text text-base">Confirm password</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`input input-bordered w-full rounded-md border ${
                  errors.confirmPassword ? "input-error" : "border-gray-300"
                }`}
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="btn w-full text-base normal-case bg-blue-700 hover:bg-blue-800 border-none text-white py-3 h-auto"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-left text-sm pt-1">
              Already have an account?{" "}
              <Link to="/signin" className="link font-medium text-blue-700 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
