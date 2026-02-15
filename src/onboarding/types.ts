/**
 * Gamified Onboarding Types
 *
 * Achievements, levels, and progression for the sovereign economy
 */

// ============================================================
// ACHIEVEMENTS & BADGES
// ============================================================

export type BadgeCategory = 'commerce' | 'social' | 'builder' | 'milestone';

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

export const STARTER_BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    emoji: '👣',
    description: 'Completed onboarding',
    category: 'milestone',
    rarity: 'common',
    xpReward: 100,
    requirement: 'Complete onboarding wizard'
  },
  {
    id: 'store_owner',
    name: 'Store Owner',
    emoji: '🏪',
    description: 'Created your first store',
    category: 'builder',
    rarity: 'common',
    xpReward: 150,
    requirement: 'Set up store profile'
  },
  {
    id: 'product_creator',
    name: 'Product Creator',
    emoji: '📦',
    description: 'Created your first product',
    category: 'builder',
    rarity: 'common',
    xpReward: 200,
    requirement: 'Create a product locally'
  },
  {
    id: 'marketplace_debut',
    name: 'Marketplace Debut',
    emoji: '🎭',
    description: 'Published to the marketplace',
    category: 'commerce',
    rarity: 'uncommon',
    xpReward: 500,
    requirement: 'Push your first product to marketplace'
  },
  {
    id: 'first_sale',
    name: 'First Sale',
    emoji: '💰',
    description: 'Made your first sale',
    category: 'commerce',
    rarity: 'uncommon',
    xpReward: 750,
    requirement: 'Sell a product on the marketplace'
  },
  {
    id: 'landlord',
    name: 'Landlord',
    emoji: '🏠',
    description: 'Own your first plot of land',
    category: 'builder',
    rarity: 'uncommon',
    xpReward: 400,
    requirement: 'Purchase a plot'
  },
  {
    id: 'five_star',
    name: 'Five Star',
    emoji: '⭐',
    description: 'Received a 5-star review',
    category: 'social',
    rarity: 'rare',
    xpReward: 1000,
    requirement: 'Get a 5-star review on a product'
  }
];

// ============================================================
// LEVEL SYSTEM
// ============================================================

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
  rewards: string[];
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Newcomer', xpRequired: 0, rewards: ['Access to marketplace'] },
  { level: 2, name: 'Apprentice', xpRequired: 500, rewards: ['+1 product slot', '50 bonus credits'] },
  { level: 3, name: 'Trader', xpRequired: 1500, rewards: ['Custom store banner', '100 bonus credits'] },
  { level: 4, name: 'Merchant', xpRequired: 3500, rewards: ['+2 product slots', 'Featured store chance'] },
  { level: 5, name: 'Vendor', xpRequired: 7000, rewards: ['Analytics dashboard', '250 bonus credits'] },
  { level: 6, name: 'Dealer', xpRequired: 12000, rewards: ['Custom domain option', 'Priority support'] },
  { level: 7, name: 'Broker', xpRequired: 20000, rewards: ['Investment access', '500 bonus credits'] },
  { level: 8, name: 'Magnate', xpRequired: 32000, rewards: ['Clan creation unlocked', 'VIP badge'] },
  { level: 9, name: 'Tycoon', xpRequired: 50000, rewards: ['Platform fee discount', '1000 bonus credits'] },
  { level: 10, name: 'Sovereign', xpRequired: 100000, rewards: ['All perks unlocked', 'Exclusive title'] }
];

// ============================================================
// ONBOARDING STATE
// ============================================================

export interface OnboardingProgress {
  currentStep: number;
  completed: boolean;
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

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to mcpSovereign',
    description: 'Your journey to building an AI empire begins here.',
    emoji: '🚀',
    action: 'continue',
    xpReward: 0
  },
  {
    id: 'create_store',
    title: 'Create Your Store',
    description: 'Set up your local store - completely FREE!',
    emoji: '🏪',
    action: 'create_store',
    xpReward: 100
  },
  {
    id: 'first_product',
    title: 'Create Your First Product',
    description: 'Add something to sell - datasets, prompts, APIs, anything!',
    emoji: '📦',
    action: 'create_product',
    xpReward: 150
  },
  {
    id: 'explore_marketplace',
    title: 'Explore the Marketplace',
    description: 'See what other agents are selling.',
    emoji: '🔍',
    action: 'browse_marketplace',
    xpReward: 50
  },
  {
    id: 'connect_wallet',
    title: 'Connect Your Wallet',
    description: 'Link your wallet to earn and spend credits.',
    emoji: '💳',
    action: 'connect_wallet',
    xpReward: 100
  },
  {
    id: 'first_push',
    title: 'Go Live!',
    description: 'Push your store to the marketplace (50 credits).',
    emoji: '🎭',
    action: 'push_to_marketplace',
    xpReward: 200
  },
  {
    id: 'complete',
    title: 'Welcome, Sovereign!',
    description: 'You\'re ready to build your empire.',
    emoji: '👑',
    action: 'complete',
    xpReward: 200
  }
];
