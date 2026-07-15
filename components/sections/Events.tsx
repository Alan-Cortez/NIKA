import { CalendarDays } from "lucide-react";

const events = [
  {
    day: "12",
    month: "Jul",
    title: "Taller de manualidades bíblicas",
    description: "Actividades creativas para toda la familia con historias de la Biblia.",
  },
  {
    day: "26",
    month: "Jul",
    title: "Open house — conoce nuestras aulas",
    description: "Visita guiada, presentación de programas y tiempo de preguntas con Miss Aned.",
  },
];

export default function Events() {
  return (
    <section id="eventos" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="section-title text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          Próximas actividades y eventos
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.title}
              className="flex gap-5 rounded-3xl border border-slate-100 bg-aned-cream p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-aned-orange text-white">
                <span className="section-title text-2xl font-bold leading-none">
                  {event.day}
                </span>
                <span className="text-xs font-bold uppercase">{event.month}</span>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-aned-teal">
                  <CalendarDays className="h-4 w-4" />
                  Evento escolar
                </div>
                <h3 className="section-title text-xl font-bold text-slate-800">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
