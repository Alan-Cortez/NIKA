import Image from "next/image";

const posts = [
  {
    title: "Refuerzo escolar con atención cercana",
    description:
      "Ideal para alumnos que necesitan apoyo en tareas, comprensión, lectura o seguimiento más personalizado.",
    image: "/images/reading.jpg",
  },
  {
    title: "Experiencia en colegios y centros de apoyo",
    description:
      "La experiencia en distintos entornos educativos permite adaptar mejor cada clase a lo que tu hijo necesita.",
    image: "/images/classroom.jpg",
  },
  {
    title: "Comunicación clara con las familias",
    description:
      "Cada proceso busca que mamá o papá tengan información cercana sobre avances, necesidades y siguientes pasos.",
    image: "/images/hero.jpg",
  },
];

export default function Blog() {
  return (
    <section id="clases" className="relative bg-aned-red py-20 lg:py-28">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-red wave-top" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="section-title text-3xl font-bold sm:text-4xl">
            ¿Por qué elegir estas clases particulares?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-red-100">
            Esta página está enfocada en ayudar a más familias a encontrar un apoyo
            escolar cercano, humano y adaptado a cada alumno.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="section-title mt-2 text-lg font-bold text-slate-800">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {post.description}
                </p>
                <a
                  href="#inscripcion"
                  className="mt-4 inline-block text-sm font-semibold text-aned-orange"
                >
                  Solicitar informes →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
