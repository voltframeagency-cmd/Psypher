/**
 * PSYPHER PSYCHOMETRIC DYNAMICS
 * 
 * Dynamically computes strengths, weaknesses, superpowers, pitfalls, 
 * and vocational styles based on the subject's clinical scores.
 * All text strictly adheres to copy blacklist rules (no "and", "but", "or", ";", "y", "pero", "o").
 */

export interface DynamicItem {
  title: string;
  desc: string;
}

export interface PsychometricDynamics {
  strengths: DynamicItem[];
  weaknesses: DynamicItem[];
  superpowers: DynamicItem[];
  pitfalls: DynamicItem[];
  vocationalStyles: DynamicItem[];
}

export function generateDynamics(
  bfi: Record<string, number>,
  attachmentStyle: string,
  cognitiveWiring: string,
  locale: string = "en"
): PsychometricDynamics {
  const isEs = locale === "es";

  // 1. Core Strengths & Weaknesses (based on highest/lowest BFI scores)
  // We sort BFI traits to pick the top 2 for strengths and bottom 2 for weaknesses
  const bfiEntries = Object.entries(bfi).map(([trait, val]) => ({
    trait,
    val,
  }));

  // Sort descending
  const sortedDesc = [...bfiEntries].sort((a, b) => b.val - a.val);
  // Sort ascending
  const sortedAsc = [...bfiEntries].sort((a, b) => a.val - b.val);

  const getBfiText = (trait: string, isHigh: boolean): DynamicItem => {
    switch (trait) {
      case "Openness":
        return isHigh
          ? {
              title: isEs ? "Mapeo Latente" : "Latent Mapping",
              desc: isEs
                ? "Detecta tendencias ocultas, visualizando implicaciones macro antes que otros."
                : "You identify hidden trends and macro implications before others.",
            }
          : {
              title: isEs ? "Pragmatismo Táctico" : "Tactical Pragmatism",
              desc: isEs
                ? "Mantiene a los equipos enfocados en realidades operativas inmediatas."
                : "You keep teams grounded in immediate operational realities.",
            };
      case "Conscientiousness":
        return isHigh
          ? {
              title: isEs ? "Integridad Sistémica" : "Systemic Integrity",
              desc: isEs
                ? "Organiza los procesos con absoluta integridad procedimental."
                : "You organize processes with absolute procedural integrity.",
            }
          : {
              title: isEs ? "Agilidad Adaptativa" : "Adaptation Agility",
              desc: isEs
                ? "Navega desvíos operativos repentinos con total facilidad."
                : "You navigate sudden operational shifts with ease.",
            };
      case "Extraversion":
        return isHigh
          ? {
              title: isEs ? "Influencia Activa" : "Active Influence",
              desc: isEs
                ? "Actúa como catalizador del impulso, inyectando energía al equipo."
                : "You act as a catalyst for team momentum.",
            }
          : {
              title: isEs ? "Enfoque Independiente" : "Independent Focus",
              desc: isEs
                ? "Ejecuta trabajo analítico profundo sin necesidad de recarga social."
                : "You execute deep analytical work without social recharge.",
            };
      case "Agreeableness":
        return isHigh
          ? {
              title: isEs ? "Cohesión Social" : "Cohesion Engineering",
              desc: isEs
                ? "Construye alianzas profesionales de alta confianza."
                : "You build high-trust professional alliances.",
            }
          : {
              title: isEs ? "Decisión Objetiva" : "Objective Decisiveness",
              desc: isEs
                ? "Prioriza la utilidad, buscando resultados sobre los sentimentalismos."
                : "You prioritize utility, seeking results over sentimentality.",
            };
      default: // Neuroticism / Emotionality
        return isHigh
          ? {
              title: isEs ? "Anticipación de Riesgos" : "Risk Anticipation",
              desc: isEs
                ? "Detecta amenazas sutiles antes de que se manifiesten."
                : "You detect subtle threats before they manifest.",
            }
          : {
              title: isEs ? "Estabilidad Emocional" : "Emotional Stability",
              desc: isEs
                ? "Mantiene una toma de decisiones calmada bajo presión."
                : "You maintain calm decision-making under stress.",
            };
    }
  };

  const getBfiWeaknessText = (trait: string, isLow: boolean): DynamicItem => {
    switch (trait) {
      case "Openness":
        return isLow
          ? {
              title: isEs ? "Sobreconceptualización" : "Over-Conceptualization",
              desc: isEs
                ? "Corre el riesgo de retrasar la ejecución persiguiendo novedades intelectuales."
                : "You risk delaying execution while pursuing intellectual novelty.",
            }
          : {
              title: isEs ? "Sesgo de Status Quo" : "Status-Quo Bias",
              desc: isEs
                ? "Se resiste a giros estratégicos prefiriendo flujos de trabajo familiares."
                : "You resist strategic pivots in favor of familiar workflows.",
            };
      case "Conscientiousness":
        return isLow
          ? {
              title: isEs ? "Secuenciación Rígida" : "Rigid Sequencing",
              desc: isEs
                ? "Le cuesta adaptarse si variables repentinas alteran los planes."
                : "You struggle to adapt when sudden variables disrupt plans.",
            }
          : {
              title: isEs ? "Decadencia de Procesos" : "Process Decay",
              desc: isEs
                ? "Corre el riesgo de olvidar pequeños detalles, descuidando protocolos."
                : "You risk overlooking minor details, neglecting protocols.",
            };
      case "Extraversion":
        return isLow
          ? {
              title: isEs ? "Dependencia de Estímulos" : "Stimulation Dependency",
              desc: isEs
                ? "Pierde rendimiento en enfoques aislados de carácter prolongado."
                : "You lose energy in prolonged isolated focus.",
            }
          : {
              title: isEs ? "Aislamiento Crítico" : "Information Siloing",
              desc: isEs
                ? "Puede olvidar comunicar actualizaciones críticas al grupo."
                : "You fail to communicate critical updates to the group.",
            };
      case "Agreeableness":
        return isLow
          ? {
              title: isEs ? "Evitación del Conflicto" : "Conflict Avoidance",
              desc: isEs
                ? "Retrasa negociaciones difíciles para mantener la armonía."
                : "You delay difficult negotiations to maintain harmony.",
            }
          : {
              title: isEs ? "Entrega Directa" : "Direct Delivery",
              desc: isEs
                ? "Su comunicación directa puede incomodar a colaboradores sensibles."
                : "Your direct communication can alienate sensitive colleagues.",
            };
      default: // Neuroticism / Emotionality
        return isLow
          ? {
              title: isEs ? "Volatilidad del Estrés" : "Stress Volatility",
              desc: isEs
                ? "La alta presión reduce su enfoque operativo."
                : "High pressure degrades your operational focus.",
            }
          : {
              title: isEs ? "Déficit de Vigilancia" : "Vigilance Deficit",
              desc: isEs
                ? "Pasa por alto riesgos sutiles en entornos de baja confianza."
                : "You overlook subtle risks in low-trust environments.",
            };
    }
  };

  // Generate 3 unique strengths
  const strengths = [
    getBfiText(sortedDesc[0].trait, true),
    getBfiText(sortedDesc[1].trait, true),
    getBfiText(sortedDesc[2].trait, true),
  ];

  // Generate 3 unique weaknesses
  const weaknesses = [
    getBfiWeaknessText(sortedAsc[0].trait, true),
    getBfiWeaknessText(sortedAsc[1].trait, true),
    getBfiWeaknessText(sortedAsc[2].trait, true),
  ];

  // 2. Superpowers & Pitfalls (based on attachment style)
  let superpowers: DynamicItem[] = [];
  let pitfalls: DynamicItem[] = [];

  if (attachmentStyle.includes("Avoidant") && attachmentStyle.includes("Fearful")) {
    superpowers = [
      {
        title: isEs ? "Autonomía de Crisis" : "Autonomy under Crisis",
        desc: isEs
          ? "Mantiene un fuerte enfoque en entornos volátiles de baja confianza."
          : "You maintain strong focus in volatile, low-trust environments.",
      },
    ];
    pitfalls = [
      {
        title: isEs ? "Retirada Defensiva" : "Defensive Retreat",
        desc: isEs
          ? "Aleja a sus colaboradores cuando la tensión relacional escala."
          : "You push others away when relationship tension escalates.",
      },
    ];
  } else if (attachmentStyle.includes("Avoidant")) {
    superpowers = [
      {
        title: isEs ? "Ejecución Autorregulada" : "Self-Regulated Speed",
        desc: isEs
          ? "Resuelve tareas complejas de forma independiente sin supervisión constante."
          : "You execute complex tasks independently without handholding.",
      },
    ];
    pitfalls = [
      {
        title: isEs ? "Déficit de Integración" : "Integration Deficit",
        desc: isEs
          ? "Excluye a miembros del equipo, limitando recursos de inteligencia diversa."
          : "You shut out team members, limiting diverse intelligence resources.",
      },
    ];
  } else if (attachmentStyle.includes("Anxious")) {
    superpowers = [
      {
        title: isEs ? "Monitoreo Proactivo" : "Proactive Harmony",
        desc: isEs
          ? "Monitorea de cerca la dinámica del equipo, previniendo fricciones ocultas."
          : "You monitor team dynamics closely, preventing hidden friction.",
      },
    ];
    pitfalls = [
      {
        title: isEs ? "Alarma Falsa" : "False Alarm Loop",
        desc: isEs
          ? "Procesa cambios menores como amenazas graves a la cooperación."
          : "You process minor shifts as major threats to cooperation.",
      },
    ];
  } else {
    // Secure
    superpowers = [
      {
        title: isEs ? "Alianzas Estables" : "Stable Alliances",
        desc: isEs
          ? "Construye relaciones de baja fricción mediante comunicación transparente."
          : "You build low-friction partnerships through transparent communications.",
      },
    ];
    pitfalls = [
      {
        title: isEs ? "Vulnerabilidad Estratégica" : "Strategic Blindspot",
        desc: isEs
          ? "Puede asumir cooperación en entornos hostiles de alta competencia."
          : "You might assume cooperation in hostile, competitive environments.",
      },
    ];
  }

  // 3. Vocational/Work Styles (based on letters of Cognitive Wiring)
  const vocationalStyles: DynamicItem[] = [];

  const addStyle = (code: string) => {
    switch (code) {
      case "E":
        vocationalStyles.push({
          title: isEs ? "Impulso Externo" : "Outward Momentum",
          desc: isEs
            ? "Sobresale en entornos colaborativos de alta energía."
            : "You excel in high-energy, collaborative workspaces.",
        });
        break;
      case "I":
        vocationalStyles.push({
          title: isEs ? "Autonomía Profunda" : "Deep Autonomy",
          desc: isEs
            ? "Prospera en trayectos analíticos independientes."
            : "You thrive in silent, self-directed analytical tracks.",
        });
        break;
      case "N":
        vocationalStyles.push({
          title: isEs ? "Visión Estratégica" : "Strategic Vision",
          desc: isEs
            ? "Se enfoca en macro tendencias a largo plazo, evitando la rutina."
            : "You target long-term macro trends, bypassing daily routine.",
        });
        break;
      case "S":
        vocationalStyles.push({
          title: isEs ? "Ejecución Empírica" : "Empirical Execution",
          desc: isEs
            ? "Gestiona la logística paso a paso mediante validación de datos."
            : "You manage step-by-step logistics with data validation.",
        });
        break;
      case "T":
        vocationalStyles.push({
          title: isEs ? "Optimización Lógica" : "Logical Optimization",
          desc: isEs
            ? "Prioriza la utilidad, la eficiencia de recursos, las métricas."
            : "You prioritize utility, resource efficiency, and metrics.",
        });
        break;
      case "F":
        vocationalStyles.push({
          title: isEs ? "Alineación de Valores" : "Value Alignment",
          desc: isEs
            ? "Coordina equipos en torno a objetivos de misión compartida."
            : "You coordinate teams around shared mission objectives.",
        });
        break;
      case "J":
        vocationalStyles.push({
          title: isEs ? "Planes Estructurados" : "Structured Planning",
          desc: isEs
            ? "Valora los plazos definidos, planos, reglas de ejecución."
            : "You value structured deadlines, blueprints, and execution rules.",
        });
        break;
      case "P":
        vocationalStyles.push({
          title: isEs ? "Agilidad Táctica" : "Tactical Agility",
          desc: isEs
            ? "Cambia el rumbo de las operaciones cuando las situaciones varían."
            : "You pivot operations fluidly when market situations shift.",
        });
        break;
    }
  };

  // Add styles for the letters in the cognitive wiring string (e.g., ENTJ -> E, N, T, J)
  if (cognitiveWiring && cognitiveWiring.length === 4) {
    addStyle(cognitiveWiring.charAt(0));
    addStyle(cognitiveWiring.charAt(1));
    addStyle(cognitiveWiring.charAt(2));
    addStyle(cognitiveWiring.charAt(3));
  } else {
    // Fallbacks
    addStyle("I");
    addStyle("N");
    addStyle("T");
    addStyle("J");
  }

  return {
    strengths,
    weaknesses,
    superpowers,
    pitfalls,
    vocationalStyles: vocationalStyles.slice(0, 3), // return max 3
  };
}

