import Image from "next/image";
import { Award, Heart, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "Excelencia con propósito",
    text: "Metodología adaptada a cada edad con resultados comprobados.",
  },
  {
    icon: Heart,
    title: "Amor y valores",
    text: "Formamos carácter, respeto y confianza en un ambiente cálido.",
  },
  {
    icon: ShieldCheck,
    title: "Ambiente seguro",
    text: "Espacio protegido donde cada niño se siente valorado.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative col-span-2 h-56 overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/images/classroom.jpg"
              alt="Niños en clase"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative h-40 overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/images/reading.jpg"
              alt="Actividad educativa"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative h-40 overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/images/hero.jpg"
              alt="Aprendizaje lúdico"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-aned-teal">
            Sobre nosotros
          </span>
          <h2 className="section-title mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Conoce a <span className="text-aned-orange">Aned De la cruz</span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Docente comprometida con el aprendizaje infantil, especializada en brindar apoyo académico personalizado a niños con rezago escolar. Fortalezco sus habilidades mediante estrategias didácticas adaptadas a las necesidades de cada alumno, en un ambiente de paciencia, empatía y creatividad.
          </p>
          
          <div className="mt-6">
            <h3 className="font-bold text-slate-800 mb-3">Habilidades Clave</h3>
            <ul className="text-sm text-slate-600 space-y-2 grid grid-cols-2 gap-2">
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Atención personalizada
              </li>
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Paciencia y empatía
              </li>
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Reforzamiento académico
              </li>
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Adaptación de estrategias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Motivación y confianza
              </li>
              <li className="flex items-center gap-2">
                <span className="text-aned-orange">✓</span> Seguimiento del progreso
              </li>
            </ul>
          </div>

          <ul className="mt-8 space-y-5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-aned-orange/10 text-aned-orange">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#programas"
            className="mt-8 inline-block rounded-full bg-aned-orange px-8 py-3 font-bold text-white shadow-md transition hover:bg-aned-orange-dark"
          >
            Ver programas
          </a>
        </div>
      </div>
    </section>
  );
}
