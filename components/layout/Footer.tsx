import Image from "next/image";
import { Mail, Phone, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-md">
              <Image
                src="/images/logo.png"
                alt="Logo de NIKA"
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <div>
              <span className="section-title text-xl font-bold text-aned-blue">
                NIKA
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Docente especializada en apoyo académico personalizado. Formamos niños con excelencia académica y valores, en un ambiente de amor, respeto y alegría.
          </p>
        </div>

        <div>
          <h4 className="section-title mb-4 font-bold text-slate-800">Enlaces</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#inicio" className="hover:text-aned-orange">Inicio</a></li>
            <li><a href="#nosotros" className="hover:text-aned-orange">Nosotros</a></li>
            <li><a href="#programas" className="hover:text-aned-orange">Programas</a></li>
            <li><a href="#inscripcion" className="hover:text-aned-orange">Inscripción</a></li>
          </ul>
        </div>

        <div>
          <h4 className="section-title mb-4 font-bold text-slate-800">Explorar</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#blog" className="hover:text-aned-orange">Noticias</a></li>
            <li><a href="#contacto" className="hover:text-aned-orange">Contacto</a></li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" className="rounded-full bg-aned-cream p-2 text-aned-blue hover:bg-aned-orange hover:text-white" aria-label="Facebook">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-full bg-aned-cream p-2 text-aned-blue hover:bg-aned-orange hover:text-white" aria-label="Instagram">
              <Share2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="section-title mb-4 font-bold text-slate-800">Redes Sociales</h4>
          <p className="text-sm text-slate-600 mb-3">Síguenos en nuestras redes:</p>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              <strong>Facebook:</strong> Aned De la cruz
            </p>
            <p className="text-sm text-slate-600">
              <strong>WhatsApp:</strong> +52 (878) 790-0869
            </p>
            <p className="text-sm text-slate-600">
              <strong>Correo:</strong> anedvictoria@gmail.com.com
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-aned-cream py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-600 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} NIKA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-aned-teal" /> +1 (878) 790-0869
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-aned-teal" /> anedvictoria@gmail.com.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
