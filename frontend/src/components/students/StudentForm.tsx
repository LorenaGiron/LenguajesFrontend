// src/components/students/StudentForm.jsx
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function StudentForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Nuevo alumno registrado:", form.username);

    alert("Alumno registrado correctamente");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

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

          <Button
            type="submit"
            className="w-full bg-azulF hover:bg-azulM text-white"
          >
            Registrar Alumno
          </Button>
        </form>
      </div>
    </div>
  );
}
