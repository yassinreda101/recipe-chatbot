import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 text-white px-4 py-8">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-400 text-gray-900 rounded-full hover:bg-pink-500 transition-all duration-300 ease-in-out"
      >
        ☰
      </button>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 bg-opacity-95 z-40 p-4 transform transition-transform duration-300 ease-in-out">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-pink-500"
          >
            ✕
          </button>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white hover:text-yellow-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/best-practices" className="text-white hover:text-yellow-400 transition-colors duration-300">
                  Best Practices
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {children}

      <footer className="mt-12 text-center">
        <p className="text-yellow-200 mb-4">Crafted with ❤️ using Next.js, React Query, and OpenAI</p>
        <a 
          href="https://github.com/yassinreda101/recipe-chatbot" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 font-bold rounded-full hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Join the Crew on GitHub
        </a>
      </footer>
    </div>
  )
}