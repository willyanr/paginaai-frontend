// src/app/debug/page.tsx
"use client";
import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data: session, status } = useSession();


  if (status === "loading") return <p>Carregando...</p>;

  return (
    <div className="p-4">
      <h1>Debug NextAuth</h1>
      <pre className="bg-gray-200 p-2 text-sm rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
