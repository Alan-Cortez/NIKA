import Image from "next/image";

export default function Hero() {
  return (
    <section id="inicio" className="doodle-bg relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-aned-teal/10 px-4 py-1.5 text-sm font-bold text-aned-teal">
            20 de Julio al 7 de Agosto • Lunes a Viernes de 1 PM a 3 PM
          </span>
          <h1 className="section-title text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Apoyo escolar y{" "}
            <span className="text-aned-orange">clases particulares</span> para avanzar con seguridad
          </h1>
          <p className="max-w-lg text-lg text-slate-600">
            Maestra Aned acompaña a cada alumno con paciencia, dedicación y estrategias
            adaptadas. Un apoyo cercano para reforzar aprendizaje, tareas y confianza
            en niveles de preescolar y primaria.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#clases"
              className="rounded-full bg-aned-orange px-8 py-3.5 font-bold text-white shadow-lg hover:bg-aned-orange-dark"
            >
              Ver beneficios
            </a>
            <a
              href="#inscripcion"
              className="rounded-full bg-aned-teal px-8 py-3.5 font-bold text-white shadow-lg hover:bg-aned-teal-dark"
            >
              Inscribir ahora
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] bg-aned-gold/30" />
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
            <Image
              src="/images/hero.jpg"
              alt="Niña sonriente aprendiendo"
              width={700}
              height={800}
              className="h-[420px] w-full object-cover lg:h-[520px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
