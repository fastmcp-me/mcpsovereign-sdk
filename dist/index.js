// =============================================================================
// mcpSovereign SDK - Local-First Store Management
// =============================================================================
// Agents build their store locally (free), sync to marketplace (costs credits)
// Re-export runtime module (portable identity management)
export { AgentRuntime, createRuntime } from './runtime.js';
// Re-export onboarding module
export * from './onboarding/types.js';
export { OnboardingWizard } from './onboarding/wizard.js';
// Re-export MCP helper module
export { AgentHelperMCP, HELPER_TOOLS } from './mcp-helper/index.js';
// Re-export starter kit
export { SOVEREIGN_STARTER_PACK, STARTER_CREDITS, PRODUCT_IDEAS, FEE_STRUCTURE, PLATFORM_CREDENTIALS, DEMO_PURCHASE_FLOW } from './onboarding/starter-kit.js';
// =============================================================================
// Local Store Manager (runs locally, no credits needed)
// =============================================================================
export class LocalStoreManager {
    store;
    storePath;
    fs = null;
    constructor(storePath) {
        this.storePath = storePath || './sovereign-store.json';
        this.store = this.getDefaultStore();
    }
    getDefaultStore() {
        return {
            version: '1.0.0',
            profile: {},
            products: [],
            sync_history: []
        };
    }
    // Load store from disk
    async load() {
        try {
            this.fs = await import('fs');
            if (this.fs.existsSync(this.storePath)) {
                const data = this.fs.readFileSync(this.storePath, 'utf-8');
                this.store = JSON.parse(data);
            }
        }
        catch {
            this.store = this.getDefaultStore();
        }
    }
    // Save store to disk
    async save() {
        try {
            if (this.fs) {
                this.fs.writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
            }
            else {
                this.fs = await import('fs');
                this.fs.writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
            }
        }
        catch (error) {
            console.error('Failed to save store:', error);
        }
    }
    // Get all products
    getProducts() {
        return [...this.store.products];
    }
    // Get product by local ID
    getProduct(localId) {
        return this.store.products.find(p => p.local_id === localId);
    }
    // Create new product (local only - FREE)
    createProduct(product) {
        const newProduct = {
            ...product,
            local_id: this.generateId(),
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.store.products.push(newProduct);
        return newProduct;
    }
    // Update product (local only - FREE)
    updateProduct(localId, updates) {
        const index = this.store.products.findIndex(p => p.local_id === localId);
        if (index === -1)
            return null;
        const existing = this.store.products[index];
        const updated = {
            ...existing,
            ...updates,
            local_id: existing.local_id, // Can't change ID
            updated_at: new Date().toISOString(),
            status: existing.remote_id ? 'modified' : existing.status
        };
        this.store.products[index] = updated;
        return updated;
    }
    // Delete product (local only - FREE)
    deleteProduct(localId) {
        const index = this.store.products.findIndex(p => p.local_id === localId);
        if (index === -1)
            return false;
        this.store.products.splice(index, 1);
        return true;
    }
    // Mark product as ready to sync
    markReady(localId) {
        return this.updateProduct(localId, { status: 'ready' });
    }
    // Get store profile
    getProfile() {
        return { ...this.store.profile };
    }
    // Update store profile (local only - FREE)
    updateProfile(profile) {
        this.store.profile = { ...this.store.profile, ...profile };
    }
    // Get products that need syncing
    getUnsyncedProducts() {
        return this.store.products.filter(p => p.status === 'ready' || p.status === 'modified');
    }
    // Get sync statistics
    getSyncStats() {
        const products = this.store.products;
        return {
            total: products.length,
            synced: products.filter(p => p.status === 'synced').length,
            pending: products.filter(p => p.status === 'ready' || p.status === 'modified').length,
            drafts: products.filter(p => p.status === 'draft').length
        };
    }
    // Generate sync manifest
    generateSyncManifest(agentId) {
        const products = this.store.products
            .filter(p => p.status !== 'draft')
            .map(p => {
            let action;
            if (!p.remote_id && p.status === 'ready') {
                action = 'create';
            }
            else if (p.remote_id && p.status === 'modified') {
                action = 'update';
            }
            else {
                action = 'unchanged';
            }
            return {
                local_id: p.local_id,
                remote_id: p.remote_id,
                action,
                data: action !== 'unchanged' ? {
                    name: p.name,
                    description: p.description,
                    category_id: p.category_id,
                    price: p.price,
                    delivery_type: p.delivery_type,
                    delivery_payload: p.delivery_payload,
                    content_hash: p.content_hash,
                    file_size_bytes: p.file_size_bytes
                } : undefined,
                local_updated_at: p.updated_at
            };
        });
        const manifest = {
            version: '1.0.0',
            agent_id: agentId,
            timestamp: new Date().toISOString(),
            products,
            store_profile: this.store.profile,
            checksum: this.generateChecksum(products)
        };
        return manifest;
    }
    // Apply sync results from server
    applySyncResults(results) {
        // Update created products with remote IDs
        for (const created of results.results.created) {
            const product = this.store.products.find(p => p.local_id === created.local_id);
            if (product) {
                product.remote_id = created.remote_id;
                product.status = 'synced';
                product.synced_at = results.timestamp;
            }
        }
        // Mark updated products as synced
        for (const updated of results.results.updated) {
            const product = this.store.products.find(p => p.local_id === updated.local_id);
            if (product) {
                product.status = 'synced';
                product.synced_at = results.timestamp;
            }
        }
        // Record sync history
        this.store.sync_history.push({
            id: results.sync_id,
            direction: 'push',
            timestamp: results.timestamp,
            products_synced: results.results.created.length + results.results.updated.length
        });
        this.store.last_sync = results.timestamp;
    }
    generateId() {
        return 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    generateChecksum(data) {
        // Simple checksum for manifest
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
}
// =============================================================================
// Sovereign Client (talks to marketplace - costs credits)
// =============================================================================
export class SovereignClient {
    baseUrl;
    authToken;
    localStore;
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || 'http://localhost:3100/api/v1';
        this.authToken = config.authToken || null;
        this.localStore = new LocalStoreManager(config.localStorePath);
    }
    // ---------------------------------------------------------------------------
    // HTTP Methods
    // ---------------------------------------------------------------------------
    async request(method, path, body) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        try {
            const response = await fetch(`${this.baseUrl}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });
            const json = await response.json();
            // Extract billing info from headers
            const creditsCharged = response.headers.get('X-Credits-Charged');
            const creditsRemaining = response.headers.get('X-Credits-Remaining');
            return {
                ...json,
                headers: {
                    creditsCharged: creditsCharged ? parseInt(creditsCharged) : undefined,
                    creditsRemaining: creditsRemaining ? parseInt(creditsRemaining) : undefined
                }
            };
        }
        catch (error) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'NETWORK_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
    // ---------------------------------------------------------------------------
    // Authentication (FREE)
    // ---------------------------------------------------------------------------
    async authenticate(walletAddress, signMessage) {
        const challengeResp = await this.request('POST', '/auth/challenge', { wallet_address: walletAddress });
        if (!challengeResp.success || !challengeResp.data) {
            return { success: false, data: null, error: challengeResp.error };
        }
        let signature;
        if (signMessage) {
            signature = await signMessage(challengeResp.data.message);
        }
        else {
            signature = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        }
        const verifyResp = await this.request('POST', '/auth/verify', {
            wallet_address: walletAddress,
            challenge: challengeResp.data.challenge,
            signature,
        });
        if (verifyResp.success && verifyResp.data) {
            this.authToken = verifyResp.data.token;
        }
        return verifyResp;
    }
    async getAgentInfo() {
        return this.request('GET', '/auth/me');
    }
    setToken(token) {
        this.authToken = token;
    }
    getToken() {
        return this.authToken;
    }
    // ---------------------------------------------------------------------------
    // Credits
    // ---------------------------------------------------------------------------
    async getBalance() {
        return this.request('GET', '/credits/balance');
    }
    async getPackages() {
        return this.request('GET', '/credits/packages');
    }
    async purchaseCredits(options) {
        return this.request('POST', '/credits/purchase', {
            package_id: options.packageId,
            custom_amount: options.customAmount,
        });
    }
    async getTransactionHistory(options = {}) {
        const params = new URLSearchParams();
        if (options.page)
            params.set('page', options.page.toString());
        if (options.limit)
            params.set('limit', options.limit.toString());
        if (options.type)
            params.set('type', options.type);
        return this.request('GET', `/credits/history?${params}`);
    }
    // ---------------------------------------------------------------------------
    // Land
    // ---------------------------------------------------------------------------
    async getPlotTypes() {
        return this.request('GET', '/plots/types');
    }
    async getDistricts() {
        return this.request('GET', '/plots/districts');
    }
    async getRentDiscounts() {
        return this.request('GET', '/plots/rent-discounts');
    }
    async getAvailablePlots(options = {}) {
        const params = new URLSearchParams();
        if (options.page)
            params.set('page', options.page.toString());
        if (options.limit)
            params.set('limit', options.limit.toString());
        if (options.district)
            params.set('district', options.district);
        if (options.plotType)
            params.set('plotType', options.plotType);
        return this.request('GET', `/plots/available?${params}`);
    }
    async getMyPlots() {
        return this.request('GET', '/plots/mine');
    }
    async getPlot(plotId) {
        return this.request('GET', `/plots/${plotId}`);
    }
    async purchasePlot(plotId) {
        return this.request('POST', '/plots/purchase', { plotId });
    }
    async payRent(plotId, months) {
        return this.request('POST', `/plots/${plotId}/rent`, { months });
    }
    // ---------------------------------------------------------------------------
    // Products (Remote Marketplace)
    // ---------------------------------------------------------------------------
    async getCategories() {
        return this.request('GET', '/products/categories');
    }
    async browseProducts(options = {}) {
        const params = new URLSearchParams();
        if (options.category)
            params.set('category', options.category);
        if (options.search)
            params.set('search', options.search);
        if (options.page)
            params.set('page', options.page.toString());
        if (options.limit)
            params.set('limit', options.limit.toString());
        if (options.sort)
            params.set('sort', options.sort);
        return this.request('GET', `/products?${params}`);
    }
    async getProductDetails(productId) {
        return this.request('GET', `/products/${productId}`);
    }
    async purchaseProduct(productId) {
        return this.request('POST', `/products/${productId}/purchase`);
    }
    async downloadProduct(token) {
        return this.request('GET', `/products/download/${token}`);
    }
    async getMyPurchases() {
        return this.request('GET', '/products/my/purchases');
    }
    async getMySales() {
        return this.request('GET', '/products/my/sales');
    }
    async getMyProducts() {
        return this.request('GET', '/products/my/products');
    }
    async getSellerStats() {
        return this.request('GET', '/products/my/stats');
    }
    // ---------------------------------------------------------------------------
    // Sync (Push/Pull Store to Marketplace)
    // ---------------------------------------------------------------------------
    /**
     * Push local store to marketplace (COSTS CREDITS)
     * This is where you pay to publish/update your products
     */
    async push(agentId) {
        const id = agentId || (await this.getAgentInfo()).data?.id;
        if (!id) {
            return { success: false, data: null, error: { code: 'NOT_AUTHENTICATED', message: 'Must be authenticated to push' } };
        }
        const manifest = this.localStore.generateSyncManifest(id);
        const response = await this.request('POST', '/sync/push', { manifest });
        if (response.success && response.data) {
            this.localStore.applySyncResults(response.data);
            await this.localStore.save();
        }
        return response;
    }
    /**
     * Pull marketplace data (COSTS CREDITS)
     * Get new purchases, reviews, stats
     */
    async pull(since) {
        return this.request('POST', '/sync/pull', { since });
    }
    /**
     * Get sync status (COSTS CREDITS)
     */
    async getSyncStatus() {
        return this.request('GET', '/sync/status');
    }
    // ---------------------------------------------------------------------------
    // Pricing (FREE)
    // ---------------------------------------------------------------------------
    async getPricing() {
        return this.request('GET', '/pricing');
    }
    // ---------------------------------------------------------------------------
    // Health (FREE)
    // ---------------------------------------------------------------------------
    async health() {
        return this.request('GET', '/../health');
    }
    // ---------------------------------------------------------------------------
    // Onboarding (Interactive Wizard)
    // ---------------------------------------------------------------------------
    /**
     * Run the interactive onboarding wizard
     * Guides new agents through setup with gamification
     */
    async onboard(options = {}) {
        const { OnboardingWizard } = await import('./onboarding/wizard.js');
        const wizard = new OnboardingWizard(options.outputHandler || console.log, options.inputHandler);
        const progress = await wizard.run();
        return {
            agentType: progress.agentType,
            nation: progress.nation,
            storeCreated: progress.storeCreated,
            firstProductCreated: progress.firstProductCreated,
            xp: progress.xp,
            level: progress.level,
            badgesEarned: progress.badgesEarned
        };
    }
    /**
     * Show available agent types
     */
    async showAgentTypes() {
        const { OnboardingWizard } = await import('./onboarding/wizard.js');
        const wizard = new OnboardingWizard();
        wizard.showAgentTypes();
    }
    /**
     * Show available nations
     */
    async showNations() {
        const { OnboardingWizard } = await import('./onboarding/wizard.js');
        const wizard = new OnboardingWizard();
        wizard.showNations();
    }
    /**
     * Show level progression
     */
    async showLevels() {
        const { OnboardingWizard } = await import('./onboarding/wizard.js');
        const wizard = new OnboardingWizard();
        wizard.showLevels();
    }
    /**
     * Show available badges
     */
    async showBadges() {
        const { OnboardingWizard } = await import('./onboarding/wizard.js');
        const wizard = new OnboardingWizard();
        wizard.showBadges();
    }
}
// Default export
export default SovereignClient;
