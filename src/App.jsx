import { BrowserRouter, Outlet, Route, Routes } from 'react-router'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import CreateEvent from './pages/CreateEvent'

// import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Layout";
// import Home from "./Home";  commented/dummy 2b deleted once Bernd's branch is merged
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { AuthProvider } from './context/AuthContext';


// Layout is intentionally thin: Bernd's feature-navBar branch adds <Navbar />
// here (above <Outlet />) plus MainLayout/ProtectedLayout per PLANNING.md.
// Coordinate merge order in stand-up — whoever merges second resolves this
// one-line conflict.
// function Layout() {
//   return (
//     <>
//       <Outlet />
//     </>
//   )
// }

// // TODO(Bernd): replace with real src/pages/SignIn.jsx once it exists.
// function SignInPlaceholder() {
//   return <div className="container mx-auto p-4">Sign in page — Bernd's branch, comming soon.</div>
// }

// // TODO(Bernd): replace with real src/pages/SignUp.jsx once it exists.
// function SignUpPlaceholder() {
//   return <div className="container mx-auto p-4">Sign up page — Bernd's branch, comming soon.</div>
// } 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="events/new" element={<CreateEvent />} />
            <Route path="signin" element={<SignInForm />} />
            <Route path="signup" element={<SignUpForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}




// import { login } from '../utils/api'

// async function handleSubmit(e) {
//   e.preventDefault()
//   try {
//     const { token } = await login({ email, password })
//     localStorage.setItem('token', token)   // ← exact key name, this is the contract
//     navigate('/')
//   } catch (err) {
//     setError(err.message)
//   }
// }
//           <Route path="/" element={<Home />} />
//           <Route path="/signin" element={<SignInForm />} />
//           <Route path="/signup" element={<SignUpForm />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// bernd1@example.com
// password123
