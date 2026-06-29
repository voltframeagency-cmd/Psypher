import bricksEN from '../data/bricks.json';
import bricksES from '../data/locales/es/bricks.json';
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
      validity_audit: validityAuditText
    };

    return sections;
  }
}
