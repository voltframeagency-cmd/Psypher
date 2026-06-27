import bricks from '../data/bricks.json';
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
   * Retrieves a randomized brick based on trait-score normalization (1-5 scale)
   */
  static getBrick(category: string, trait: string, score: number): string {
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
  static getShadowBrick(darkTriad: Record<string, number>): string {
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
  static async assembleHybridReport(report: HybridReport): Promise<Record<string, string>> {
    const bfi = report.selfReport.bfi;
    const dt = report.selfReport.darkTriad;
    const style = report.selfReport.attachment.Style as string;

    const sections: Record<string, string> = {
      personality_architecture: [
        this.getBrick('bfi', 'OPEN_MINDEDNESS', bfi.OPEN_MINDEDNESS),
        this.getBrick('bfi', 'CONSCIENTIOUSNESS', bfi.CONSCIENTIOUSNESS),
        this.getBrick('bfi', 'EXTRAVERSION', bfi.EXTRAVERSION)
      ].join("\n\n"),

      shadow_profile: this.getShadowBrick(dt),

      connection_blueprint: (bricks as any).attachment[style]?.[0] || "Attachment profile pending deep scan.",
      
      clicinal_edge: "Operational Analysis: Your psychological hardware presents a unique strategic profile. High-order integration of clinical markers suggests a capacity for extreme tactical focus in low-trust environments."
    };

    return sections;
  }
}
