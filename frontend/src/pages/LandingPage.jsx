import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Users, BookOpen, BarChart3, Lock, Zap, Globe, Phone, Mail, MapPin } from 'lucide-react';

// Pequeño componente de animación de contador (si no tienes uno propio)
function CounterAnimation({ target = 0, duration = 1200 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = 50; // ms
    const steps = Math.max(1, Math.floor(duration / stepTime));
    const increment = Math.ceil(target / steps);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <p className="text-7xl font-extrabold text-white">{value}{value === target ? '+' : ''}</p>;
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    institucion: '',
    email: '',
    telefono: '',
    alumnos: 'Menos de 100'
  });
const [startCounter, setStartCounter] = useState(false);
  const counterRef = useRef(null);
  const cardsSectionRef = useRef(null);
 useEffect(() => {
    const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Solo activamos el contador cuando la sección de tarjetas es visible
        if (entry.isIntersecting && !startCounter) {
          setStartCounter(true);
          observer.unobserve(entry.target);  // Desuscribirse después de activar
        }
      });
    },
    { threshold: 0.1 }  // Se activa cuando el 10% de la sección es visible
  );

    if (cardsSectionRef.current) {
    observer.observe(cardsSectionRef.current);
  }

  return () => observer.disconnect();
}, [startCounter]);
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Gracias! Nos pondremos en contacto pronto.\nInstitucion: ${formData.institucion}\nEmail: ${formData.email}`);
    setFormData({ institucion: '', email: '', telefono: '', alumnos: 'Menos de 100' });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Navegación */}
      <nav className="fixed w-full top-0 z-50 bg-azulF/90 backdrop-blur-sm border-b border-azulC/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-azulC to-azulF rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:inline">PGE</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-grisC hover:text-azulM transition text-sm font-medium">Inicio</button>
            <button onClick={() => scrollToSection('features')} className="text-grisC hover:text-azulM transition text-sm font-medium">Características</button>
            <button onClick={() => scrollToSection('contact')} className="text-grisC hover:text-azulM transition text-sm font-medium">Cotizaciones</button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:block px-6 py-2 bg-azulM text-grisC font-semibold rounded-full hover:bg-azulM/50 transition duration-300">
              Iniciar Sesión
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-azulC">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-azulF/90 border-t border-azulC/20 py-4 px-4 space-y-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left px-4 py-2 text-azulC hover:bg-azulM/50 rounded-lg transition">Inicio</button>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2 text-azulC hover:bg-azulM/50 rounded-lg transition">Características</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 text-azulC hover:bg-azulM/50 rounded-lg transition">Cotizaciones</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-azulF relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-azulM/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-azul/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-azulM/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-azulM/15 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">   
        {/*TITULO*/}
          <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Plataforma de Gestión Escolar
          </h1>

          <p className="text-lg sm:text-xl text-azulC mb-8 leading-relaxed max-w-2xl mx-auto">
            Una solución integral que centraliza toda la información académica y administrativa de tu institución. Acceso seguro y organizado desde cualquier dispositivo.
          </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16"> 
          <button className="px-8 py-4 bg-azulM font-bold rounded-full hover:shadow-lg hover:shadow-azulC/30 transition transform hover:scale-105 flex items-center justify-center gap-2"> 
            <span  className="animate-pulse text-grisC" >Comenzar Ahora </span>
            <span className='animate-pulse text-grisC '><ArrowRight size={20} /> </span>
          </button>
          </div>

          {/* Imagen del panel administrativo */}
         <div className="relative mt-12">
           <div className="absolute inset-0 bg-gradient-to-r from-azulC/10 to-azulC/10 blur-2xl rounded-3xl "></div>
           <div className="text-center p-4">
             {/* Imagen estática desde `public/images/dashboard.png` */}
              <img
                src="/images/dashboard.png"
               className="rounded-3xl mx-auto mb-4 max-w-full max-h-85 object-contain"
             />
            </div>
           </div>
        </div>
      </section>

<section 
  ref={cardsSectionRef}
  className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-grisC/30 to-grisC/10"
>
  <div className="w-full max-w-6xl mx-auto px-4 mb-16">
    <div className="flex flex-col lg:flex-row items-stretch gap-8">
      {/* Tarjeta Principal  */}
      <div 
        className="w-full lg:w-2/3 flex items-stretch" 
        ref={counterRef}
      >
        {/* Contenedor de la tarjeta */}
        <div className="w-full relative rounded-3xl shadow-lg hover:shadow-xl transition overflow-hidden h-full min-h-96">
          
          {/* 1. IMAGEN DE FONDO (Ocupa todo el espacio) */}
          <img 
            src="images/universidad.png" 
            alt="Universidades socias" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          {/* 2. CAPA DE DEGRADADO */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-azulF z-10"></div>
          
          {/* 3. CONTENIDO DE TEXTO */}
          <div className="relative z-20 p-10 text-right h-full flex flex-col justify-between items-end">
            <div className="mb-6">
              <CounterAnimation target={startCounter ? 10 : 0} duration={1200}/>
              <p className="text-grisC text-xl font-normal mt-2 max-w-sm">
                Hemos trabajado con más de 10 universidades mexicanas
              </p>
            </div>
            
            <div className="mt-auto flex flex-wrap gap-2 justify-start">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">Querétaro</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">CDMX</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">Guanajuato</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor para las dos Tarjetas Secundarias - Derecha (1/3 en desktop) */}
      <div className="flex flex-col w-full lg:w-1/3 gap-4 justify-start">
      
        {/* Tarjeta Secundaria 1 */}
        <div className="w-full group">
          <div className="w-full bg-gradient-to-r from-azulF/70 to-azulF rounded-3xl p-8 shadow-lg hover:shadow-xl transition transform h-full border border-gray-100 relative overflow-hidden min-h-32">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-azulF rounded-2xl flex items-center justify-center mb-4">
                <Zap className="text-azulM" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Acceso Inmediato</h3>
              <p className="text-grisC text-sm">
                Implementa la plataforma en tu institución en menos de 48 horas. Soporte técnico dedicado durante todo el proceso.
              </p>
             
            </div>
          </div>
        </div>

        {/* Tarjeta Secundaria 2 */}
        <div className="w-full group">
          <div className="w-full bg-gradient-to-r from-azulF/70 to-azulF rounded-3xl p-8 shadow-lg hover:shadow-xl transition transform h-full border border-gray-100 relative overflow-hidden min-h-32">
            
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-azulF rounded-2xl flex items-center justify-center mb-4">
                <Users className="text-azulM" size={28} />
              </div>
               <h3 className="text-2xl font-bold text-white mb-3">Plan Personalizado</h3>
              <p className="text-grisC text-sm">
                Adaptamos nuestro sistema a las necesidades específicas de tu institución. Consultoría gratis sin compromiso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

     {/* Características Principales */}
<section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-grisC to-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-azulF text-center mb-4">
      Características Principales
    </h2>
    <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
      Todo lo que necesitas para gestionar tu institución educativa de forma eficiente
    </p>
    {/* Tarjetas */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* Feature 1 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Users className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Gestión de Alumnos</h3>
          <p className="text-gray-600">Registro completo de estudiantes, asignación a materias y seguimiento del desempeño académico.</p>
        </div>
      </div>

      {/* Feature 2 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Globe className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Administración de Profesores</h3>
          <p className="text-gray-600">Control de información docente y asignación de cátedras por materia.</p>
        </div>
      </div>

      {/* Feature 3 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <BookOpen className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Gestión de Materias</h3>
          <p className="text-gray-600">Catálogo centralizado de materias con asignación de profesores responsables.</p>
        </div>
      </div>

      {/* Feature 4 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <BarChart3 className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Captura de Calificaciones</h3>
          <p className="text-gray-600">Sistema seguro y eficiente para registro y consulta de evaluaciones.</p>
        </div>
      </div>

      {/* Feature 5 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Zap className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Reportes Académicos</h3>
          <p className="text-gray-600">Generación automática de boletas, estadísticas y análisis de desempeño.</p>
        </div>
      </div>

      {/* Feature 6 - MODIFICADO */}
      <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-azulC/30 transition duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Círculo Expansivo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-azulC/10 to-azulF/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-[2] transition duration-500 z-0"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-azulC/20 to-azulF/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Lock className="text-azulM" size={24} />
          </div>
          <h3 className="text-xl font-bold text-azulM mb-3">Control de Acceso</h3>
          <p className="text-gray-600">Roles diferenciados con permisos específicos y autenticación robusta.</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Sección de Contacto */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-azulF relative overflow-hidden">
        {/* Decoración circulo degradado*/}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-azulC/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-azulM/15 rounded-full blur-3xl"></div>
        </div>
            {/* Contenido de contacto */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Cotiza tu Plan Ahora
            </h2>
            <p className="text-lg text-azulC">
              Contáctanos para conocer nuestros planes personalizados según las necesidades de tu institución
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Formulario */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-azulC/20">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Nombre de la Institución</label>
                  <input 
                    type="text" 
                    name="institucion"
                    value={formData.institucion}
                    onChange={handleInputChange}
                    placeholder="Tu institución" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-azulC/30 text-white placeholder-azulC/50 focus:outline-none focus:border-azulC transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email de Contacto</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-azulC/30 text-white placeholder-azulC/50 focus:outline-none focus:border-azulC transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+52 (123) 456-7890" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-azulC/30 text-white placeholder-azulC/50 focus:outline-none focus:border-azulC transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Cantidad de Alumnos</label>
                  <select 
                    name="alumnos"
                    value={formData.alumnos}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-azulC/30 text-white focus:outline-none focus:border-azulC transition">
                    <option className="bg-azulM">Menos de 100</option>
                    <option className="bg-azulM">100 - 500</option>
                    <option className="bg-azulM">500 - 1000</option>
                    <option className="bg-azulM">Más de 1000</option>
                  </select>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full py-3 bg-grisC text-azulF font-bold rounded-lg hover:shadow-lg hover:shadow-azulC/20 transition transform hover:scale-105">
                  Solicitar Cotización
                </button>
              </div>
            </div>

            {/* Información */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-azulC/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-azulC" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Teléfono</h4>
                  <p className="text-azulC">+52 (473) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-azulC/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-azulC" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Email</h4>
                  <p className="text-azulC">contacto@alumno.edu.mx</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-azulC/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-azulC" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Ubicación</h4>
                  <p className="text-azulC">Guanajuato, Guanajuato, MX</p>
                </div>
              </div>

              <div className="bg-azulC/10 border border-azulC/20 rounded-lg p-4 mt-8">
                <p className="text-sm text-white">
                  ✓ Respuesta en menos de 24 horas<br/>
                  ✓ Consultoría gratuita<br/>
                  ✓ Demostración personalizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-azulF border-t border-azulC/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2025 Plataforma de Gestión Escolar. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Universidad de Guanajuato</p>
        </div>
      </footer>
    </div>
  );
}