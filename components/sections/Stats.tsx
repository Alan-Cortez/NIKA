import { GraduationCap, HeartHandshake, Smile, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "150+", label: "Alumnos formados" },
  { icon: GraduationCap, value: "12+", label: "Años de experiencia" },
  { icon: HeartHandshake, value: "98%", label: "Familias satisfechas" },
  { icon: Smile, value: "100%", label: "Con atención cercana" },
];

export default function Stats() {
  return (
    <section className="relative bg-aned-cream py-16">
      <div className="absolute inset-x-0 -top-8 h-16 bg-aned-cream wave-top" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-aned-teal shadow-md">
              <Icon className="h-7 w-7" />
            </span>
            <p className="section-title text-3xl font-bold text-aned-orange">{value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
