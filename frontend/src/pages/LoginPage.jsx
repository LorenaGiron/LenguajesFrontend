import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (

    <div className="flex flex-col items-center justify-center h-screen px-4 gap-16 bg-neutral-50">
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-600 text-center leading-snug">
            Te damos la bienvenida al Sistema de Gestión Escolar
        </h1>

        <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-16">
            <h3 className="text-2xl font-semibold text-center mb-6 text-neutral-600">
                Iniciar Sesión
            </h3>

            <form onSubmit={onSubmit}>
                <Input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
                )}

                <Button className="w-full mt-2" type="submit">
                    Entrar
                </Button>

                <p className="text-sm text-neutral-600 text-center mt-2">
                    ¿No tienes una cuenta?{" "}
                    <a href="/Register" className="font-medium text-sky-600 hover:text-sky-700 hover:underline">
                        Regístrate
                    </a>
                </p>

            </form>
        </div>
    </div>
  );
}
