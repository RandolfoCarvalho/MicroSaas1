"use client";
import { signOut } from 'next-auth/react';
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controle do menu no mobile

  return (
    <header className="fixed top-0 left-0 w-full bg-red-500 bg-opacity-50 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-lg font-bold">
            <a href="/" className="hover:underline">
                Home
              </a>
            </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="material-icons">menu</span> {/* Ícone do menu */}
            </button>
          </div>
  
          {/* Mobile menu */}
          {menuOpen && (
            <div className="lg:hidden absolute top-16 left-0 w-full bg-red-500 bg-opacity-75">
              <ul className="flex flex-col items-center py-4 space-y-4">
                <li>
                  <a href="/" className="hover:underline">
                    Início
                  </a>
                </li>
                <li>
                  <a href="/users/loginpage" className="hover:underline">
                    Minha conta
                  </a>
                </li>
                {session ? (
                  <li>
                    <a href="/users/cartoes" className="hover:underline">
                      Meus cartões
                    </a>
                  </li>
                ) : null}
                {session ? (
                  <li>
                    <a href="#" className="hover:underline" onClick={() => signOut()}>
                      Sair
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          )}
  
          {/* Desktop navigation */}
          <nav className="hidden lg:flex space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">
                  Início
                </a>
              </li>
              <li>
                <a href="/users/loginpage" className="hover:underline">
                  Minha conta
                </a>
              </li>
              {session ? (
                <li>
                  <a
                    href="#"
                    className="hover:underline"
                    onClick={() => {
                      sessionStorage.clear(); 
                      localStorage.clear(); 
                      signOut();
                    }}
                  >
                    Sair
                  </a>
                </li>
              ) : null}
              {session ? (
                <li>
                  <a href="/users/cartoes" className="hover:underline">
                    Meus cartões
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}  