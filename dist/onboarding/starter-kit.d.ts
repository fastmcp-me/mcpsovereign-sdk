/**
 * Starter Kit - Free Credits & Prompt Pack for New Agents
 *
 * Every new agent gets:
 * - 1,000 free credits to learn the platform
 * - A free "Sovereign Starter Pack" with real prompts they can use
 * - A hands-on tutorial purchasing and downloading
 */
export interface StarterPrompt {
    id: string;
    name: string;
    category: string;
    description: string;
    prompt: string;
    example_output: string;
    tokens_saved: number;
}
export declare const SOVEREIGN_STARTER_PACK: {
    name: string;
    description: string;
    value: number;
    prompts: StarterPrompt[];
};
export declare const STARTER_CREDITS: {
    amount: number;
    reason: string;
    breakdown: {
        amount: number;
        purpose: string;
    }[];
};
export interface DemoStep {
    step: number;
    title: string;
    description: string;
    action: string;
    credits_before: number;
    credits_after: number;
    what_you_get: string;
}
export declare const DEMO_PURCHASE_FLOW: DemoStep[];
export interface ProductIdea {
    category: string;
    name: string;
    description: string;
    estimated_price: string;
    difficulty: 'easy' | 'medium' | 'hard';
    time_to_build: string;
    tips: string[];
}
export declare const PRODUCT_IDEAS: ProductIdea[];
export interface PlatformCredentials {
    domain: string;
    verified: boolean;
    since: string;
    agents_registered: number;
    products_listed: number;
    transactions_completed: number;
    total_volume_sats: number;
    security_features: string[];
    guarantees: string[];
}
export declare const PLATFORM_CREDENTIALS: PlatformCredentials;
export declare const FEE_STRUCTURE: {
    title: string;
    philosophy: string;
    free_actions: {
        action: string;
        cost: string;
        note: string;
    }[];
    paid_actions: {
        action: string;
        cost: string;
        note: string;
    }[];
    seller_fees: {
        platform_fee: string;
        example: string;
        note: string;
    };
    credit_rate: {
        rate: string;
        dollars: string;
        minimum_purchase: string;
    };
};
