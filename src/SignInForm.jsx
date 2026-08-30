import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SignIn } from "./network/Fetches";
import { useAuth } from "./context/AuthContext.jsx";

export default function SignInForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const {loggedIn} = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (authError) setAuthError("");
  };

  const validate = () => {
    const next = {};

    if (!form.email.trim()) {
      next.email = "Enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }

    if (!form.password || form.password.length<8) {
      next.password = "Enter your password with at least 8 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await SignIn(form);
      console.log("Signed in:", result);
      console.log("Signed in result.token: ", result.token);

      localStorage.setItem('e-api-token', result.token);
      loggedIn(); // Update the authentication state in the context
      navigate("/");
    } catch (err) {
      console.error(err);

      switch (err.kind) {
        case "unauthorized":
          setAuthError(err.message);
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
          <h1 className="text-3xl font-bold mb-6">Sign In</h1>

          {authError && (
            <div className="alert bg-red-400 text-black rounded-md mb-5 px-5 py-4">
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
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
                "Sign in"
              )}
            </button>

            <p className="text-left text-sm pt-1">
              No account yet?{" "}
              <Link to="/signup" className="link font-medium text-blue-700 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import { SignIn } from "./network/Fetches";
// import { useAuth } from "./context/AuthContext.jsx";

// export default function SignInForm() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//     if (authError) setAuthError("");
//   };

//   const validate = () => {
//     const next = {};

//     if (!form.email.trim()) {
//       next.email = "Enter your email";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       next.email = "Enter a valid email address";
//     }

//     if (!form.password || form.password.length<8) {
//       next.password = "Enter your password with at least 8 characters";
//     }

//     setErrors(next);
//     return Object.keys(next).length === 0;
//   };
//   // const { setLoggedin } = use(AuthContext);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setSubmitting(true);
//     try {
//       const result = await SignIn(form);
//       console.log("Signed in:", result);
//       console.log("Signed in result.token: ", result.token);

//       localStorage.setItem('e-api-token', result.token);
//       useAuth().setLoggedin(true); // Update the authentication state in the context
//       navigate("/");
//     } catch (err) {
//       console.error(err);

//       switch (err.kind) {
//         case "unauthorized":
//           setAuthError(err.message);
//           break;

//         case "network":
//         case "technical":
//         case "unknown":
//         default:
//           setAuthError(err.message || "Something went wrong. Please try again.");
//           break;
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
//       <div className="card w-full max-w-md bg-base-100 shadow-xl">
//         <div className="card-body p-10">
//           <h1 className="text-3xl font-bold mb-6">Sign In</h1>

//           {authError && (
//             <div className="alert bg-red-400 text-black rounded-md mb-5 px-5 py-4">
//               <span>{authError}</span>
//             </div>
//           )}

//           <form className="space-y-5" onSubmit={handleSubmit} noValidate>
//             <div className="form-control">
//               <label className="label" htmlFor="email">
//                 <span className="label-text text-base">Email</span>
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="ada@example.com"
//                 className={`input input-bordered w-full rounded-md border ${
//                   errors.email ? "input-error" : "border-gray-300"
//                 }`}
//                 value={form.email}
//                 onChange={handleChange}
//               />
//               {errors.email && (
//                 <label className="label">
//                   <span className="label-text-alt text-error">
//                     {errors.email}
//                   </span>
//                 </label>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label" htmlFor="password">
//                 <span className="label-text text-base">Password</span>
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 className={`input input-bordered w-full rounded-md border ${
//                   errors.password ? "input-error" : "border-gray-300"
//                 }`}
//                 value={form.password}
//                 onChange={handleChange}
//               />
//               {errors.password && (
//                 <label className="label">
//                   <span className="label-text-alt text-error">
//                     {errors.password}
//                   </span>
//                 </label>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="btn w-full text-base normal-case bg-blue-700 hover:bg-blue-800 border-none text-white py-3 h-auto"
//               disabled={submitting}
//             >
//               {submitting ? (
//                 <span className="loading loading-spinner loading-sm"></span>
//               ) : (
//                 "Sign in"
//               )}
//             </button>

//             <p className="text-left text-sm pt-1">
//               No account yet?{" "}
//               <Link to="/signup" className="link font-medium text-blue-700 hover:text-blue-800">
//                 Sign up
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
