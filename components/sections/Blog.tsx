import Image from "next/image";

const posts = [
  {
    date: "15 Jun 2026",
    title: "5 actividades creativas para aprender en casa",
    image: "/images/reading.jpg",
  },
  {
    date: "8 Jun 2026",
    title: "Cómo fomentar la lectura con amor y paciencia",
    image: "/images/classroom.jpg",
  },
  {
    date: "1 Jun 2026",
    title: "Celebrando el Día del Niño con actividades especiales",
    image: "/images/hero.jpg",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="relative bg-aned-red py-20 lg:py-28">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-red wave-top" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center text-white">
          <h2 className="section-title text-3xl font-bold sm:text-4xl">
            Noticias y artículos recientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-red-100">
            Consejos, reflexiones y novedades del espacio educativo de Maestra Aned.
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
                <time className="text-xs font-bold uppercase text-aned-teal">
                  {post.date}
                </time>
                <h3 className="section-title mt-2 text-lg font-bold text-slate-800">
                  {post.title}
                </h3>
                <span className="mt-3 inline-block text-sm font-semibold text-aned-orange">
                  Leer más →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
