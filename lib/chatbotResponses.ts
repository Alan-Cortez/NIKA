export type ChatbotResponse = {
  keywords: string[];
  answer: string;
};

export const CHATBOT_GREETING =
  "¡Hola! Soy el asistente de Miss Aned. Con gusto te ayudo con información sobre clases de preescolar, primaria, inscripción, costos, horarios y medios de contacto del próximo curso.";

export const CHATBOT_DEFAULT =
  "Gracias por escribir. Puedo ayudarte con información sobre nuestro curso de preescolar y primaria, edades, costos, inscripción y contacto. Si tu duda es más específica, también puedes comunicarte por WhatsApp al +52 (878) 790-0869 o dejar tus datos en el formulario de inscripción.";

export const CHATBOT_QUICK_REPLIES = [
  "¿Fechas y horarios?",
  "¿Contacto?",
  "¿WhatsApp?",
  "¿Cómo inscribir?",
  "¿Costos?",
  "¿Qué enseñan?",
];

export const CHATBOT_RESPONSES: ChatbotResponse[] = [
  {
    keywords: ["hola", "buenos", "buenas", "saludos", "hey"],
    answer:
      "¡Hola! Qué gusto saludarte. Si estás buscando clases de preescolar o primaria para tu hijo, puedo contarte sobre fechas, horarios, inscripción y costos.",
  },
  {
    keywords: ["horario", "horarios", "hora", "cuando", "cuándo", "clases", "dias", "días", "fecha", "fechas"],
    answer:
      "Las clases serán del 20 de julio al 7 de agosto, únicamente de lunes a viernes en un horario aproximado de 1:00 PM a 3:00 PM.",
  },
  {
    keywords: ["atencion", "atención", "atienden", "horario de atencion", "horario de atención"],
    answer:
      "Para atención y dudas, puedes escribir por WhatsApp al +52 (878) 790-0869 en cualquier momento. Recuerda que el curso será de lunes a viernes, de 1:00 PM a 3:00 PM.",
  },
  {
    keywords: ["inscrib", "registr", "matricul", "inscripcion", "inscripción", "anotar"],
    answer:
      "Para inscribir a tu hijo, solo baja a la sección «Inscripción» y completa el formulario con los datos solicitados. Después, Miss Aned podrá darte seguimiento de forma más personalizada.",
  },
  {
    keywords: ["requisitos", "necesito", "documentos", "datos", "piden", "solicitan"],
    answer:
      "Para el registro te pedirán: nombre del alumno, fecha de nacimiento, programa o grado, nombre del padre, madre o tutor, teléfono, consentimiento y nombre de quien autoriza.",
  },
  {
    keywords: ["formulario", "registro", "registrar", "llenar", "completar"],
    answer:
      "El formulario de inscripción solicita los datos del alumno y del tutor. Al enviarlo, Miss Aned recibe el registro y luego te contacta para confirmar tu lugar en el curso.",
  },
  {
    keywords: ["cristian", "biblia", "fe", "valores", "dios", "jesus", "jesús", "enseñ"],
    answer:
      "Miss Aned acompaña a los niños con paciencia, valores, respeto y disciplina. Las clases combinan aprendizaje y actividades en un ambiente seguro, cercano y con atención cariñosa.",
  },
  {
    keywords: ["metodo", "método", "metodologia", "metodología", "aprenden", "aprendizaje", "apoyo academico", "apoyo académico"],
    answer:
      "El acompañamiento es enfocado en preescolar y primaria, con estrategias adaptadas para fortalecer habilidades, lectura, números y comprensión escolar.",
  },
  {
    keywords: ["seguro", "seguridad", "ambiente", "confianza", "cuidado"],
    answer:
      "Sí, el enfoque de Miss Aned es ofrecer un ambiente seguro, cálido y respetuoso, donde cada niño se sienta valorado y pueda aprender con confianza.",
  },
  {
    keywords: ["contact", "contacto", "telefono", "teléfono", "numero", "número"],
    answer:
      "Claro. Puedes contactar a Miss Aned por WhatsApp o teléfono al +52 (878) 790-0869, y también mediante la página de Facebook «Aned De la cruz».",
  },
  {
    keywords: ["whatsapp", "wasap", "wsp", "llamar"],
    answer:
      "Sí, puedes escribir o llamar al +52 (878) 790-0869. Ese es el número de contacto que aparece en la página para atención directa.",
  },
  {
    keywords: ["facebook", "redes", "social", "sociales", "instagram"],
    answer:
      "Puedes encontrar a Miss Aned en Facebook como «Aned De la cruz». También está disponible vía WhatsApp en el +52 (878) 790-0869.",
  },
  {
    keywords: ["ubicacion", "ubicación", "direccion", "dirección", "donde", "dónde", "mapa"],
    answer:
      "Las clases se imparten en Allende, Coahuila, México. En la sección de contacto aparece un mapa para que ubiques más fácilmente el lugar.",
  },
  {
    keywords: ["precio", "precios", "costo", "costos", "pago", "mensualidad", "cuanto", "cuánto", "clase"],
    answer:
      "El costo es de $500 semanales por alumno. Si deseas registrarte, por favor usa el formulario en la sección de inscripción.",
  },
  {
    keywords: ["edad", "edades", "anos", "años", "ninos", "niños", "pequeno", "pequeño", "grado", "nivel", "programa", "programas"],
    answer:
      "El curso está enfocado únicamente en dos programas: Preescolar (3 a 5 años) y Primaria (6 a 11 años).",
  },
  {
    keywords: ["preescolar", "lectoescritura", "numeros", "números", "3 a 5", "3-5"],
    answer:
      "El nivel Preescolar está dirigido a niños de 3 a 5 años. Incluye lectoescritura, números y habilidades sociales en un ambiente alegre y cercano.",
  },
  {
    keywords: ["primaria", "refuerzo", "6 a 11", "6-11"],
    answer:
      "El nivel Primaria está pensado para alumnos de 6 a 11 años. Se enfoca en reforzar lectura, tareas y comprensión escolar.",
  },
  {
    keywords: ["maestra", "aned", "quien", "quién", "docente", "miss"],
    answer:
      "Miss Aned es una docente comprometida con el aprendizaje infantil, con un enfoque de paciencia, empatía, creatividad y seguimiento del progreso de cada niño.",
  },
  {
    keywords: ["testimonio", "opiniones", "opinan", "padres", "familias"],
    answer:
      "En la página se comparte el testimonio de una familia que menciona cómo Miss Aned ha sido una bendición y cómo el amor con el que enseña se nota en cada clase.",
  }
];

export function findChatbotAnswer(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const scoredResponses = CHATBOT_RESPONSES.map((response) => {
    const matches = response.keywords.filter((keyword) =>
      normalized.includes(
        keyword
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
    ).length;

    return { response, matches };
  }).filter((item) => item.matches > 0);

  if (scoredResponses.length === 0) {
    return CHATBOT_DEFAULT;
  }

  scoredResponses.sort((a, b) => b.matches - a.matches);

  return scoredResponses[0].response.answer;
}
