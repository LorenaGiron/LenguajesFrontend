import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSubjectsForTeacher } from "../api/grades.api";
import { Camera, Save, X } from "lucide-react";

export default function TeacherProfile() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    photo: null,
    photoPreview: null,
    description: "",
  });
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar materias
  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        const data = await getSubjectsForTeacher();
        setSubjects(data || []);
      } catch (err) {
        console.error("Error al cargar materias:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("teacherProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData((prev) => ({
        ...prev,
        description: parsed.description || "",
        photoPreview: parsed.photoPreview || null,
      }));
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          photo: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => {
    setProfileData({
      ...profileData,
      description: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Guardar en localStorage (en producción, esto iría al backend)
      const dataToSave = {
        description: profileData.description,
        photoPreview: profileData.photoPreview,
      };
      localStorage.setItem("teacherProfile", JSON.stringify(dataToSave));
      setStatus({ type: "success", message: "✓ Perfil actualizado correctamente." });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: "error", message: `Error: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfileData({
      ...profileData,
      photo: null,
      photoPreview: null,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-azulF mb-2">Mi Perfil</h1>
      <p className="text-grisF mb-8">Gestiona tu información personal y profesional</p>

      {status && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección de Foto */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Foto de Perfil</h2>

            {/* Previsualización de foto */}
            <div className="mb-4">
              {profileData.photoPreview ? (
                <div className="relative">
                  <img
                    src={profileData.photoPreview}
                    alt="Foto de perfil"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    title="Eliminar foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No hay foto</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input de foto */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="py-2 px-4 bg-azulM text-white rounded-lg hover:bg-azulF transition text-center font-medium cursor-pointer">
                Seleccionar Foto
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG. Máximo 5MB</p>
          </div>
        </div>

        {/* Sección de Información */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Básicos */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Información Personal</h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Este campo no puede ser editado</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Tu correo de inicio de sesión</p>
              </div>
            </div>
          </div>

          {/* Materias Asignadas */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Materias Asignadas</h2>

            {loading ? (
              <p className="text-gray-500">Cargando materias...</p>
            ) : subjects.length > 0 ? (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-3 p-3 bg-azulF/10 rounded-lg border border-azulC/20"
                  >
                    <div className="w-2 h-2 bg-azulC rounded-full"></div>
                    <div>
                      <p className="font-medium text-azulF">{subject.name}</p>
                      <p className="text-xs text-grisF">
                        {subject.students?.length || 0} alumnos inscritos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tienes materias asignadas</p>
            )}
          </div>

          {/* Descripción Profesional */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Descripción Profesional</h2>

            <textarea
              value={profileData.description}
              onChange={handleDescriptionChange}
              placeholder="Cuéntales a tus alumnos sobre ti, tu experiencia, metodología de enseñanza..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-azulC focus:border-azulC resize-none h-32"
            />
            <p className="text-xs text-gray-500 mt-2">
              Máximo 500 caracteres. {profileData.description.length}/500
            </p>
          </div>

          {/* Botón de Guardar */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex-1 py-3 px-6 bg-azulF text-white rounded-lg hover:bg-azulM transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
