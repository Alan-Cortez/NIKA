export type ChatbotResponse = {
  keywords: string[];
  answer: string;
};

export const CHATBOT_GREETING =
  "¡Hola! Soy el asistente de Maestra Aned. ¿En qué puedo ayudarte hoy?";

export const CHATBOT_DEFAULT =
  "Gracias por tu mensaje. Por ahora solo puedo responder preguntas básicas. Pronto tendré más información. También puedes escribir a Maestra Aned desde la sección de contacto o inscribir a tu hijo con el formulario de registro.";

export const CHATBOT_QUICK_REPLIES = [
  "¿Horarios?",
  "¿Cómo inscribir?",
  "¿Qué enseñan?",
  "¿Contacto?",
];

export const CHATBOT_RESPONSES: ChatbotResponse[] = [
  {
    keywords: ["hola", "buenos", "buenas", "saludos", "hey"],
    answer:
      "¡Hola! Bienvenido al espacio educativo de Maestra Aned. ¿Te gustaría saber sobre horarios, inscripciones o programas?",
  },
  {
    keywords: ["horario", "horarios", "hora", "cuando", "cuándo"],
    answer:
      "Las clases se imparten de lunes a viernes. Los horarios exactos dependen del grado. Completa el formulario de registro y Maestra Aned te confirmará el horario ideal para tu hijo.",
  },
  {
    keywords: ["inscrib", "registr", "matricul", "inscripcion", "inscripción", "anotar"],
    answer:
      "Para inscribir a tu hijo, baja hasta la sección «Inscripción» y completa el formulario con el consentimiento de los padres. Es el único paso necesario para comenzar el proceso.",
  },
  {
    keywords: ["cristian", "biblia", "fe", "valores", "dios", "jesus", "jesús", "enseñ"],
    answer:
      "Maestra Aned integra valores, respeto y disciplina en cada lección. Los niños aprenden con actividades lúdicas en un ambiente seguro y acogedor.",
  },
  {
    keywords: ["contact", "telefono", "teléfono", "correo", "email", "whatsapp"],
    answer:
      "Puedes encontrar los datos de contacto al final de la página. También puedes dejar tus datos en el formulario de registro y te responderemos a la brevedad.",
  },
  {
    keywords: ["precio", "costo", "pago", "mensualidad", "cuanto", "cuánto"],
    answer:
      "Los costos varían según el programa. Escríbenos por el formulario de registro o contáctanos directamente para recibir información personalizada.",
  },
  {
    keywords: ["edad", "grado", "nivel", "programa"],
    answer:
      "Tenemos programas para distintas edades: inicial, preescolar, primaria básica y apoyo personalizado. Revisa la sección «Programas» para ver cuál se adapta mejor a tu hijo.",
  },
];

export function findChatbotAnswer(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const response of CHATBOT_RESPONSES) {
    if (
      response.keywords.some((keyword) => normalized.includes(keyword))
    ) {
      return response.answer;
    }
  }

  return CHATBOT_DEFAULT;
}
