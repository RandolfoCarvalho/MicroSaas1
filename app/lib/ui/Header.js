"use client";

export default function Header() {
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
                <a href="/user" className="hover:underline">
                  Minha conta
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
