"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession, isAdminAuthenticated, logoutAdmin, setAdminSession } from "@/utils/adminApi";

export default function AdminHome() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const session = getAdminSession();
  const [remainingMs, setRemainingMs] = useState<number>(session?.remainingMs ?? 0);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseRef = useMemo(() => {
    if (!supabaseUrl) return null;
    try {
      const url = new URL(supabaseUrl);
      const host = url.hostname; // e.g. abcd1234.supabase.co or db.abcd1234.supabase.co
      const parts = host.split(".");

      if (parts.length === 0) return null;

      // Handle both abcd1234.supabase.co and db.abcd1234.supabase.co
      if (parts[0] === "db" && parts.length > 1) {
        return parts[1];
      }

      return parts[0];
    } catch {
      return null;
    }
  }, [supabaseUrl]);

  useEffect(() => {
    const id = setInterval(() => {
      const s = getAdminSession();
      setRemainingMs(s?.remainingMs ?? 0);
      if (!s) {}
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isAuthed = useMemo(() => isAdminAuthenticated(), [remainingMs]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setAdminSession(password.trim());
  }

  function handleLogout() {
    logoutAdmin();
    setPassword("");
    setRemainingMs(0);
  }

  const minutes = Math.max(0, Math.floor(remainingMs / 60000));
  const seconds = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-[#6B5B4F]">
      <h1 className="text-2xl font-bold tracking-tight text-[#4A3F35]">Admin</h1>

      {!isAuthed ? (
        <form onSubmit={handleLogin} className="p-6 bg-[#FEFCF8] border border-[#F5F1EB] rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#4A3F35]">Senha de ADM</h2>
          <p className="text-sm text-[#A0958A]">Forneça sua senha de ADM para acessar o painel. Sessão expira automaticamente após 10 minutos.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de ADM"
            className="w-full shadow appearance-none border border-[#F5F1EB] rounded px-3 py-2 text-[#6B5B4F] bg-[#FEFCF8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]"
            required
          />
          <button type="submit" className="px-4 py-2 rounded bg-[#8B4513] text-white hover:bg-[#A0522D] transition">Login</button>
        </form>
      ) : (
        <div className="p-6 bg-[#FEFCF8] border border-[#F5F1EB] rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[#4A3F35]">Sessão Ativa</h2>
          <p className="text-sm text-[#A0958A]">Você está logado. Auto-logout em {minutes}:{String(seconds).padStart(2, '0')}.</p>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="px-4 py-2 rounded bg-transparent hover:bg-[#F5F1EB] text-[#6B5B4F] border border-[#8B4513] transition">Logout</button>
          </div>
        </div>
      )}

      <div className="p-6 bg-[#FEFCF8] border border-[#F5F1EB] rounded-lg shadow-sm space-y-4">
        <h2 className="font-semibold text-[#4A3F35] flex items-center gap-2">
          <i className="fas fa-database text-[#8B4513]"></i>
          Conteúdo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/admin/historias" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-book-open text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Histórias</span>
          </Link>
          <Link href="/admin/ruas" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-road text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Ruas</span>
          </Link>
          <Link href="/admin/cidades" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-city text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Cidades</span>
          </Link>
          <Link href="/admin/negocios" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-store text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Negócios</span>
          </Link>
        </div>
      </div>

      <div className="p-6 bg-[#FEFCF8] border border-[#F5F1EB] rounded-lg shadow-sm space-y-4">
        <h2 className="font-semibold text-[#4A3F35] flex items-center gap-2">
          <i className="fas fa-gamepad text-[#8B4513]"></i>
          Quiz & Engajamento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/admin/questions" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-question-circle text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Perguntas</span>
          </Link>
          <Link href="/admin/quiz-results" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-chart-bar text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Resultados</span>
          </Link>
          <Link href="/admin/qr-codes" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-qrcode text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">QR Codes</span>
          </Link>
          <Link href="/admin/popup-ads" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-ad text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Popup Ads</span>
          </Link>
        </div>
      </div>

      <div className="p-6 bg-[#FEFCF8] border border-[#F5F1EB] rounded-lg shadow-sm space-y-4">
        <h2 className="font-semibold text-[#4A3F35] flex items-center gap-2">
          <i className="fas fa-bookmark text-[#8B4513]"></i>
          Referências
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/orgs" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-building text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Organizações</span>
          </Link>
          <Link href="/admin/autores" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-user-edit text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Autores</span>
          </Link>
          <Link href="/admin/obras" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-book text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Obras</span>
          </Link>
          <Link href="/admin/sites" className="flex items-center gap-3 p-3 bg-[#F5F1EB] hover:bg-[#E6D3B4] rounded-lg transition-colors group">
            <i className="fas fa-globe text-[#8B4513] group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-medium text-[#4A3F35]">Sites</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
