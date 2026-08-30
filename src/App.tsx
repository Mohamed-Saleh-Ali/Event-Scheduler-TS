import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import CreateEvent from './pages/CreateEvent'
import Layout from "./Layout";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { AuthProvider } from './context/AuthContext';

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
