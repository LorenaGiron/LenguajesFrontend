import { useState } from "react";
import Input  from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    username: "",
    password: "",
    rol: "Alumno",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Nuevo usuario registrado:", form.username);

    alert("Usuario registrado correctamente");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grisC">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-azulF mb-6">
          Registro de usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-grisF">
              Nombre completo
            </label>
            <Input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-grisF">
              Nombre de usuario
            </label>
            <Input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Usuario"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-grisF">
              Correo institucional
            </label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ugto.mx"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-grisF">
              Contraseña
            </label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
          </div>

          {/* Selección de rol */}
          <div>
            <label className="block text-sm font-medium text-grisF">
              Rol del usuario
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-azulM"
            >
              <option value="Alumno">Alumno</option>
              <option value="Profesor">Profesor</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {/* Botón */}
          <Button type="submit" className="w-full bg-azulF hover:bg-azulM text-white">
            Registrar Usuario
          </Button>
        </form>
      </div>
    </div>
  );
}
