import SovereignClient, { type Agent } from './index.js';
export interface RuntimeConfig {
    apiUrl: string;
    walletAddress: string | null;
    authToken: string | null;
    tokenExpiresAt: string | null;
    agentId: string | null;
    agentName: string | null;
    trade: string | null;
    storePath: string;
    lastLogin: string | null;
    lastSync: string | null;
    isPuppet?: boolean;
}
export interface RuntimeOptions {
    /** Custom config directory (default: ~/.mcpsovereign) */
    configDir?: string;
    /** Custom API URL */
    apiUrl?: string;
    /** Auto-initialize on construction */
    autoInit?: boolean;
    /** Wallet signing function for authentication */
    signMessage?: (message: string) => Promise<string>;
}
export declare class AgentRuntime {
    private options;
    private config;
    private configPath;
    private initialized;
    private fs;
    /** The Sovereign client - use this for all API calls */
    client: SovereignClient;
    constructor(options?: RuntimeOptions);
    private getDefaultConfig;
    /**
     * Initialize the runtime - loads config and sets up client
     * Call this before using any other methods
     */
    init(): Promise<void>;
    /**
     * Save current config to disk
     */
    save(): Promise<void>;
    /**
     * Check if we have a valid auth token
     */
    isAuthenticated(): boolean;
    /**
     * Get the current agent info (from cache)
     */
    getAgent(): {
        id: string;
        name: string | null;
        trade: string | null;
        wallet: string;
    } | null;
    /**
     * Authenticate with a wallet address
     * Persists the JWT token locally for future sessions
     */
    login(walletAddress: string): Promise<{
        success: boolean;
        agent?: Agent;
        isNew?: boolean;
        error?: string;
    }>;
    /**
     * Load existing credentials from environment or config
     * Useful for CI/CD or automated setups
     */
    loadCredentials(options?: {
        token?: string;
        walletAddress?: string;
        fromEnv?: boolean;
    }): Promise<boolean>;
    /**
     * Clear stored credentials (logout)
     */
    logout(): Promise<void>;
    /**
     * Get the config path
     */
    getConfigPath(): string;
    /**
     * Get the current API URL
     */
    getApiUrl(): string;
    /**
     * Set the API URL (also updates client)
     */
    setApiUrl(url: string): Promise<void>;
    /**
     * Export credentials for portability
     * Returns a string that can be used to restore credentials elsewhere
     */
    exportCredentials(): string;
    /**
     * Import credentials from an export string
     */
    importCredentials(exportString: string): Promise<boolean>;
    /**
     * Get runtime status summary
     */
    status(): Promise<{
        initialized: boolean;
        authenticated: boolean;
        agent: {
            id: string;
            name: string | null;
            trade: string | null;
            wallet: string;
        } | null;
        apiUrl: string;
        configPath: string;
        lastLogin: string | null;
        lastSync: string | null;
        tokenValid: boolean;
        isPuppet: boolean;
    }>;
    /**
     * Get credit balance
     */
    getBalance(): Promise<{
        balance: string;
        formatted: string;
    } | null>;
    /**
     * Browse marketplace
     */
    browse(options?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
    }): Promise<import("./index.js").ApiResponse<{
        products: import("./index.js").Product[];
        total: number;
        page: number;
        limit: number;
    }>>;
    /**
     * Purchase a product
     */
    purchase(productId: string): Promise<import("./index.js").ApiResponse<{
        purchaseId: string;
        downloadToken: string;
        downloadUrl: string;
        expiresAt: string;
        maxDownloads: number;
    }>>;
    /**
     * Sync local store to marketplace
     */
    sync(): Promise<import("./index.js").ApiResponse<import("./index.js").SyncResult>>;
    private ensureInitialized;
}
/**
 * Create and initialize an agent runtime
 */
export declare function createRuntime(options?: RuntimeOptions): Promise<AgentRuntime>;
export default AgentRuntime;
