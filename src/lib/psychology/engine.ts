import bricksEN from '../data/bricks.json';
import bricksES from '../data/locales/es/bricks.json';
import rolesData from '../data/roles.json';
import { HybridReport } from './scoring';

/**
 * PSYPHER ANALYTICAL ENGINE: REPORT_SYNTHESIS
 * 
 * Clinical synthesis layer that assembles psychological bricks based on 
 * hybrid scoring (Self-Report + Linguistic).
 */

export interface ReportSection {
  title: string;
  subtitle: string;
  content: string;
  confidence: number;
}

export class ReportEngine {
  /**
   * Retrieves the active bricks dictionary based on locale
   */
  static getActiveBricks(locale?: string) {
    return locale === "es" ? bricksES : bricksEN;
  }

  /**
   * Retrieves a randomized brick based on trait-score normalization (1-5 scale)
   */
  static getBrick(category: string, trait: string, score: number, locale?: string): string {
    const bricks = this.getActiveBricks(locale);
    const cat = (bricks as any)[category];
    if (!cat || !cat[trait]) {
      console.warn(`[ReportEngine] Missing brick for ${category}.${trait}`);
      return "";
    }

    const range = score >= 3.7 ? 'high' : (score <= 2.3 ? 'low' : 'neutral');
    const options = cat[trait][range] || cat[trait]['neutral'] || cat[trait]['high'] || [];
    
    if (options.length === 0) return "";
    
    // Randomize variation to avoid Barnum Effect across sessions
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  /**
   * Assembles the "Shadow Profile" (The Uncomfortable Truth)
   */
  static getShadowBrick(darkTriad: Record<string, number>, locale?: string): string {
    const bricks = this.getActiveBricks(locale);
    const highest = Object.entries(darkTriad).reduce((a, b) => a[1] > b[1] ? a : b);
    const traitName = highest[0].toLowerCase();
    
    const totalShadow = Object.values(darkTriad).reduce((a, b) => a + b, 0) / 3;
    const category = totalShadow > 66 ? "High_Clinical_Saliency" : totalShadow > 33 ? "Balanced_Strategic_Risk" : "Minimal_Latency";
    const options = (bricks as any).shadow?.["The Uncomfortable Truth"] || [];
    const randomIndex = Math.floor(Math.random() * options.length);
    const template = options[randomIndex];
    
    return template.replace(/{trait}/g, traitName);
  }

  /**
   * Primary Entrance: Assembles the full Hybrid Report
   */
  static async assembleHybridReport(report: HybridReport, locale?: string): Promise<Record<string, string>> {
    const bricks = this.getActiveBricks(locale);
    const bfi = report.selfReport.bfi;
    const dt = report.selfReport.darkTriad;
    const style = report.selfReport.attachment.Style as string;

    const type = report.selfReport.cognitiveWiring || "INTJ";
    const isIntrovert = type.startsWith("I");
    const isIntuitive = type.substring(1, 2) === "N";
    const isThinking = type.substring(2, 3) === "T";

    const introtext = isIntrovert
      ? (locale === "es"
        ? "Foco Interno: Su energía se conserva y refina a través de la deliberación interna. Evita el ruido del consenso para proteger la integridad de sus modelos cognitivos."
        : "Internal Focus: Your energy is conserved and refined through internal deliberation. You bypass the noise of group consensus to protect the integrity of your cognitive models.")
      : (locale === "es"
        ? "Foco Externo: Su energía actúa como un catalizador social. Procesa la información mediante la interacción en tiempo real y el intercambio verbal."
        : "External Focus: Your energy acts as a social catalyst. You process information through real-time interaction and verbal exchange.");

    const perceptiontext = isIntuitive
      ? (locale === "es"
        ? "Percepción Abstracta: Se enfoca en las conexiones latentes, las implicaciones a largo plazo y las macroestructuras que definen las tendencias del entorno."
        : "Abstract Perception: You focus on latent connections, long-term implications, and the macro-structures that define environmental trends.")
      : (locale === "es"
        ? "Percepción Concreta: Su atención se centra en la realidad empírica observable, los datos históricos y la ejecución inmediata paso a paso."
        : "Concrete Perception: Your attention centers on empirical observable reality, historical data, and immediate step-by-step execution.");

    const decisiontext = isThinking
      ? (locale === "es"
        ? "Juicio Analítico: La lógica y la optimización de recursos anulan el sentimentalismo. Toma decisiones difíciles basadas en la utilidad mensurable."
        : "Analytical Judgment: Logic and resource optimization override sentimentality. You make difficult decisions based on measurable utility.")
      : (locale === "es"
        ? "Juicio de Cohesión: La armonía grupal y los valores compartidos guían sus decisiones. Prioriza el alineamiento interpersonal sobre el cálculo frío."
        : "Cohesion Judgment: Group harmony and shared values guide your choices. You prioritize interpersonal alignment over cold calculation.");

    const cognitiveWiringText = [
      `**Jungian Archetype Decoded: ${type}**`,
      introtext,
      perceptiontext,
      decisiontext
    ].join("\n\n");

    const achieves = bfi.CONSCIENTIOUSNESS > 3.5;
    const power = dt.MACHIAVELLIANISM > 3.5 || dt.NARCISSISM > 3.5;
    
    const driverHeader = locale === "es" ? "**Matriz de Motivación y Valores**" : "**Value & Motivation Matrix**";
    const achievetext = achieves
      ? (locale === "es"
        ? "Logro y Competencia: Su motor interno se alimenta de la superación de estándares de excelencia personales y del dominio de tareas complejas."
        : "Achievement & Competency: Your internal engine is fueled by exceeding personal standards of excellence and mastering complex tasks.")
      : (locale === "es"
        ? "Orientación al Flujo: Valora el equilibrio operativo y la adaptabilidad por encima de la acumulación obsesiva de logros o hitos formales."
        : "Flow Orientation: You value operational balance and adaptability over the obsessive accumulation of achievements or formal milestones.");

    const powertext = power
      ? (locale === "es"
        ? "Influencia y Estatus: La búsqueda de influencia estratégica, el estatus y el control de recursos clave guían su posicionamiento en las jerarquías."
        : "Influence & Status: The search for strategic influence, status, and control over key resources guides your positioning in hierarchies.")
      : (locale === "es"
        ? "Colaboración Descentralizada: Prefiere dinámicas de influencia distribuida o liderazgos discretos donde el poder no sea el foco principal."
        : "Decentralized Collaboration: You prefer distributed influence dynamics or quiet leadership where power is not the central focus.");

    const coreDriversText = [
      driverHeader,
      achievetext,
      powertext
    ].join("\n\n");

    const validity = report.modifyingIndices || { disclosure: 50, desirability: 50, debasement: 50, isInvalid: false };
    
    const auditHeader = locale === "es" ? "**Auditoría de Invarianza e Integridad**" : "**Integrity & Invariance Audit**";
    const statusText = validity.isInvalid
      ? (locale === "es"
        ? "ALERTA DE DESVIACIÓN: Se ha detectado un sesgo defensivo en el perfil (alta deseabilidad o baja revelación). Los resultados pueden estar alterados."
        : "BIAS ALERT: A defensive self-presentation pattern has been detected (high desirability or low disclosure). Results may be altered.")
      : (locale === "es"
        ? "PERFIL CONVALIDADO: El análisis estadístico muestra un perfil íntegro, libre de manipulación extrema o fingimiento positivo."
        : "VALIDATION PASS: Statistical analysis confirms a highly valid profile, free from extreme manipulation or faking-good biases.");

    const disclosureText = locale === "es"
      ? `Revelación (${validity.disclosure}%): Mide su nivel de transparencia y voluntad para expresar rasgos extremos.`
      : `Disclosure (${validity.disclosure}%): Measures your transparency and willingness to report extreme traits.`;

    const desirabilityText = locale === "es"
      ? `Deseabilidad (${validity.desirability}%): Evalúa la tendencia a presentarse de manera socialmente aceptable.`
      : `Desirability (${validity.desirability}%): Evaluates the tendency to present oneself in a socially acceptable light.`;

    const debasementText = locale === "es"
      ? `Debilitamiento (${validity.debasement}%): Mide la autocrítica improbable o la exageración de problemas.`
      : `Debasement (${validity.debasement}%): Measures improbable self-criticism or exaggeration of issues.`;

    const validityAuditText = [
      auditHeader,
      statusText,
      disclosureText,
      desirabilityText,
      debasementText
    ].join("\n\n");

    const activeRoles = (rolesData as any)[locale === "es" ? "es" : "en"];
    const userRole = activeRoles[type] || { title: "Strategic Resource", desc: "Vocational vector profile pending deep scan." };
    const vocationalText = locale === "es"
      ? `**Dirección de Carrera y Rol Estratégico: ${userRole.title}**\n\n${userRole.desc}`
      : `**Vocational Vector & Strategic Role: ${userRole.title}**\n\n${userRole.desc}`;

    const sections: Record<string, string> = {
      personality_architecture: [
        this.getBrick('bfi', 'OPEN_MINDEDNESS', bfi.OPEN_MINDEDNESS, locale),
        this.getBrick('bfi', 'CONSCIENTIOUSNESS', bfi.CONSCIENTIOUSNESS, locale),
        this.getBrick('bfi', 'EXTRAVERSION', bfi.EXTRAVERSION, locale)
      ].join("\n\n"),

      shadow_profile: this.getShadowBrick(dt, locale),

      connection_blueprint: (bricks as any).attachment[style]?.[0] || "Attachment profile pending deep scan.",
      
      clicinal_edge: locale === "es" 
        ? "Análisis Operativo: Su hardware psicológico presenta un perfil estratégico único. La integración de alto orden de los marcadores clínicos sugiere una capacidad para un enfoque táctico extremo en entornos de baja confianza."
        : "Operational Analysis: Your psychological hardware presents a unique strategic profile. High-order integration of clinical markers suggests a capacity for extreme tactical focus in low-trust environments.",
      
      cognitive_wiring: cognitiveWiringText,
      core_drivers: coreDriversText,
      validity_audit: validityAuditText,
      vocational_vectors: vocationalText
    };

    return sections;
  }

  static generateDeterministicExecutiveSummary(report: HybridReport, locale?: string): string {
    const wiring = report.selfReport.cognitiveWiring || "INTJ";
    const attachmentStyle = report.selfReport.attachment.Style || "Secure";
    const mach = report.selfReport.darkTriad.MACHIAVELLIANISM || 3.0;
    const psych = report.selfReport.darkTriad.PSYCHOPATHY || 3.0;
    const narc = report.selfReport.darkTriad.NARCISSISM || 3.0;
    const shadowAvg = Math.round(((mach + psych + narc) / 3) * 20);

    let uncomfortableTruth = "";
    if (shadowAvg > 66) {
      uncomfortableTruth = locale === "es"
        ? "Su perfil muestra un escudo de sombra estratégica altamente desarrollado. Utiliza el distanciamiento analítico para evitar el consenso tradicional, priorizando los resultados sobre la armonía interpersonal."
        : "Your profile shows a highly developed strategic shadow shield. You use analytical detachment to bypass traditional consensus, prioritizing outcomes over interpersonal harmony.";
    } else if (shadowAvg < 33) {
      uncomfortableTruth = locale === "es"
        ? "Proyecta una alta confianza interpersonal y empatía, pero puede tener dificultades para evitar el conflicto. Sus métricas indican un fuerte deseo de consenso que a veces puede ralentizar la velocidad operativa."
        : "You project high interpersonal trust and empathy, but may struggle with conflict avoidance. Your metrics indicate a strong desire for consensus that can sometimes slow operational velocity.";
    } else {
      uncomfortableTruth = locale === "es"
        ? "Equilibra la asertividad estratégica con la colaboración grupal. Proyecta una fachada estratégica altamente competente para ocultar una profunda aversión subyacente a la vulnerabilidad, adaptando su estilo según la confianza situacional."
        : "You balance strategic assertiveness with group collaboration. You project a highly competent strategic facade to mask a deep underlying aversion to vulnerability, adapting your style based on situational trust.";
    }

    let strategicFramework = locale === "es"
      ? `Su configuración cognitiva dominante **${wiring}** combinada con un protocolo de apego **${attachmentStyle}** dictamina su perfil de liderazgo. `
      : `Your dominant **${wiring}** cognitive configuration combined with a **${attachmentStyle}** attachment protocol dictates your leadership profile. `;
    
    if (wiring.startsWith("I")) {
      strategicFramework += locale === "es"
        ? "Procesa las operaciones a través de una deliberación interna silenciosa, reservando energía para proteger la integridad de sus modelos analíticos."
        : "You process operations through quiet internal deliberation, reserving energy to protect the integrity of your analytical models.";
    } else {
      strategicFramework += locale === "es"
        ? "Procesa las operaciones como un catalizador social activo, impulsando alineaciones de equipo en tiempo real e intercambios verbales."
        : "You process operations as an active social catalyst, driving real-time team alignments and verbal exchanges.";
    }

    let subIndicesStrategy = "";
    if (mach > 3.5) {
      subIndicesStrategy = locale === "es"
        ? `Su puntuación de maquiavelismo de ${Math.round(mach * 20)}% no es una debilidad. Es su principal activo estratégico en entornos competitivos de baja confianza.`
        : `Your Machiavellian score of ${Math.round(mach * 20)}% is not a liability. It is your primary strategic asset in competitive, low-trust environments.`;
    } else {
      subIndicesStrategy = locale === "es"
        ? "Su perfil moderado de Tríada Oscura sugiere una baja latencia manipuladora. Confía en la autoridad directa y la alineación transparente en lugar de la gestión social indirecta."
        : "Your moderate Dark Triad profile suggests low manipulative latency. You rely on direct authority and transparent alignment rather than indirect social management.";
    }

    let relationalDynamics = "";
    if (attachmentStyle.includes("Avoidant")) {
      relationalDynamics = locale === "es"
        ? `Con un estilo ${attachmentStyle}, busca la cercanía pero se retira cuando la intimidad requiere una entrega genuina. Este patrón crea un ciclo repetitivo de búsqueda y distanciamiento en relaciones de alto riesgo.`
        : `With a ${attachmentStyle} style, you seek closeness but retreat when intimacy requires genuine surrender. This pattern creates a repetitive cycle of chase and withdraw in high-stakes relationships.`;
    } else if (attachmentStyle.includes("Anxious")) {
      relationalDynamics = locale === "es"
        ? `Con un estilo ${attachmentStyle}, tiene una sensibilidad elevada a los cambios interpersonales. Busca una alineación constante, lo que ocasionalmente puede introducir ruido operativo.`
        : `With a ${attachmentStyle} style, you have heightened sensitivity to interpersonal shifts. You seek constant alignment, which can occasionally introduce operational noise.`;
    } else {
      relationalDynamics = locale === "es"
        ? "Con una base de apego seguro, establece alianzas profesionales estables y de baja fricción, permitiendo límites de confianza saludables sin retirada defensiva."
        : "With a Secure attachment base, you establish stable, low-friction professional alliances, permitting healthy trust boundaries without defensive retreat.";
    }

    const playbook1 = wiring.includes("I")
      ? (locale === "es" ? "Inicie una verificación directa de conflicto verbal" : "Initiate one direct verbal conflict check-in")
      : (locale === "es" ? "Pase cuarenta y ocho horas en una planificación estratégica interna profunda sin consultar a los equipos" : "Spend forty-eight hours in deep internal strategic planning without consulting teams");

    const playbook3 = attachmentStyle.includes("Avoidant")
      ? (locale === "es" ? "Delegue un control de hito crítico sin métricas de auditoría" : "Delegate one critical milestone check-in without audit metrics")
      : (locale === "es" ? "Defina reglas explícitas de transparencia para estabilizar la alineación de la comunicación" : "Define explicit transparency rules to stabilize communication alignment");

    return locale === "es" ? `## LA VERDAD INCÓMODA
${uncomfortableTruth}

## MARCO ESTRATÉGICO
${strategicFramework}

## ESTRATEGIA DE SUBÍNDICES
${subIndicesStrategy}

## DINÁMICA RELACIONAL
${relationalDynamics}

## EL MARCO PSYPHER
1. ${playbook1}.
2. Comparta un cuello de botella u fallo operativo específico con su equipo.
3. ${playbook3}.` : `## THE UNCOMFORTABLE TRUTH
${uncomfortableTruth}

## STRATEGIC FRAMEWORK
${strategicFramework}

## SUB-INDICES STRATEGY
${subIndicesStrategy}

## RELATIONAL DYNAMICS
${relationalDynamics}

## THE PSYPHER FRAMEWORK
1. ${playbook1}.
2. Share a specific operational bottleneck or failure with your team.
3. ${playbook3}.`;
  }
}
