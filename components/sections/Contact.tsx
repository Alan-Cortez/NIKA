import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contacto" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-aned-teal">
              Contacto
            </span>
            <h2 className="section-title mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Estamos para servirte
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Si tienes dudas sobre horarios, programas o inscripciones, contáctanos
              directamente. Para registrar a tu hijo, usa el formulario de inscripción.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aned-orange/10 text-aned-orange">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-slate-800">Ubicación</p>
                  <p className="text-sm text-slate-600">
                    Ciudad de México, México
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aned-teal/10 text-aned-teal">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-slate-800">Teléfono</p>
                  <p className="text-sm text-slate-600">+1 (878) 790-0869</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aned-blue/10 text-aned-blue">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-slate-800">Correo</p>
                  <p className="text-sm text-slate-600">hola@maestraaned.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aned-purple/10 text-aned-purple">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-slate-800">Horario de atención</p>
                  <p className="text-sm text-slate-600">Lunes a viernes, 8:00 – 18:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <iframe
              title="Mapa de ubicación"
              src="https://maps.google.com/maps?q=Ciudad%20de%20Mexico&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
