"use client";

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('../../api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      const data = await response.json();
      setSuccess(data.message);
      setEmail('');
      setName('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Criar Conta</h2>

        {/* Exibindo mensagens de sucesso ou erro */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        {/* Formulário de registro */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Registrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/users/loginpage" className="text-sm text-blue-500 hover:underline">
            Já possui uma conta? Faça login!
          </a>
        </div>
      </div>
    </div>
  );
}
