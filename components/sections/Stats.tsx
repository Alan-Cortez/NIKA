import { GraduationCap, HeartHandshake, Smile, Users } from "lucide-react";

const stats = [
  {
    icon: GraduationCap,
    value: "+2 años",
    label: "de exp. en colegios y centros de apoyo",
  },
  { icon: HeartHandshake, value: "90%", label: "de familias satisfechas" },
  { icon: Users, value: "Inicial a secundaria", label: "acompañamiento por etapa" },
  { icon: Smile, value: "1 a 1", label: "atención cercana y personalizada" },
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
