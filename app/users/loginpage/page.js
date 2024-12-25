"use client";
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar o parâmetro de sucesso na URL
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('authStatus');

    if (authStatus === 'success') {
      // Fechar a janela após sucesso na autenticação
      window.close();
    }
  }, []);

  // Função para lidar com o login usando email e senha
  const handleLoginEmail = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('../../api/auth/login', {
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
      console.log('Login bem-sucedido:', data);
      setError(''); // Remove qualquer erro exibido anteriormente

      // Usando signIn() do NextAuth para configurar a sessão
      await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      setEmail('');
      setPassword('');
      
      
      router.push('/');
    } catch (error) {
      console.error('Erro no login:', error.message);
      setError('Erro ao se conectar ao servidor');
    }
  };
  const handleLoginGoogle = async () => {
    await signIn('google');
  };
  if (session) {
    router.push('/');
    return <div>Bem-vindo, {session.user.name}</div>;
  }
  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Entrar na sua conta</h2>
        
        {/* Formulário de login com email e senha */}
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

          {/* Exibindo erro de login, se houver */}
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

        {/* Botão de login com Google */}
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
          <a href="/users/registerpage" className="text-sm text-blue-500 hover:underline">
            Não possui uma conta? Crie uma!
          </a>
        </div>
      </div>
    </div>
  );
}