export interface CompatibilityDynamics {
  cognitiveCard: {
    title: string;
    desc: string;
    glowColor: string;
    isAlert?: boolean;
  };
  relationalCard: {
    title: string;
    desc: string;
    glowColor: string;
    isAlert?: boolean;
  };
}

export function generateCompatibilityDynamics(
  selfBfi: Record<string, number>,
  selfAttachmentStyle: string,
  partnerBfi: Record<string, number>,
  partnerAttachmentStyle: string,
  locale: string = "en"
): CompatibilityDynamics {
  const isEs = locale === "es";

  // 1. Cognitive Alignment Card (Openness comparison)
  const selfOpen = selfBfi.Openness ?? 50;
  const partnerOpen = partnerBfi.Openness ?? 50;
  const openDiff = Math.abs(selfOpen - partnerOpen);

  let cognitiveCard = {
    title: isEs ? "Simetría Intelectual" : "Intellectual Symmetry",
    desc: isEs
      ? "Ambos sujetos muestran alta Apertura. La alineación estratégica resulta probable en entornos innovadores."
      : "Both subjects exhibit high Openness. Strategic alignment is highly likely in innovative environments.",
    glowColor: "rgba(168, 85, 247, 0.08)",
    isAlert: false
  };

  if (selfOpen < 40 && partnerOpen < 40) {
    cognitiveCard = {
      title: isEs ? "Enfoque Pragmático" : "Pragmatic Grounding",
      desc: isEs
        ? "Ambos sujetos priorizan la ejecución concreta. El enfoque se concentra en realidades operativas inmediatas."
        : "Both subjects prioritize concrete execution. Focus remains on immediate operational realities.",
      glowColor: "rgba(6, 182, 212, 0.08)",
      isAlert: false
    };
  } else if (openDiff > 35) {
    cognitiveCard = {
      title: isEs ? "Divergencia de Perspectiva" : "Perspective Divergence",
      desc: isEs
        ? "La alta Apertura del Sujeto A frente al enfoque práctico del Sujeto B requiere un marco intencional. Esto conecta la estrategia abstracta con la ejecución real."
        : "Subject A's high Openness vs Subject B's concrete focus requires intentional framing. This bridges abstract strategy with practical execution.",
      glowColor: "rgba(244, 63, 94, 0.08)",
      isAlert: true
    };
  }

  // 2. Relational Card (Attachment Style comparison)
  const isSelfAvoidant = selfAttachmentStyle.includes("Avoidant");
  const isSelfAnxious = selfAttachmentStyle.includes("Anxious");
  const isPartnerAvoidant = partnerAttachmentStyle.includes("Avoidant");
  const isPartnerAnxious = partnerAttachmentStyle.includes("Anxious");

  let relationalCard = {
    title: isEs ? "Seguridad Sinérgica" : "Synergistic Security",
    desc: isEs
      ? "Ambos operan con dinámicas de apego seguro. Esto minimiza la fricción relacional, estabilizando la comunicación."
      : "Both partners operate with secure attachment dynamics. This minimizes relational friction, stabilizing communication.",
    glowColor: "rgba(16, 185, 129, 0.08)",
    isAlert: false
  };

  if (isSelfAvoidant && isPartnerAvoidant) {
    relationalCard = {
      title: isEs ? "Silos Independientes" : "Independent Silos",
      desc: isEs
        ? "Ambos sujetos priorizan una alta autonomía. Esto genera riesgos de operaciones aisladas."
        : "Both subjects prioritize high autonomy. This creates a risk of isolated operations.",
      glowColor: "rgba(239, 68, 68, 0.08)",
      isAlert: true
    };
  } else if (isSelfAnxious && isPartnerAnxious) {
    relationalCard = {
      title: isEs ? "Vigilancia Amplificada" : "Vigilance Amplification",
      desc: isEs
        ? "La alta sensibilidad compartida ante señales relacionales eleva el estrés. Se requieren estructuras de estabilidad externa."
        : "Shared high sensitivity to relationship signals can amplify stress. External grounding structures are required.",
      glowColor: "rgba(239, 68, 68, 0.08)",
      isAlert: true
    };
  } else if ((isSelfAnxious && isPartnerAvoidant) || (isSelfAvoidant && isPartnerAnxious)) {
    relationalCard = {
      title: isEs ? "Bucle Ansioso-Evitativo" : "Anxious-Avoidant Loop",
      desc: isEs
        ? "La vigilancia ansiosa choca con la retirada evitativa. Se requieren canales estructurados para prevenir bucles reactivos."
        : "Anxious vigilance meets avoidant withdrawal. Structured communication buffers are required to prevent reactive feedback loops.",
      glowColor: "rgba(239, 68, 68, 0.08)",
      isAlert: true
    };
  } else if (isSelfAvoidant || isPartnerAvoidant) {
    const styleSelf = isEs ? (selfAttachmentStyle === "Secure" ? "Seguro" : "Evitativo") : selfAttachmentStyle;
    const stylePartner = isEs ? (partnerAttachmentStyle === "Secure" ? "Seguro" : "Evitativo") : partnerAttachmentStyle;
    relationalCard = {
      title: isEs ? "Disonancia Relacional" : "Relational Dissonance",
      desc: isEs
        ? `El estilo ${styleSelf} del Sujeto A frente al estilo ${stylePartner} del Sujeto B genera retrasos en la comunicación. Esto ocurre durante decisiones de alta presión.`
        : `Subject A's ${styleSelf} style vs Subject B's ${stylePartner} style creates a communication lag. This occurs during high-stress decision windows.`,
      glowColor: "rgba(239, 68, 68, 0.08)",
      isAlert: true
    };
  }

  return {
    cognitiveCard,
    relationalCard
  };
}
