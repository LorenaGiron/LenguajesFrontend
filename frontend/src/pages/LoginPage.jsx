import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight, BookOpen } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Llama al login del backend y obtiene el rol
      const userRole = await login(username, password);

      let redirectTo = "/dashboard";

      if (userRole === "admin") {
        redirectTo = "/admin/dashboard";
      } else if (userRole === "profesor") {
        redirectTo = "/profesor/dashboard";
      }

      navigate(redirectTo);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-azulF relative overflow-hidden px-6">

      {/* Fondos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-azulM/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-azulC/10 rounded-full blur-3xl"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl text-center font-bold text-white mt-4">
              Sistema de Gestión Escolar
            </h1>

            <p className="text-azulC mt-2 text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="text-grisC block mb-1 text-sm font-medium">
                Usuario
              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 space-x-3 focus-within:border-azulM/50 transition">
                <User className="text-azulC" size={20} />
                <input
                  type="text"
                  placeholder="Usuario"
                  className="bg-transparent outline-none text-white placeholder:text-gray-300/50 w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-grisC block mb-1 text-sm font-medium">
                Contraseña
              </label>

              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 space-x-3 focus-within:border-azulM/50 transition">
                <Lock className="text-azulC" size={20} />
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="bg-transparent outline-none text-white placeholder:text-gray-300/50 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-azulM text-grisC font-bold flex items-center justify-center gap-2 hover:bg-azulF transition duration-300 hover:scale-[1.02]"
            >
              Entrar
            </button>
          </form>

          {/* Enlace regresar */}
          <p className="text-center text-sm text-azulC mt-6">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition"
            >
              ← Volver al inicio
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
