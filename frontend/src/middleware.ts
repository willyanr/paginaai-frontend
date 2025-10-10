import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 1. Tenta obter o token JWT da sessão criptografada do NextAuth.js
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const { pathname } = req.nextUrl;
  const isAuth = !!token; // Se o token existe, o usuário está autenticado

  // === ROTAS PÚBLICAS (EXCLUSÕES) ===
  // Estas rotas NÃO exigem autenticação.
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/reset-password', '/debug', '/otp', ]; 
  
  // 2. Verifica se o caminho atual é um dos caminhos públicos
  const isPublicPath = publicPaths.includes(pathname);

  // === EXCLUSÕES DE ARQUIVOS/APIS INTERNAS DO NEXT.JS ===
  // Ignora arquivos estáticos, APIs internas e rotas do próprio NextAuth.js
  if (
    pathname.includes('/_next/') || 
    pathname.includes('/api/auth') ||
    pathname.includes('.') // Excluir arquivos estáticos (favicon.ico, etc.)
  ) {
    return NextResponse.next();
  }

  // 3. Lógica de Redirecionamento 1: Usuário autenticado em rota de login/signup
  // Evita que usuários autenticados fiquem presos na tela de login/signup.
  if (isPublicPath && isAuth) {
    return NextResponse.redirect(new URL('/', req.url));
  }


  // 4. Lógica de Proteção 2 (GLOBAL): Se a rota NÃO é pública E o usuário NÃO está autenticado
  // Esta é a regra principal que protege TODAS as outras rotas (/editor, /products, /profile, etc.).
  if (!isPublicPath && !isAuth) {
    
    // Redireciona para a página de login
    const url = new URL('/signin', req.url);
    // Preserva o caminho original para redirecionar após o login
    url.searchParams.set('callbackUrl', pathname);
    
    return NextResponse.redirect(url);
  }
  
  // 5. Permite que a requisição prossiga
  return NextResponse.next();
}

export const config = {
  // O matcher mais abrangente. A lógica dentro da função middleware fará as exclusões.
  matcher: [
    '/:path*', 
  ],
};
