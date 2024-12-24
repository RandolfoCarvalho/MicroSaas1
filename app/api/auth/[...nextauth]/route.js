import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/users/LoginPage",
  },
  callbacks: {
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

    // Callback para adicionar o ID do usuário à sessão
    async session({ session, token }) {
      // Usa o ID armazenado no token (caso seja usado) ou consulta o banco de dados
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
