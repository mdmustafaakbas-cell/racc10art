"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(SESSION_KEY)) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = getSettings();
    if (password === settings.adminPassword) {
      localStorage.setItem(SESSION_KEY, "true");
      router.push("/admin/dashboard");
    } else {
      setError("Yanlış şifre");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-brand-accent font-black text-3xl tracking-widest mb-1">racc10art</p>
          <p className="text-brand-muted text-sm">Admin Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <label className="block mb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-accent transition-colors mb-4 text-sm"
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mb-4 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-dark font-bold py-3 rounded-lg hover:bg-brand-accent/90 transition-all text-sm"
          >
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-brand-muted text-xs mt-4">
          Varsayılan şifre: <code className="text-brand-text">racc10art2024</code>
        </p>
      </div>
    </div>
  );
}
