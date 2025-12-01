import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSubjectsForTeacher } from "../api/grades.api";
import { Camera, Save, X, Edit3 } from "lucide-react";

export default function TeacherProfile() {
  const { user, isAuthenticated } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    photo: null,
    photoPreview: null,
    description: "",
  });

  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // DEBUG: ver qué trae user
  useEffect(() => {
    console.log("Auth user (TeacherProfile):", user);
  }, [user]);

  // 1) Llenar los campos del perfil cuando el AuthContext provea user
  useEffect(() => {
    if (!user) return;

    // Soportar formatos: user o user.data
    const profile = user.data ? user.data : user;

    setProfileData(prev => ({
      ...prev,
      fullName: profile.full_name || profile.fullName || prev.fullName || "",
      email: profile.email || prev.email || "",
      // si tu API trae una URL de foto, colócala aquí:
      photoPreview: profile.photo_url || profile.avatar || prev.photoPreview || null,
    }));
  }, [user]);

  // 2) Cargar materias después de que user exista
  useEffect(() => {
    const load = async () => {
      setLoadingSubjects(true);
      try {
        const data = await getSubjectsForTeacher();
        setSubjects(data || []);
      } catch (err) {
        console.error("Error al cargar materias:", err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    // Si quieres que las materias se carguen sólo si hay user/autenticación:
    if (user) load();
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({
        ...prev,
        photo: file,
        photoPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        description: profileData.description,
        photoPreview: profileData.photoPreview,
      };
      localStorage.setItem("teacherProfile", JSON.stringify(dataToSave));
      window.dispatchEvent(new Event("teacherProfileUpdated"));
      setStatus({ type: "success", message: "✓ Perfil actualizado correctamente." });
      setIsEditing(false);
    } catch (err) {
      setStatus({ type: "error", message: "Error al guardar." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(null), 2500);
    }
  };

  const handleCancel = () => {
    const saved = localStorage.getItem("teacherProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfileData(prev => ({
        ...prev,
        description: parsed.description || "",
        photoPreview: parsed.photoPreview || null,
        photo: null,
      }));
    }
    setIsEditing(false);
  };

  // Si no hay user aún, mostrar mensaje de carga (evita mostrar campos vacíos)
  if (!user && !isAuthenticated) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <p className="text-gray-500">No autenticado. Por favor inicia sesión.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-azulF">Perfil del Docente</h1>
          <p className="text-grisF">Gestiona tu información personal</p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-azulF text-white px-4 py-2 rounded-lg shadow hover:bg-azulM transition"
          >
            <Edit3 size={18} />
            Editar Perfil
          </button>
        )}
      </div>

      {status && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-azulF">Foto de Perfil</h2>

          <div className="mb-4">
            {profileData.photoPreview ? (
              <img
                src={profileData.photoPreview}
                alt="Foto perfil"
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {isEditing && (
            <label className="block">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div className="cursor-pointer py-2 px-4 bg-azulM text-white rounded-lg text-center hover:bg-azulF transition">
                Cambiar Foto
              </div>
            </label>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Información Personal</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Nombre Completo</p>
                {!isEditing ? (
                  <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {profileData.fullName}
                  </p>
                ) : (
                  <input
                    disabled
                    value={profileData.fullName}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold">Correo Electrónico</p>
                {!isEditing ? (
                  <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {profileData.email}
                  </p>
                ) : (
                  <input
                    disabled
                    value={profileData.email}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold">Descripción Profesional</p>

                {!isEditing ? (
                  <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-24">
                    {profileData.description || "Sin descripción registrada."}
                  </p>
                ) : (
                  <>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-azulC h-32"
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.description.length}/500 caracteres</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-azulF mb-4">Materias Asignadas</h2>

            {loadingSubjects ? (
              <p className="text-gray-500">Cargando materias...</p>
            ) : subjects.length > 0 ? (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div key={subject.id} className="p-3 bg-azulF/10 border border-azulC/20 rounded-lg flex items-center gap-3">
                    <div className="w-2 h-2 bg-azulC rounded-full"></div>
                    <div>
                      <p className="font-medium text-azulF">{subject.name}</p>
                      <p className="text-xs text-grisF">{subject.students?.length ?? 0} alumnos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tienes materias asignadas.</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 bg-azulF text-white rounded-lg hover:bg-azulM transition flex items-center justify-center gap-2">
                <Save size={20} /> Guardar Cambios
              </button>

              <button onClick={handleCancel} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
