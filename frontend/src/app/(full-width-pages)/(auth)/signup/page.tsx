import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: "Registro | PaginaAI - Plataforma de pagina de vendas e checkout",
  description: "Crie sua conta no Paginaai e gerencie seus produtos digitais de forma fácil e rápida.",
};

export default function SignUp() {
  return <SignUpForm />;
}
