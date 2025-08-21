import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | PaginaAI - Plataforma de pagina de vendas e checkout",
  description: "Acesse sua conta no Paginaai e gerencie seus produtos digitais de forma fácil e rápida.",
};
export default function SignIn() {
  return <SignInForm />;
}
