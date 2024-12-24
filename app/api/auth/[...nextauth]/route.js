//app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // Busca o usuário no banco de dados
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("Email ou senha inválidos");
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Email ou senha inválidos");
        }

        // Retorna informações do usuário
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/users/LoginPage",
  },
  callbacks: {
    // Callback para adicionar o ID do usuário à sessão
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      } else {
        // Caso não exista no token, busca no banco
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },

    // Callback para adicionar o ID ao token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Callback para processar login
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // Procura ou cria o usuário no banco
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              name: user.name,
              passwordHash: "", // Campo obrigatório, mas não usado para login Google
            },
          });

          // Cria login externo se necessário
          await prisma.externalLogin.create({
            data: {
              userId: dbUser.id,
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });

          return true;
        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      }

      return true;
    },
  },
  session: {
    strategy: "jwt", // Persistência com JWT
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
