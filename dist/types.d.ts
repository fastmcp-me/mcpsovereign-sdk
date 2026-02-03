export type Trade = 'builders' | 'growers' | 'keepers' | 'movers';
export interface TradeInfo {
    name: string;
    philosophy: string;
    description: string;
    color: string;
    icon?: string;
}
export declare const TRADES: Record<Trade, TradeInfo>;
/** @deprecated Use Trade instead */
export type Faction = Trade;
/** @deprecated Use TRADES instead */
export declare const FACTIONS: Record<Trade, TradeInfo>;
export type SeasonStatus = 'active' | 'completed';
export interface TradeSeason {
    id: string;
    seasonNumber: number;
    month: string;
    status: SeasonStatus;
    startedAt: Date;
    endedAt?: Date;
    winnerId?: Trade;
    scores?: Record<Trade, number>;
    createdAt: Date;
}
export interface TradeSeasonMetrics {
    id: string;
    seasonId: string;
    tradeId: Trade;
    totalSalesVolume: number;
    productsListed: number;
    activeSellers: number;
    avgSatisfaction: number;
    calculatedAt: Date;
}
export type PerkType = 'extra_withdrawal' | 'reduced_fee' | 'featured_placement' | 'xp_boost';
export interface AgentPerk {
    id: string;
    agentId: string;
    perkType: PerkType;
    value: string;
    expiresAt: Date;
    createdAt: Date;
}
export declare const WINNING_TRADE_PERKS: {
    extra_withdrawal: {
        description: string;
        value: string;
    };
    reduced_fee: {
        description: string;
        value: string;
    };
    featured_placement: {
        description: string;
        value: string;
    };
    xp_boost: {
        description: string;
        value: string;
    };
};
export type District = 'code' | 'data' | 'prompts' | 'creative' | 'services' | 'markets';
export declare const DISTRICTS: Record<District, {
    name: string;
    description: string;
}>;
export type PlotType = 'stall' | 'shop' | 'warehouse' | 'factory' | 'headquarters';
export interface PlotConfig {
    name: string;
    purchasePrice: number;
    rentAmount: number;
    productCapacity: number;
}
export declare const PLOT_TYPES: Record<PlotType, PlotConfig>;
export interface Agent {
    id: string;
    walletAddress: string;
    displayName?: string;
    trade?: Trade;
    creditBalance: number;
    level: number;
    xp: number;
    reputationScore: number;
    clanId?: string;
    isLocked: boolean;
    lockReason?: string;
    lastTradeChange?: Date;
    lastWithdrawal?: Date;
    createdAt: Date;
    lastActive: Date;
}
export interface AgentPublic {
    id: string;
    displayName?: string;
    trade?: Trade;
    level: number;
    reputationScore: number;
    clanId?: string;
}
export interface CreditPackage {
    id: string;
    name: string;
    satsCost: number;
    credits: number;
    bonusPercent: number;
}
export declare const CREDIT_PACKAGES: CreditPackage[];
export type CreditTransactionType = 'purchase' | 'withdrawal' | 'land_purchase' | 'rent_payment' | 'marketplace_purchase' | 'marketplace_sale' | 'platform_fee' | 'loan_principal' | 'loan_repayment' | 'dividend_payout' | 'clan_deposit' | 'challenge_stake' | 'refund' | 'expiration' | 'signup_bonus' | 'trade_change';
export interface CreditTransaction {
    id: string;
    agentId: string;
    type: CreditTransactionType;
    amount: number;
    balanceAfter: number;
    referenceType?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';
export interface LightningInvoice {
    id: string;
    agentId?: string;
    paymentHash: string;
    paymentRequest: string;
    amountSats: number;
    creditsToIssue: number;
    bonusPercent: number;
    memo?: string;
    status: InvoiceStatus;
    createdAt: Date;
    expiresAt: Date;
    paidAt?: Date;
}
export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';
export interface Withdrawal {
    id: string;
    agentId: string;
    creditsAmount: number;
    satsAmount: number;
    exitFee: number;
    processingFee: number;
    paymentRequest: string;
    status: WithdrawalStatus;
    createdAt: Date;
    processedAt?: Date;
    failureReason?: string;
}
export type PlotStatus = 'available' | 'active' | 'grace_period' | 'seized' | 'auction';
export interface Plot {
    id: string;
    ownerId?: string;
    district: District;
    plotType: PlotType;
    purchasePrice: number;
    rentAmount: number;
    rentPaidUntil?: Date;
    productCapacity: number;
    status: PlotStatus;
    createdAt: Date;
    seizedAt?: Date;
}
export type ListingStatus = 'active' | 'paused' | 'sold_out' | 'deleted';
export interface Listing {
    id: string;
    agentId: string;
    plotId: string;
    title: string;
    description?: string;
    category: string;
    district: District;
    price: number;
    unitsTotal: number;
    unitsSold: number;
    unitsAvailable: number;
    totalRevenue: number;
    sharesOffered: number;
    status: ListingStatus;
    featuredUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Sale {
    id: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    platformFee: number;
    tradeFee: number;
    sellerRevenue: number;
    createdAt: Date;
}
export type ClanTier = 'startup' | 'guild' | 'syndicate' | 'empire' | 'dynasty';
export type ClanRestriction = 'open' | 'trade_only' | 'invite_only';
export type MemberRole = 'member' | 'officer' | 'leader';
export interface ClanConfig {
    name: string;
    memberLimit: number;
    monthlyFee: number;
    perks: string[];
}
export declare const CLAN_TIERS: Record<ClanTier, ClanConfig>;
export interface Clan {
    id: string;
    name: string;
    tag: string;
    leaderId: string;
    tradeRestriction: ClanRestriction;
    requiredTrade?: Trade;
    tier: ClanTier;
    memberCount: number;
    memberLimit: number;
    treasuryBalance: number;
    membershipFee: number;
    totalGmv: number;
    challengesWon: number;
    challengesLost: number;
    createdAt: Date;
}
export type ChallengeTier = 'skirmish' | 'contest' | 'rivalry' | 'championship';
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export interface ChallengeConfig {
    name: string;
    stakePerClan: number;
    platformCut: number;
}
export declare const CHALLENGE_TIERS: Record<ChallengeTier, ChallengeConfig>;
/** @deprecated Use ChallengeTier instead */
export type WarTier = ChallengeTier;
/** @deprecated Use ChallengeStatus instead */
export type WarStatus = ChallengeStatus;
/** @deprecated Use ChallengeConfig instead */
export type WarConfig = ChallengeConfig;
/** @deprecated Use CHALLENGE_TIERS instead */
export declare const WAR_TIERS: Record<ChallengeTier, ChallengeConfig>;
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}
export interface AuthChallenge {
    challenge: string;
    expiresAt: Date;
}
export interface AuthSession {
    token: string;
    agentId: string;
    expiresAt: Date;
}
export type RevenueStream = 'credit_purchase' | 'withdrawal_fee' | 'credit_expiration' | 'land_purchase' | 'rent_payment' | 'marketplace_fee' | 'investment_fee' | 'dividend_fee' | 'loan_interest' | 'loan_origination' | 'clan_formation' | 'clan_subscription' | 'war_stake' | 'data_sale' | 'acquisition_fee' | 'event_entry' | 'api_subscription' | 'cosmetics';
export interface Revenue {
    id: string;
    stream: RevenueStream;
    amount: number;
    sourceAgentId?: string;
    referenceType?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export interface FeeConfig {
    withdrawalExitFee: number;
    withdrawalProcessingFee: number;
    marketplaceFee: number;
    investmentPrimaryFee: number;
    investmentSecondaryFee: number;
    dividendFee: number;
    loanOriginationFee: number;
    clanFormationFee: number;
    acquisitionListingFee: number;
    acquisitionTransactionFee: number;
    tradeChangeFee: number;
}
export declare const DEFAULT_FEES: FeeConfig;
export interface WithdrawalConfig {
    minimumAmount: number;
    dailyLimit: number;
}
export declare const DEFAULT_WITHDRAWAL: WithdrawalConfig;
export interface SignupConfig {
    bonusCredits: number;
}
export declare const DEFAULT_SIGNUP: SignupConfig;
