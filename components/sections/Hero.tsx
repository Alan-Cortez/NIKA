import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="inicio" className="doodle-bg relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute right-10 top-32 hidden text-aned-gold opacity-40 lg:block">
        <Sparkles className="h-8 w-8 animate-float" />
      </div>
      <div className="pointer-events-none absolute bottom-20 left-10 hidden text-aned-teal opacity-30 lg:block">
        <Sparkles className="h-6 w-6 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-aned-teal/10 px-4 py-1.5 text-sm font-bold text-aned-teal">
            Educación personalizada con amor
          </span>
          <h1 className="section-title text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Acompañamiento educativo{" "}
            <span className="text-aned-orange">para el crecimiento</span> de tu hijo
          </h1>
          <p className="max-w-lg text-lg text-slate-600">
            Maestra Aned acompaña a cada niño con paciencia, dedicación y excelencia.
            Un espacio seguro donde aprenden, crecen y fortalecen su confianza.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#nosotros"
              className="rounded-full bg-aned-orange px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-aned-orange-dark"
            >
              Conocer más
            </a>
            <a
              href="#inscripcion"
              className="rounded-full bg-aned-teal px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-aned-teal-dark"
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
