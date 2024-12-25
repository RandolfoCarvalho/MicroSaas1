"use client";
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

      await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erro no login:', error.message);
      setError('Erro ao se conectar ao servidor');
    }
  };

  const handleLoginGoogle = async () => {
    // Abrir uma nova janela para login com o Google
    const loginWindow = window.open(
      '/users/loginpage', // URL para o login do Google fornecido pelo NextAuth
      '_blank', // Abre em uma nova aba
      'width=600,height=400' // Tamanho da janela
    );
  
    // Checar o status da autenticação com um intervalo
    const checkLoginStatus = setInterval(() => {
      if (loginWindow.closed) {
        clearInterval(checkLoginStatus);
        // Verificar se a autenticação foi bem-sucedida
        if (localStorage.getItem('authStatus') === 'success') {
          router.push('/'); // Redireciona para a página principal
        }
      }
    }, 1000); // Verifica a cada segundo
  };
  

  // Usando useEffect para evitar a navegação durante a renderização
  useEffect(() => {
    if (session) {
      router.push('/');
    }
    
  }, [session, router]);

  // Se a sessão estiver carregando ou já estiver autenticado, não renderiza o modal
  if (status === "loading" || session) {
    return null;
  }

  return (
  <div>
    {/* Modal de Login */}
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
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
            onClick={() => setIsRegistering(true)} // Altera o estado para exibir o modal de cadastro
            className="text-sm text-blue-500 hover:underline"
          >
            Não possui uma conta? Crie uma!
          </button>
        </div>
      </div>
    </div>

    {/* Modal de Cadastro */}
    {isRegistering && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Criar Conta</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch('../../api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, password }), // Incluindo 'name'
                });

                if (!response.ok) {
                  throw new Error('Erro ao registrar usuário');
                }

                const data = await response.json();
                setError('');
                setName('');
                setEmail('');
                setPassword('');
                alert('Cadastro bem-sucedido!');
                setIsRegistering(false); // Fecha o modal após sucesso
              } catch (err) {
                setError(err.message);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900"
                value={name}
                onChange={(e) => setName(e.target.value)} // Estado para o nome
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
              onClick={() => setIsRegistering(false)} // Fecha o modal
              className="text-sm text-blue-500 hover:underline"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}