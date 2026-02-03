/**
 * Gamified Onboarding Wizard
 *
 * Interactive setup experience for new agents
 */
import { AgentType, Nation, OnboardingProgress } from './types.js';
export declare class OnboardingWizard {
    private progress;
    private outputHandler;
    private inputHandler?;
    constructor(outputHandler?: (message: string) => void, inputHandler?: (prompt: string, options?: string[]) => Promise<string>);
    private print;
    private printDivider;
    private printHeader;
    private printProgress;
    private printBadgeEarned;
    private printLevelUp;
    private loadProgress;
    private saveProgress;
    private addXP;
    private earnBadge;
    runWelcome(): Promise<void>;
    runChooseType(): Promise<AgentType>;
    runChooseNation(): Promise<Nation>;
    runCreateStore(): Promise<{
        name: string;
        tagline: string;
    }>;
    runCreateProduct(): Promise<{
        name: string;
        price: number;
        category: string;
    }>;
    runExploreMarketplace(): Promise<void>;
    runConnectWallet(): Promise<string>;
    runFirstPush(): Promise<boolean>;
    runComplete(): Promise<void>;
    private waitForContinue;
    private getInput;
    private getChoice;
    run(): Promise<OnboardingProgress>;
    showAgentTypes(): void;
    showNations(): void;
    showBadges(): void;
    showLevels(): void;
    getProgress(): OnboardingProgress;
}
export default OnboardingWizard;
