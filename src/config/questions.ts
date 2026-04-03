export interface Question {
  id: number;
  text: string;
  category: "BFI" | "DT" | "ATTACH" | "VALUE" | "COGNITIVE";
  facet?: string;
  reverse?: boolean;
  maxScore: 5;
}

// 54-Item Quick Scan Question Set
export const QUICK_SCAN_QUESTIONS: Question[] = [
  { id: 1, text: "Tends to be quiet.", category: "BFI", facet: "Extraversion", reverse: true, maxScore: 5 },
  { id: 2, text: "Is compassionate, has a soft heart.", category: "BFI", facet: "Agreeableness", maxScore: 5 },
  { id: 3, text: "Tends to be disorganized.", category: "BFI", facet: "Conscientiousness", reverse: true, maxScore: 5 },
  { id: 4, text: "Worries a lot.", category: "BFI", facet: "Neuroticism", maxScore: 5 },
  { id: 5, text: "Is fascinated by art, music, or literature.", category: "BFI", facet: "Openness", maxScore: 5 },
  { id: 6, text: "Is dominant, acts as a leader.", category: "BFI", facet: "Extraversion", maxScore: 5 },
  { id: 7, text: "Is sometimes rude to others.", category: "BFI", facet: "Agreeableness", reverse: true, maxScore: 5 },
  { id: 8, text: "Has difficulty getting started on tasks.", category: "BFI", facet: "Conscientiousness", reverse: true, maxScore: 5 },
  { id: 9, text: "Tends to be depressed, blue.", category: "BFI", facet: "Neuroticism", maxScore: 5 },
  { id: 10, text: "Has little interest in abstract ideas.", category: "BFI", facet: "Openness", reverse: true, maxScore: 5 },
  // ... Truncated for brevity in dev preview, will contain all 54 items
];

// 150-Item Full Decode Question Set (IPIP-NEO-120 + DTDD + AAS)
export const FULL_DECODE_QUESTIONS: Question[] = [
  // IPIP-NEO-120 Items (Subset shown for structure)
  { id: 1, text: "Worry about things.", category: "BFI", facet: "Anxiety", maxScore: 5 },
  { id: 2, text: "Make friends easily.", category: "BFI", facet: "Friendliness", maxScore: 5 },
  { id: 3, text: "Have a vivid imagination.", category: "BFI", facet: "Imagination", maxScore: 5 },
  { id: 4, text: "Trust others.", category: "BFI", facet: "Trust", maxScore: 5 },
  { id: 5, text: "Complete tasks successfully.", category: "BFI", facet: "Self-Efficacy", maxScore: 5 },
  
  // Dark Triad Dirty Dozen (DTDD)
  { id: 121, text: "I tend to manipulate others to get my way.", category: "DT", facet: "Machiavellianism", maxScore: 5 },
  { id: 122, text: "I have used deceit or lied to get my way.", category: "DT", facet: "Machiavellianism", maxScore: 5 },
  { id: 123, text: "I tend to be unconcerned with the morality of my actions.", category: "DT", facet: "Psychopathy", maxScore: 5 },
  { id: 124, text: "I tend to want others to admire me.", category: "DT", facet: "Narcissism", maxScore: 5 },
  
  // Adult Attachment Scale (AAS-18)
  { id: 135, text: "I find it relatively easy to get close to people.", category: "ATTACH", facet: "Closeness", maxScore: 5 },
  { id: 136, text: "I find it difficult to allow myself to depend on others.", category: "ATTACH", facet: "Dependency", reverse: true, maxScore: 5 },
  { id: 137, text: "I often worry that my partner does not really love me.", category: "ATTACH", facet: "Anxiety", maxScore: 5 },
];

/**
 * Note: Full list of 150 items is mapped in the engine. 
 * This file serves as the configuration for the UI rendering.
 */
