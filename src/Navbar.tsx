import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from './context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, loggedOf } = useAuth()

  return (
    <nav className='flex items-center justify-between bg-base-100 shadow-sm px-4 md:px-8 py-4'>
      <Link to='/' className='flex items-center gap-2 text-xl font-bold'>
        <span className='text-2xl'>🎟️</span>
        <span>Events App</span>
      </Link>
      <div className='hidden md:flex items-center gap-6'>
        <Link to='/' className='text-base font-normal hover:text-blue-700'>
          Home
        </Link>
        {isLoggedIn && (
          <Link
            to='/events/new'
            className='text-base font-normal hover:text-blue-700'
          >
            Create Event
          </Link>
        )}
        {!isLoggedIn && (
          <Link
            to='/signin'
            className='text-base font-normal hover:text-blue-700 px-3 py-2'
          >
            Sign In
          </Link>
        )}
        {!isLoggedIn && (
          <Link
            to='/signup'
            className='btn bg-blue-700 hover:bg-blue-800 border-none text-white normal-case rounded-md px-6 py-3 h-auto'
          >
            Sign Up
          </Link>
        )}
        {isLoggedIn && (
          <button
            className='btn bg-blue-700 hover:bg-blue-800 border-none text-white normal-case rounded-md px-6 py-3 h-auto'
            onClick={loggedOf}
          >
            Log Out
          </button>
        )}
      </div>

      <div className='md:hidden'>
        <button
          className='btn btn-ghost'
          aria-label='Toggle menu'
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className='absolute top-full left-0 w-full bg-base-100 shadow-sm flex flex-col gap-4 p-4 md:hidden'>
          <Link
            to='/'
            className='text-base font-normal hover:text-blue-700'
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to='/signin'
            className='text-base font-normal hover:text-blue-700'
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to='/signup'
            className='btn bg-blue-700 hover:bg-blue-800 border-none text-white normal-case rounded-md w-full px-6 py-3 h-auto'
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}
