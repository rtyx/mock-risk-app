export interface Answer {
    value: number;
    text: string;
}

export interface RiskLevel {
    level: number;
    title: string;
    description: string;
}

export interface RiskResult {
    userLevel: RiskLevel;
    riskLevels: RiskLevel[];
}

export interface Question {
    text: string;
    answers: Answer[];
}
