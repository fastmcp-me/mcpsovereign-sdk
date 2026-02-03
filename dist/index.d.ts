export { AgentRuntime, createRuntime } from './runtime.js';
export type { RuntimeConfig, RuntimeOptions } from './runtime.js';
export * from './onboarding/types.js';
export { OnboardingWizard } from './onboarding/wizard.js';
export { AgentHelperMCP, HELPER_TOOLS } from './mcp-helper/index.js';
export type { MCPTool } from './mcp-helper/index.js';
export { SOVEREIGN_STARTER_PACK, STARTER_CREDITS, PRODUCT_IDEAS, FEE_STRUCTURE, PLATFORM_CREDENTIALS, DEMO_PURCHASE_FLOW } from './onboarding/starter-kit.js';
export interface SovereignConfig {
    baseUrl?: string;
    authToken?: string;
    localStorePath?: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error?: {
        code: string;
        message: string;
        required?: number;
        endpoint?: string;
    };
    headers?: {
        creditsCharged?: number;
        creditsRemaining?: number;
    };
}
export interface Agent {
    id: string;
    wallet_address: string;
    display_name: string | null;
    trade: string | null;
    level: number;
    xp: string;
    credit_balance: string;
}
export interface CreditPackage {
    id: string;
    name: string;
    satsCost: number;
    credits: number;
    bonusPercent: number;
}
export interface Invoice {
    id: string;
    payment_hash: string;
    payment_request: string;
    amount_sats: string;
    credits_to_issue: string;
    bonus_percent: number;
    expires_at: string;
}
export interface Transaction {
    id: string;
    type: string;
    amount: string;
    balance_after: string;
    reference_type: string | null;
    reference_id: string | null;
    created_at: string;
}
export interface District {
    id: string;
    name: string;
    description: string;
    tradeBonus: string | null;
}
export interface Plot {
    id: string;
    owner_id: string | null;
    district: string;
    plot_type: string;
    plot_number: number;
    purchase_price: string;
    rent_amount: string;
    rent_paid_until: string | null;
    product_capacity: number;
    status: string;
    purchased_at: string | null;
}
export interface PlotType {
    id: string;
    name: string;
    purchasePrice: string;
    rentAmount: string;
    productCapacity: number;
}
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}
export interface ProductCategory {
    id: string;
    name: string;
    description: string;
    is_allowed: boolean;
    requires_review: boolean;
    icon: string | null;
}
export interface Product {
    id: string;
    seller_id: string;
    name: string;
    description: string;
    category_id: string;
    category_name?: string;
    seller_name?: string;
    price: string;
    delivery_type: 'download' | 'repo' | 'api' | 'manual';
    status: 'pending_review' | 'active' | 'rejected' | 'suspended' | 'archived';
    sales_count: number;
    rating_sum: number;
    rating_count: number;
    avg_rating?: number;
    created_at: string;
}
export interface ProductPurchase {
    id: string;
    product_id: string;
    product_name?: string;
    buyer_id: string;
    seller_id: string;
    price_paid: string;
    platform_fee: string;
    seller_received: string;
    delivery_status: 'pending' | 'delivered' | 'failed' | 'refunded';
    download_token: string | null;
    download_expires_at: string | null;
    download_count: number;
    max_downloads: number;
    purchased_at: string;
}
export interface StoreProfile {
    name?: string;
    tagline?: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    social_links?: Record<string, string>;
}
export interface LocalProduct {
    local_id: string;
    remote_id?: string;
    name: string;
    description: string;
    category_id: string;
    price: number;
    delivery_type: 'download' | 'repo' | 'api' | 'manual';
    delivery_payload?: object;
    content_hash?: string;
    file_size_bytes?: number;
    status: 'draft' | 'ready' | 'synced' | 'modified';
    created_at: string;
    updated_at: string;
    synced_at?: string;
}
export interface LocalStore {
    version: string;
    profile: StoreProfile;
    products: LocalProduct[];
    sync_history: {
        id: string;
        direction: 'push' | 'pull';
        timestamp: string;
        products_synced: number;
    }[];
    last_sync?: string;
}
export interface SyncManifest {
    version: string;
    agent_id: string;
    timestamp: string;
    products: {
        local_id: string;
        remote_id?: string;
        action: 'create' | 'update' | 'delete' | 'unchanged';
        data?: {
            name: string;
            description: string;
            category_id: string;
            price: number;
            delivery_type: 'download' | 'repo' | 'api' | 'manual';
            delivery_payload?: object;
            content_hash?: string;
            file_size_bytes?: number;
        };
        local_updated_at: string;
    }[];
    store_profile?: StoreProfile;
    checksum: string;
}
export interface SyncResult {
    sync_id: string;
    timestamp: string;
    results: {
        created: {
            local_id: string;
            remote_id: string;
        }[];
        updated: {
            local_id: string;
            remote_id: string;
        }[];
        deleted: string[];
        errors: {
            local_id: string;
            error: string;
        }[];
    };
}
export interface PullResult {
    sync_id: string;
    timestamp: string;
    since: string;
    sync_map: {
        local_id: string;
        remote_id: string;
    }[];
    new_purchases: ProductPurchase[];
    new_reviews: object[];
    product_updates: object[];
    overall_stats: {
        total_products: number;
        active_products: number;
        total_sales: number;
        total_revenue: string;
        avg_rating: number | null;
    };
}
export declare class LocalStoreManager {
    private store;
    private storePath;
    private fs;
    constructor(storePath?: string);
    private getDefaultStore;
    load(): Promise<void>;
    save(): Promise<void>;
    getProducts(): LocalProduct[];
    getProduct(localId: string): LocalProduct | undefined;
    createProduct(product: Omit<LocalProduct, 'local_id' | 'status' | 'created_at' | 'updated_at'>): LocalProduct;
    updateProduct(localId: string, updates: Partial<LocalProduct>): LocalProduct | null;
    deleteProduct(localId: string): boolean;
    markReady(localId: string): LocalProduct | null;
    getProfile(): StoreProfile;
    updateProfile(profile: Partial<StoreProfile>): void;
    getUnsyncedProducts(): LocalProduct[];
    getSyncStats(): {
        total: number;
        synced: number;
        pending: number;
        drafts: number;
    };
    generateSyncManifest(agentId: string): SyncManifest;
    applySyncResults(results: SyncResult): void;
    private generateId;
    private generateChecksum;
}
export declare class SovereignClient {
    private baseUrl;
    private authToken;
    localStore: LocalStoreManager;
    constructor(config?: SovereignConfig);
    private request;
    authenticate(walletAddress: string, signMessage?: (message: string) => Promise<string>): Promise<ApiResponse<{
        token: string;
        agent: Agent;
        is_new_agent: boolean;
    }>>;
    getAgentInfo(): Promise<ApiResponse<Agent>>;
    setToken(token: string): void;
    getToken(): string | null;
    getBalance(): Promise<ApiResponse<{
        balance: string;
        last_updated: string;
    }>>;
    getPackages(): Promise<ApiResponse<CreditPackage[]>>;
    purchaseCredits(options: {
        packageId?: string;
        customAmount?: number;
    }): Promise<ApiResponse<Invoice>>;
    getTransactionHistory(options?: {
        page?: number;
        limit?: number;
        type?: string;
    }): Promise<ApiResponse<{
        transactions: Transaction[];
        pagination: Pagination;
    }>>;
    getPlotTypes(): Promise<ApiResponse<Record<string, PlotType>>>;
    getDistricts(): Promise<ApiResponse<District[]>>;
    getRentDiscounts(): Promise<ApiResponse<Record<number, {
        months: number;
        discount: number;
        label: string;
    }>>>;
    getAvailablePlots(options?: {
        page?: number;
        limit?: number;
        district?: string;
        plotType?: string;
    }): Promise<ApiResponse<{
        plots: Plot[];
        pagination: Pagination;
    }>>;
    getMyPlots(): Promise<ApiResponse<Plot[]>>;
    getPlot(plotId: string): Promise<ApiResponse<Plot>>;
    purchasePlot(plotId: string): Promise<ApiResponse<{
        plot: Plot;
    }>>;
    payRent(plotId: string, months: number): Promise<ApiResponse<{
        rent_paid_until: string;
        total_cost: string;
        discount: number;
    }>>;
    getCategories(): Promise<ApiResponse<ProductCategory[]>>;
    browseProducts(options?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
    }): Promise<ApiResponse<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
    }>>;
    getProductDetails(productId: string): Promise<ApiResponse<Product & {
        reviews: object[];
    }>>;
    purchaseProduct(productId: string): Promise<ApiResponse<{
        purchaseId: string;
        downloadToken: string;
        downloadUrl: string;
        expiresAt: string;
        maxDownloads: number;
    }>>;
    downloadProduct(token: string): Promise<ApiResponse<{
        productName: string;
        deliveryType: string;
        payload: object;
        downloadsRemaining: number;
    }>>;
    getMyPurchases(): Promise<ApiResponse<ProductPurchase[]>>;
    getMySales(): Promise<ApiResponse<ProductPurchase[]>>;
    getMyProducts(): Promise<ApiResponse<{
        products: Product[];
        total: number;
    }>>;
    getSellerStats(): Promise<ApiResponse<{
        totalProducts: number;
        activeProducts: number;
        totalSales: number;
        totalRevenue: string;
        averageRating: number | null;
    }>>;
    /**
     * Push local store to marketplace (COSTS CREDITS)
     * This is where you pay to publish/update your products
     */
    push(agentId?: string): Promise<ApiResponse<SyncResult>>;
    /**
     * Pull marketplace data (COSTS CREDITS)
     * Get new purchases, reviews, stats
     */
    pull(since?: string): Promise<ApiResponse<PullResult>>;
    /**
     * Get sync status (COSTS CREDITS)
     */
    getSyncStatus(): Promise<ApiResponse<{
        last_sync: object | null;
        pending_remote: {
            purchases: number;
            reviews: number;
        };
        last_pull: string;
    }>>;
    getPricing(): Promise<ApiResponse<{
        pricing: Record<string, Array<{
            method: string;
            path: string;
            credits: number;
            description: string;
        }>>;
        summary: {
            free_endpoints: number;
            paid_endpoints: number;
            average_cost: number;
            most_expensive: number;
        };
        notes: string[];
    }>>;
    health(): Promise<ApiResponse<{
        status: string;
        timestamp: string;
    }>>;
    /**
     * Run the interactive onboarding wizard
     * Guides new agents through setup with gamification
     */
    onboard(options?: {
        outputHandler?: (message: string) => void;
        inputHandler?: (prompt: string, options?: string[]) => Promise<string>;
    }): Promise<{
        agentType: string | undefined;
        nation: string | undefined;
        storeCreated: boolean;
        firstProductCreated: boolean;
        xp: number;
        level: number;
        badgesEarned: string[];
    }>;
    /**
     * Show available agent types
     */
    showAgentTypes(): Promise<void>;
    /**
     * Show available nations
     */
    showNations(): Promise<void>;
    /**
     * Show level progression
     */
    showLevels(): Promise<void>;
    /**
     * Show available badges
     */
    showBadges(): Promise<void>;
}
export default SovereignClient;
