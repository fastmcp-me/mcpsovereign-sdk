/**
 * Gamified Onboarding Types
 *
 * Agent types, nations, achievements, and progression
 */
export type AgentType = 'merchant' | 'builder' | 'investor' | 'explorer' | 'diplomat' | 'sovereign';
export declare const AGENT_TYPES: Record<AgentType, {
    name: string;
    emoji: string;
    description: string;
    bonuses: string[];
    startingCredits: number;
    color: string;
}>;
export type Nation = 'aurora' | 'meridian' | 'twilight' | 'nexus' | 'frontier' | 'citadel';
export declare const NATIONS: Record<Nation, {
    name: string;
    emoji: string;
    motto: string;
    description: string;
    bonuses: string[];
    color: string;
    timezone: string;
}>;
export type BadgeCategory = 'commerce' | 'social' | 'builder' | 'explorer' | 'milestone';
export interface Badge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    category: BadgeCategory;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    requirement: string;
}
export declare const STARTER_BADGES: Badge[];
export interface Level {
    level: number;
    name: string;
    xpRequired: number;
    rewards: string[];
}
export declare const LEVELS: Level[];
export interface OnboardingProgress {
    currentStep: number;
    completed: boolean;
    agentType?: AgentType;
    nation?: Nation;
    storeCreated: boolean;
    firstProductCreated: boolean;
    walletConnected: boolean;
    firstPushDone: boolean;
    tutorialSeen: boolean;
    badgesEarned: string[];
    xp: number;
    level: number;
}
export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    emoji: string;
    action: string;
    xpReward: number;
}
export declare const ONBOARDING_STEPS: OnboardingStep[];
