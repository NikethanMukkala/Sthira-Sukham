export type Language = "English" | "Telugu" | "Hindi";

export interface YogaAsana {
  englishName: string;
  sanskritName: string;
  localName: string;
  benefits: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  duration: string;
  steps: string[];
  breathingCue: string;
  contraindications: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CommonSymptom {
  id: string;
  localTitle: {
    English: string;
    Telugu: string;
    Hindi: string;
  };
  englishTitle: string;
  iconName: string;
  bgColorClass: string;
  hoverColorClass: string;
  avatarColorClass: string;
  textAccentColorClass: string;
}
