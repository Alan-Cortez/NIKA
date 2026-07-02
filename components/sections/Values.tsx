import {
  BookOpen,
  Home,
  Shield,
  Smile,
  Star,
  Users,
} from "lucide-react";

const values = [
  { icon: Home, label: "Ambiente familiar", color: "bg-aned-orange" },
  { icon: Shield, label: "Seguridad y cuidado", color: "bg-aned-teal" },
  { icon: Users, label: "Educadores dedicados", color: "bg-aned-blue" },
  { icon: Smile, label: "Aprender jugando", color: "bg-aned-purple" },
  { icon: BookOpen, label: "Aprendizaje guiado", color: "bg-aned-red" },
  { icon: Star, label: "Atención personalizada", color: "bg-aned-gold text-slate-800" },
];

export default function Values() {
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
  return (
    <section className="bg-aned-cream py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="section-title text-3xl font-bold text-slate-900 sm:text-4xl">
          Hacemos la diferencia en la vida de cada niño
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Nuestros valores y el cuidado cercano guían cada actividad, cada
          lección y cada abrazo en el aula.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {values.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white ${color}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <p className="text-sm font-bold text-slate-700">{label}</p>
            </div>
          ))}
        </div>
        {adminSecret ? (
          <div className="mt-6">
            <a
              href={`/maestra/registrations?secret=${adminSecret}`}
              className="text-xs text-slate-600 opacity-0 hover:opacity-100 transition-opacity"
            >
              Acceso Maestra
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
