import { PsychologicalScenario } from "../../scenarios";

export const SPANISH_LINGUISTIC_PROXY_SCENARIOS: PsychologicalScenario[] = [
  {
    id: 1,
    domainContext: "PROFESSIONAL LATEX / POWER EXERCISE",
    scenarioTitle: "El cuello de botella sistémico",
    context: "Su colaborador más cercano no cumple con una fecha límite crítica del proyecto debido a descuidos sistémicos. Seleccione su borrador de comunicación inmediata:",
    options: [
      {
        id: "1A",
        text: "Esta trayectoria es inaceptable. Requerimos un giro estructural directo y una auditoría de ejecución completa para mañana a las 0900 para asegurar el resultado básico.",
        linguisticWeights: { cognitiveComplexity: 35, certaintyLanguage: 95, powerLanguage: 95, cloakingScore: 10 }
      },
      {
        id: "1B",
        text: "Parece que ciertas métricas se han desviado ligeramente de nuestras proyecciones iniciales. Podría ser útil revisar el cronograma si las variables cambian.",
        linguisticWeights: { cognitiveComplexity: 85, certaintyLanguage: 15, powerLanguage: 15, cloakingScore: 85 }
      },
      {
        id: "1C",
        text: "Sé que todos están haciendo su mejor esfuerzo bajo presión. Reunámonos en una llamada rápida para que podamos solucionar esta alineación como equipo.",
        linguisticWeights: { cognitiveComplexity: 20, certaintyLanguage: 40, powerLanguage: 20, cloakingScore: 5 }
      }
    ]
  },
  {
    id: 2,
    domainContext: "INTERPERSONAL SHADOW / RELATION LINK",
    scenarioTitle: "El límite relacional",
    context: "Un contacto cercano le envía mensajes repetidamente a altas horas de la noche sobre asuntos no urgentes. Seleccione su respuesta para establecer límites:",
    options: [
      {
        id: "2A",
        text: "Valoro nuestra conexión, pero mis parámetros de espacio personal son fijos. No estaré disponible para comunicación por texto después de las 2100 de ahora en adelante.",
        linguisticWeights: { cognitiveComplexity: 45, certaintyLanguage: 90, powerLanguage: 75, cloakingScore: 20 }
      },
      {
        id: "2B",
        text: "Las cosas se han sentido un poco abrumadoras últimamente, ¿sabes? Tal vez deberíamos intentar pasar un poco menos de tiempo con el móvil por las noches.",
        linguisticWeights: { cognitiveComplexity: 30, certaintyLanguage: 20, powerLanguage: 10, cloakingScore: 60 }
      },
      {
        id: "2C",
        text: "Si no respondo de inmediato, por favor no lo malinterprete. Estoy lidiando con una alta carga de trabajo pero lo revisaré en cuanto me libere.",
        linguisticWeights: { cognitiveComplexity: 60, certaintyLanguage: 40, powerLanguage: 30, cloakingScore: 40 }
      }
    ]
  },
  {
    id: 3,
    domainContext: "NEGOTIATION LATEX / VALUE ORIENTATION",
    scenarioTitle: "La matriz de compensación",
    context: "Está negociando el paquete de compensación para un nuevo puesto. Elija cómo presenta sus expectativas:",
    options: [
      {
        id: "3A",
        text: "Basándome en mis datos de valor de mercado y en mis métricas de ejecución histórica, mi objetivo base fijo es de $180,000. Estoy listo para firmar el contrato una vez ajustado.",
        linguisticWeights: { cognitiveComplexity: 50, certaintyLanguage: 95, powerLanguage: 85, cloakingScore: 15 }
      },
      {
        id: "3B",
        text: "La oportunidad de construir algo grandioso con el equipo es lo que más me entusiasma. Estoy seguro de que podemos acordar una cifra que nos parezca justa a todos.",
        linguisticWeights: { cognitiveComplexity: 25, certaintyLanguage: 30, powerLanguage: 10, cloakingScore: 5 }
      },
      {
        id: "3C",
        text: "Dada la complejidad del panorama de mercado actual, sería prudente estructurar un paquete ponderado en acciones que equilibre el beneficio a largo plazo.",
        linguisticWeights: { cognitiveComplexity: 90, certaintyLanguage: 50, powerLanguage: 40, cloakingScore: 75 }
      }
    ]
  },
  {
    id: 4,
    domainContext: "CRITICAL RISK / STRESS RESPONSE",
    scenarioTitle: "La crisis de responsabilidad",
    context: "Una implementación que autorizó causó una falla importante en la interfaz. Seleccione cómo aborda el incidente con las partes interesadas:",
    options: [
      {
        id: "4A",
        text: "Una evaluación interna indica que ocurrió una falla de interfaz dentro de la arquitectura de procesamiento. Se está estructurando un parche correctivo de inmediato.",
        linguisticWeights: { cognitiveComplexity: 95, certaintyLanguage: 60, powerLanguage: 30, cloakingScore: 95 }
      },
      {
        id: "4B",
        text: "Calculé completamente mal las variables de configuración en esta implementación. Es enteramente mi error, y me estoy conectando ahora mismo para reconstruir el módulo manualmente.",
        linguisticWeights: { cognitiveComplexity: 40, certaintyLanguage: 85, powerLanguage: 20, cloakingScore: 5 }
      },
      {
        id: "4C",
        text: "Los registros de datos eran muy ambiguos y las instrucciones de implementación carecían de los parámetros necesarios. Necesitamos resolver estas brechas de alineación antes de asignar culpas.",
        linguisticWeights: { cognitiveComplexity: 65, certaintyLanguage: 70, powerLanguage: 70, cloakingScore: 45 }
      }
    ]
  },
  {
    id: 5,
    domainContext: "SOCIAL INFLUENCE / NETWORKING VECTOR",
    scenarioTitle: "La presentación estratégica",
    context: "Desea entablar una relación con un colega de la industria de alto perfil cuyo trabajo se superpone con el suyo. Seleccione su mensaje de presentación:",
    options: [
      {
        id: "5A",
        text: "Organizaré una cena de alto nivel para fundadores destacados el próximo jueves. Su modelo operativo se alinea con nuestro círculo; reserve su espacio.",
        linguisticWeights: { cognitiveComplexity: 30, certaintyLanguage: 80, powerLanguage: 90, cloakingScore: 30 }
      },
      {
        id: "5B",
        text: "¡Hola! Sigo sus proyectos desde hace tiempo y me encanta su trabajo. ¡Avíseme si alguna vez tiene 10 minutos para un café virtual rápido!",
        linguisticWeights: { cognitiveComplexity: 15, certaintyLanguage: 25, powerLanguage: 15, cloakingScore: 5 }
      },
      {
        id: "5C",
        text: "Su reciente tesis sobre diseño de categorías contiene interesantes superposiciones estructurales con un patrón de lógica de red que investigo actualmente. Intercambiemos ideas.",
        linguisticWeights: { cognitiveComplexity: 80, certaintyLanguage: 50, powerLanguage: 40, cloakingScore: 65 }
      }
    ]
  }
];
