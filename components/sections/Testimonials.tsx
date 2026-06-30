import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="section-title text-3xl font-bold text-slate-900 sm:text-4xl">
          Las palabras de los padres son nuestra mayor bendición
        </h2>

        <div className="mt-12 rounded-3xl bg-aned-cream p-8 shadow-sm lg:p-12">
          <div className="flex justify-center gap-1 text-aned-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <blockquote className="mt-6 text-lg italic leading-relaxed text-slate-700">
            &ldquo;Maestra Aned ha sido una bendición para nuestra familia. Mi hija
            no solo aprendió lectura y números, sino que creció en fe y confianza.
            El amor con el que enseña se nota en cada clase.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                src="/images/logo.png"
                alt="María López"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">María López</p>
              <p className="text-sm text-slate-500">Madre de alumna de preescolar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
