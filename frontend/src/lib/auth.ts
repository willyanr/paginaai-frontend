
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";




const ACCESS_TOKEN_EXPIRY_SECONDS = 30 * 60;
const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(`${baseUrl}/accounts/refresh/`, {
      refresh: token.refreshToken
    }, {
      headers: { "Content-Type": "application/json" }
    });


    return {
      ...token,
      accessToken: response.data.access,
      refreshToken: token.refreshToken,
    };
  } catch (error) {
    console.error("Erro ao tentar refrescar token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },


      async authorize(credentials) {
        try {
          const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
          if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined.');

          // 1. Faz login e captura tokens
          const loginRes = await axios.post(
            `${baseUrl}/accounts/login/`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            {
              // IMPORTANTE: Se o DRF não espera mais cookies, podemos remover headers 'Content-Type'
            }
          );

          if (loginRes.status !== 200 || !loginRes.data.access) {
            return null;
          }


          const { access, refresh } = loginRes.data;

          // 2. Com o access token, busca os dados do usuário
          // Nota: O DRF agora deve aceitar o token NO HEADER (Bearer)
          const meRes = await axios.get(`${baseUrl}/accounts/me/`, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
            withCredentials: true,

          });
          console.log("ME Response:", meRes.data);

          if (meRes.status !== 200) {
            return null;
          }

          const user = meRes.data;

          // 3. Retorna dados do usuário + tokens + expiração (necessário para o callback jwt)
          return {
            ...user,
            accessToken: access,
            refreshToken: refresh,
            // Calcula o tempo de expiração
            accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRY_SECONDS * 1000,
          };

        } catch {
          throw new Error("Credenciais inválidas");
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // 🔹 Gerencia o token JWT (login + refresh automático)
    async jwt({ token, user }) {
      // 1️⃣ Login inicial
      if (user) {
        return {
          ...token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // 2️⃣ Se o access token ainda está válido
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 3️⃣ Caso contrário, tenta refresh
      const refreshed = await refreshAccessToken(token);

      if (refreshed.error === "RefreshAccessTokenError") {
        console.warn("⚠️ Refresh token inválido ou expirado. Forçando logout...");
        return {
          ...token,
          accessToken: null,
          refreshToken: null,
          error: "SessionExpired",
        };
      }

      return refreshed;
    },


    // 🔹 Monta a sessão enviada ao cliente (React)
    async session({ session, token }) {

      if (token?.user) {
        session.user = token.user;
      }

      // Expõe o accessToken e erros para o cliente
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },


  pages: {
    signIn: '/signin',
  },
  // Garanta que esta variável de ambiente está definida e é segura
  secret: process.env.NEXTAUTH_SECRET,
};