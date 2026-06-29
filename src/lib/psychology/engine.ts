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
        : "Operational Analysis: Your psychological hardware presents a unique strategic profile. High-order integration of clinical markers suggests a capacity for extreme tactical focus in low-trust environments."
    };

    return sections;
  }
}
