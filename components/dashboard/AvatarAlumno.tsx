/**
 * AvatarAlumno – Avatar animado/caricaturesco para alumnos.
 * Usa la API pública de DiceBear (https://dicebear.com) con el estilo
 * "fun-emoji" para generar un avatar único basado en el nombre.
 * No requiere subir fotos reales.
 */

interface AvatarAlumnoProps {
  nombre: string;
  /** Tamaño en px del cuadro/círculo. Por defecto 36. */
  size?: number;
  /** Clases adicionales para el contenedor */
  className?: string;
  /** Si es true, usa bordes redondeados cuadrados (rounded-xl); si no, círculo completo */
  rounded?: "full" | "xl" | "2xl";
}

export default function AvatarAlumno({
  nombre,
  size = 36,
  className = "",
  rounded = "full",
}: AvatarAlumnoProps) {
  // DiceBear API – estilo fun-emoji, seed = nombre del alumno
  const seed = encodeURIComponent(nombre.trim().toLowerCase());
  const avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}&size=${size}`;

  const borderRadius =
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : "rounded-2xl";

  return (
    <div
      className={`shrink-0 overflow-hidden bg-gradient-to-br from-aned-teal/10 to-aned-orange/10 ${borderRadius} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={`Avatar de ${nombre}`}
        width={size}
        height={size}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
