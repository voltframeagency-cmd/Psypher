export interface ScenarioOption {
  id: string;
  text: string;
  linguisticWeights: {
    cognitiveComplexity: number;  // Evaluates structural syntax & deep logic mapping
    certaintyLanguage: number;    // Evaluates absolute framing vs hedging
    powerLanguage: number;        // Evaluates intent to dominate or command
    cloakingScore: number;        // Evaluates formal abstraction vs raw authenticity
  };
}

export interface PsychologicalScenario {
  id: number;
  domainContext: string;
  scenarioTitle: string;
  context: string;
  options: ScenarioOption[];
}

export const LINGUISTIC_PROXY_SCENARIOS: PsychologicalScenario[] = [
  {
    id: 1,
    domainContext: "PROFESSIONAL LATEX / POWER EXERCISE",
    scenarioTitle: "The Systemic Bottleneck",
    context: "A critical project deadline is missed by your closest collaborator due to systemic oversights. Choose your immediate communications draft:",
    options: [
      {
        id: "1A",
        text: "This trajectory is unacceptable. We require a direct structural pivot and a full execution audit by 0900 tomorrow to secure the baseline outcome.",
        linguisticWeights: { cognitiveComplexity: 35, certaintyLanguage: 95, powerLanguage: 95, cloakingScore: 10 }
      },
      {
        id: "1B",
        text: "It appears that certain metrics have slightly drifted outside our initial projections. It might be helpful to review the timeline if variables change.",
        linguisticWeights: { cognitiveComplexity: 85, certaintyLanguage: 15, powerLanguage: 15, cloakingScore: 85 }
      },
      {
        id: "1C",
        text: "I know everyone is doing their best under pressure. Let's jump on a quick call together so we can fix this alignment as a team.",
        linguisticWeights: { cognitiveComplexity: 20, certaintyLanguage: 40, powerLanguage: 20, cloakingScore: 5 }
      }
    ]
  },
  {
    id: 2,
    domainContext: "INTERPERSONAL SHADOW / RELATION LINK",
    scenarioTitle: "The Relational Boundary",
    context: "A close contact repeatedly messages you late at night about non-urgent matters. Choose your response to establish boundaries:",
    options: [
      {
        id: "2A",
        text: "I value our connection, but my personal space parameters are fixed. I will be unavailable for text communication after 2100 moving forward.",
        linguisticWeights: { cognitiveComplexity: 45, certaintyLanguage: 90, powerLanguage: 75, cloakingScore: 20 }
      },
      {
        id: "2B",
        text: "Things have felt a bit overwhelming lately, you know? Maybe we should both try to spend a little less time on our phones during evenings.",
        linguisticWeights: { cognitiveComplexity: 30, certaintyLanguage: 20, powerLanguage: 10, cloakingScore: 60 }
      },
      {
        id: "2C",
        text: "If I don't reply immediately, please don't misinterpret it. I am just navigating a high-density workload but I will check in the second I am free.",
        linguisticWeights: { cognitiveComplexity: 60, certaintyLanguage: 40, powerLanguage: 30, cloakingScore: 40 }
      }
    ]
  },
  {
    id: 3,
    domainContext: "NEGOTIATION LATEX / VALUE ORIENTATION",
    scenarioTitle: "The Compensation Matrix",
    context: "You are negotiating the compensation package for a new role. Choose how you present your expectations:",
    options: [
      {
        id: "3A",
        text: "Based on my market value data and historical execution metrics, my fixed baseline target is $180,000. I am prepared to sign the contract once adjusted.",
        linguisticWeights: { cognitiveComplexity: 50, certaintyLanguage: 95, powerLanguage: 85, cloakingScore: 15 }
      },
      {
        id: "3B",
        text: "The opportunity to build something cool with the team is what excites me the most. I'm sure we can figure out a number that feels fair for everyone.",
        linguisticWeights: { cognitiveComplexity: 25, certaintyLanguage: 30, powerLanguage: 10, cloakingScore: 5 }
      },
      {
        id: "3C",
        text: "Given the complexity of the current market landscape, it would be prudent to structure an equity-weighted package that balances long-term upside.",
        linguisticWeights: { cognitiveComplexity: 90, certaintyLanguage: 50, powerLanguage: 40, cloakingScore: 75 }
      }
    ]
  },
  {
    id: 4,
    domainContext: "CRITICAL RISK / STRESS RESPONSE",
    scenarioTitle: "The Accountability Crisis",
    context: "A deployment you authorized caused a major interface failure. Choose how you address the incident with stakeholders:",
    options: [
      {
        id: "4A",
        text: "An internal evaluation indicates an interface failure occurred within the processing architecture. A corrective patch is being structured immediately.",
        linguisticWeights: { cognitiveComplexity: 95, certaintyLanguage: 60, powerLanguage: 30, cloakingScore: 95 }
      },
      {
        id: "4B",
        text: "I completely miscalculated the configuration variables on this deploy. It is entirely my mistake, and I am logging on now to rebuild the module manually.",
        linguisticWeights: { cognitiveComplexity: 40, certaintyLanguage: 85, powerLanguage: 20, cloakingScore: 5 }
      },
      {
        id: "4C",
        text: "The data logs were highly ambiguous, and the deployment instructions lacked necessary parameters. We need to clear these alignment gaps before blame is assigned.",
        linguisticWeights: { cognitiveComplexity: 65, certaintyLanguage: 70, powerLanguage: 70, cloakingScore: 45 }
      }
    ]
  },
  {
    id: 5,
    domainContext: "SOCIAL INFLUENCE / NETWORKING VECTOR",
    scenarioTitle: "The Strategic Introduction",
    context: "You want to build a relationship with a high-profile industry peer whose work overlaps with yours. Choose your outreach message:",
    options: [
      {
        id: "5A",
        text: "I am hosting an elite, high-context dinner space for prominent founders next Thursday. Your operational blueprint aligns with our circle—reserve your slot.",
        linguisticWeights: { cognitiveComplexity: 30, certaintyLanguage: 80, powerLanguage: 90, cloakingScore: 30 }
      },
      {
        id: "5B",
        text: "Hey! I've been following your builds for a while and love your work. Let me know if you ever have 10 minutes for a quick virtual coffee chat!",
        linguisticWeights: { cognitiveComplexity: 15, certaintyLanguage: 25, powerLanguage: 15, cloakingScore: 5 }
      },
      {
        id: "5C",
        text: "Your recent thesis on category design contains interesting structural overlaps with a network logic pattern I am currently researching. Let's exchange insights.",
        linguisticWeights: { cognitiveComplexity: 80, certaintyLanguage: 50, powerLanguage: 40, cloakingScore: 65 }
      }
    ]
  }
];
