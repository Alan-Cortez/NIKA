import Image from "next/image";

const programs = [
  {
    title: "Preescolar",
    age: "3 – 5 años",
    description: "Lectoescritura, números y habilidades sociales en un ambiente alegre.",
    image: "/images/classroom.jpg",
    color: "bg-aned-teal",
  },
  {
    title: "Primaria",
    age: "6 – 11 años",
    description: "Refuerzo en lectura, tareas, comprensión y acompañamiento escolar.",
    image: "/images/reading.jpg",
    color: "bg-aned-blue",
  },
];

export default function Programs() {
  return (
    <section id="programas" className="relative bg-aned-orange py-20 lg:py-28">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-orange wave-top" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="section-title text-3xl font-bold sm:text-4xl">
            Clases particulares según la etapa y necesidad de cada alumno
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-orange-100">
            Programas enfocados en preescolar y primaria, con un costo accesible de <strong>$500 semanales</strong>. El apoyo se adapta al ritmo, edad y metas de aprendizaje de cada familia.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.title}
              className="overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-1"
            >
              <div className="relative h-44">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase text-aned-teal">
                  {program.age}
                </span>
                <h3 className="section-title mt-1 text-xl font-bold text-slate-800">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{program.description}</p>
                <a
                  href="#inscripcion"
                  className={`mt-4 inline-block rounded-full px-5 py-2 text-sm font-bold text-white ${program.color}`}
                >
                  Inscribir
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
