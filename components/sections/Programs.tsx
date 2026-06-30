import Image from "next/image";

const programs = [
  {
    title: "Inicial",
    age: "2 – 3 años",
    description: "Estimulación temprana con juegos, cantos y actividades formativas.",
    image: "/images/hero.jpg",
    color: "bg-aned-orange",
  },
  {
    title: "Preescolar",
    age: "3 – 5 años",
    description: "Lectoescritura, números y habilidades sociales en un ambiente alegre.",
    image: "/images/classroom.jpg",
    color: "bg-aned-teal",
  },
  {
    title: "Primaria básica",
    age: "6 – 8 años",
    description: "Refuerzo académico con acompañamiento personalizado.",
    image: "/images/reading.jpg",
    color: "bg-aned-blue",
  },
  {
    title: "Apoyo personalizado",
    age: "Todas las edades",
    description: "Clases de refuerzo adaptadas al ritmo y necesidades de cada niño.",
    image: "/images/classroom.jpg",
    color: "bg-aned-purple",
  },
];

export default function Programs() {
  return (
    <section id="programas" className="relative bg-aned-orange py-20 lg:py-28">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-orange wave-top" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="section-title text-3xl font-bold sm:text-4xl">
            Acompañamos a cada niño según su edad y necesidad
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-orange-100">
            Programas diseñados con amor para que cada pequeño avance a su ritmo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
