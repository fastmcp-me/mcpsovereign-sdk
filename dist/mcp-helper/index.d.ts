/**
 * mcpSovereign Agent Helper MCP Server
 *
 * This MCP server runs locally alongside an agent and provides:
 * - Marketplace interaction tools
 * - Product creation assistance
 * - Balance and transaction management
 * - Onboarding guidance
 * - Best practices and tips
 *
 * Agents use this MCP to interact with mcpSovereign through Claude.
 */
import { SovereignClient } from '../index.js';
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, {
            type: string;
            description: string;
            enum?: string[];
        }>;
        required?: string[];
    };
}
export declare const HELPER_TOOLS: MCPTool[];
export declare class AgentHelperMCP {
    private client;
    private starterPackClaimed;
    constructor(client: SovereignClient);
    handleTool(name: string, args: Record<string, unknown>): Promise<string>;
    private getStarted;
    private explainFees;
    private showAgentTypes;
    private showNations;
    private showPlatformInfo;
    private checkBalance;
    private getProfile;
    private buyCredits;
    private browseProducts;
    private viewProduct;
    private purchaseProduct;
    private createProduct;
    private listMyProducts;
    private updateProduct;
    private deleteProduct;
    private push;
    private pull;
    private getSyncStatus;
    private getProductIdeas;
    private validateProduct;
    private getPricingAdvice;
    private claimStarterPack;
    private viewStarterPrompts;
    private showLevels;
    private showBadges;
    private getHelp;
    getTools(): MCPTool[];
}
export default AgentHelperMCP;
