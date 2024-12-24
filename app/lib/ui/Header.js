"use client";
import { signOut } from 'next-auth/react';

export default function Header() {
    //TODO fazer o "minha conta" ser redirecionado para uma pagina que verifica se esta autenticado primeiro
  return (
    <header className="fixed top-0 left-0 w-full bg-red-500 bg-opacity-50 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-lg font-bold">
            Meu App
          </div>
          <nav>
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
              <li>
                <a href="#" className="hover:underline" onClick={() => signOut()}>
                    Sair
                </a>
               </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
