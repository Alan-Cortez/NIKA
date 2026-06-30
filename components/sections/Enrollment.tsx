import Image from "next/image";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function Enrollment() {
  return (
    <section id="inscripcion" className="relative bg-aned-blue py-20 lg:py-28">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-blue wave-top" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div className="text-white">
          <span className="text-sm font-bold uppercase tracking-wider text-aned-gold">
            Inscripción
          </span>
          <h2 className="section-title mt-2 text-3xl font-bold sm:text-4xl">
            ¿Cómo inscribir a tu hijo?
          </h2>
          <p className="mt-4 text-blue-100 leading-relaxed">
            Completa el formulario con tus datos y el consentimiento de los padres.
            Este es el único registro conectado a nuestra base de datos. Maestra Aned
            te contactará para confirmar horarios y detalles del programa.
          </p>

          <div className="relative mt-8 hidden overflow-hidden rounded-3xl shadow-2xl lg:block">
            <Image
              src="/images/classroom.jpg"
              alt="Niño feliz en clase"
              width={500}
              height={400}
              className="h-72 w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-aned-blue-dark/60 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <h3 className="section-title mb-6 text-xl font-bold text-white">
            Formulario de registro de alumnos
          </h3>
          <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
