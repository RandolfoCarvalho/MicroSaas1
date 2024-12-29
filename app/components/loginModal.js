"use client";
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginModal({ isVisible, onClose }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (session) {
      onClose?.(); // Fecha o modal se houver uma sessão ativa
      router.push('/');
    }
  }, [session, router, onClose]);

  const handleLoginEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao fazer login');
        return;
      }

      const data = await response.json();
      setError('');

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (signInResult?.error) {
        setError(signInResult.error);
        return;
      }

      sessionStorage.setItem('user', JSON.stringify(data));
      setEmail('');
      setPassword('');
      onClose?.();
    } catch (error) {
      console.error('Erro no login:', error.message);
      setError('Erro ao se conectar ao servidor');
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setError('Erro ao realizar login com Google');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar usuário');
      }

      const data = await response.json();
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      alert('Cadastro realizado com sucesso!');
      setIsRegistering(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === "loading" || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      {!isRegistering ? (
        // Modal de Login
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-center mb-4">Entrar na sua conta</h2>

          <form onSubmit={handleLoginEmail} className="space-y-4">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Entrar com Email
            </button>
          </form>

          <div className="my-4 text-center">
            <span className="text-gray-500">Ou</span>
          </div>

          <button
            onClick={handleLoginGoogle}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Entrar com o Google
          </button>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-500">Esqueceu sua senha?</a>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegistering(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              Não possui uma conta? Crie uma!
            </button>
          </div>
        </div>
      ) : (
        // Modal de Registro
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Criar Conta</h2>

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
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="register-email"
                className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                id="register-password"
                className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Registrar
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegistering(false)}
              className="text-sm text-blue-500 hover:underline"
            >
              Já possui uma conta? Faça login!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}