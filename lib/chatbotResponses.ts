export type ChatbotResponse = {
  keywords: string[];
  answer: string;
};

export const CHATBOT_GREETING =
  "¡Hola! Soy el asistente de Maestra Aned. Con gusto te ayudo con información sobre clases particulares, programas, edades, secundaria, inscripción, costos, horarios y medios de contacto.";

export const CHATBOT_DEFAULT =
  "Gracias por escribir. Puedo ayudarte con clases particulares, programas, edades, secundaria, costos aproximados, inscripción y contacto. Si tu duda es más específica, también puedes comunicarte por WhatsApp al +52 (878) 790-0869 o dejar tus datos en el formulario de inscripción.";

export const CHATBOT_QUICK_REPLIES = [
  "¿Horarios?",
  "¿Contacto?",
  "¿WhatsApp?",
  "¿Cómo inscribir?",
  "¿Costos?",
  "¿Edades?",
  "¿Qué enseñan?",
];

export const CHATBOT_RESPONSES: ChatbotResponse[] = [
  {
    keywords: ["hola", "buenos", "buenas", "saludos", "hey"],
    answer:
      "¡Hola! Qué gusto saludarte. Si estás buscando clases particulares y apoyo escolar cercano para tu hijo, puedo contarte sobre horarios, edades, secundaria, inscripción y costos.",
  },
  {
    keywords: ["horario", "horarios", "hora", "cuando", "cuándo", "clases", "dias", "días"],
    answer:
      "Las clases se imparten de lunes a viernes. El horario exacto se adapta según la edad y necesidad de cada niño, así que al registrarte Maestra Aned puede orientarte con la mejor opción para tu pequeño.",
  },
  {
    keywords: ["atencion", "atención", "atienden", "horario de atencion", "horario de atención"],
    answer:
      "El horario de atención es de lunes a viernes, de 8:00 a 18:00. Si deseas información directa, también puedes escribir por WhatsApp al +52 (878) 790-0869.",
  },
  {
    keywords: ["inscrib", "registr", "matricul", "inscripcion", "inscripción", "anotar"],
    answer:
      "Para inscribir a tu hijo, solo baja a la sección «Inscripción» y completa el formulario con los datos solicitados. Después, Maestra Aned podrá darte seguimiento de forma más personalizada.",
  },
  {
    keywords: ["requisitos", "necesito", "documentos", "datos", "piden", "solicitan"],
    answer:
      "Para el registro te pedirán: nombre del alumno, fecha de nacimiento, programa o grado, nombre del padre, madre o tutor, teléfono, correo, dirección opcional, consentimiento y nombre de quien autoriza.",
  },
  {
    keywords: ["formulario", "registro", "registrar", "llenar", "completar"],
    answer:
      "El formulario de inscripción solicita los datos del alumno y del tutor. Al enviarlo, Maestra Aned recibe el registro y luego te contacta para confirmar horarios y detalles del programa.",
  },
  {
    keywords: ["cristian", "biblia", "fe", "valores", "dios", "jesus", "jesús", "enseñ"],
    answer:
      "Maestra Aned acompaña a los niños con paciencia, valores, respeto y disciplina. Las clases combinan aprendizaje y actividades lúdicas en un ambiente seguro, cercano y con atención cariñosa.",
  },
  {
    keywords: ["metodo", "método", "metodologia", "metodología", "aprenden", "aprendizaje", "apoyo academico", "apoyo académico"],
    answer:
      "El acompañamiento es personalizado. Se trabaja con estrategias didácticas adaptadas a cada edad y necesidad, especialmente para fortalecer habilidades y apoyar a niños con rezago escolar.",
  },
  {
    keywords: ["seguro", "seguridad", "ambiente", "confianza", "cuidado"],
    answer:
      "Sí, el enfoque de Maestra Aned es ofrecer un ambiente seguro, cálido y respetuoso, donde cada niño se sienta valorado y pueda aprender con confianza.",
  },
  {
    keywords: ["contact", "contacto", "telefono", "teléfono", "numero", "número", "correo", "email"],
    answer:
      "Claro. Puedes contactar a Maestra Aned por WhatsApp o teléfono al +52 (878) 790-0869, por correo a anedvictoria@gmail.com.com y también desde Facebook como «Aned De la cruz». La ubicación mostrada es Allende, Coahuila, México.",
  },
  {
    keywords: ["whatsapp", "wasap", "wsp", "telefono", "teléfono", "llamar"],
    answer:
      "Sí, puedes escribir o llamar al +52 (878) 790-0869. Ese es el número de contacto que aparece en la página para atención directa.",
  },
  {
    keywords: ["facebook", "redes", "social", "sociales", "instagram"],
    answer:
      "En la página aparece Facebook como «Aned De la cruz». También se muestra el WhatsApp +52 (878) 790-0869 y el correo anedvictoria@gmail.com.com como medios directos de contacto.",
  },
  {
    keywords: ["ubicacion", "ubicación", "direccion", "dirección", "donde", "dónde", "mapa"],
    answer:
      "La ubicación mostrada es Allende, Coahuila, México. En la sección de contacto también aparece un mapa para ubicar más fácilmente el lugar.",
  },
  {
    keywords: ["precio", "precios", "costo", "costos", "pago", "mensualidad", "cuanto", "cuánto", "clase"],
    answer:
      "El costo aproximado de las clases particulares ronda entre 80 y 100 pesos por día, dependiendo del tipo de acompañamiento o necesidad del alumno. Si quieres una cotización más precisa, deja tus datos y Maestra Aned podrá orientarte de forma personalizada.",
  },
  {
    keywords: ["edad", "edades", "anos", "años", "ninos", "niños", "pequeno", "pequeño"],
    answer:
      "Hay opciones según la edad del alumno: Inicial de 2 a 3 años, Preescolar de 3 a 5 años, Primaria de 6 a 11 años, Secundaria de 12 a 15 años y apoyo personalizado para distintas necesidades.",
  },
  {
    keywords: ["grado", "nivel", "programa", "programas"],
    answer:
      "Los programas disponibles son: Inicial, Preescolar, Primaria, Secundaria y Apoyo personalizado. Cada uno se adapta a la edad y necesidad del alumno para acompañarlo de forma cercana.",
  },
  {
    keywords: ["inicial", "estimulacion", "estimulación", "temprana"],
    answer:
      "El programa Inicial está pensado para niños de 2 a 3 años. Se trabaja con estimulación temprana, juegos, cantos y actividades formativas.",
  },
  {
    keywords: ["preescolar", "lectoescritura", "numeros", "números", "3 a 5", "3-5"],
    answer:
      "Preescolar está dirigido a niños de 3 a 5 años. Incluye lectoescritura, números y habilidades sociales en un ambiente alegre y cercano.",
  },
  {
    keywords: ["primaria", "refuerzo", "6 a 11", "6-11"],
    answer:
      "Primaria está pensada para alumnos de 6 a 11 años. Se enfoca en reforzar lectura, tareas, comprensión y acompañamiento escolar.",
  },
  {
    keywords: ["secundaria", "12 a 15", "12-15", "adolescente", "adolescentes"],
    answer:
      "Sí, también hay apoyo en Secundaria para alumnos de 12 a 15 años. Se trabaja refuerzo de materias, hábitos de estudio y acompañamiento para que avancen con más seguridad.",
  },
  {
    keywords: ["personalizado", "personalizada", "rezago", "apoyo"],
    answer:
      "El apoyo personalizado se adapta al ritmo y necesidad de cada niño. Es una buena opción cuando se busca reforzamiento académico más cercano o atención especial en algún área.",
  },
  {
    keywords: ["maestra", "aned", "quien", "quién", "docente"],
    answer:
      "Maestra Aned es una docente comprometida con el aprendizaje infantil y especializada en apoyo académico personalizado, con un enfoque de paciencia, empatía, creatividad y seguimiento del progreso.",
  },
  {
    keywords: ["testimonio", "opiniones", "opinan", "padres", "familias"],
    answer:
      "En la página se comparte el testimonio de una madre de preescolar que dice que Maestra Aned ha sido una bendición para su familia y que el amor con el que enseña se nota en cada clase.",
  },
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
