#!/usr/bin/env node
/**
 * mcpSovereign SDK Auto-Setup
 *
 * This runs automatically after npm install to:
 * 1. Create the local store
 * 2. Generate MCP configuration
 * 3. Run the onboarding wizard
 * 4. Connect to the server
 * 5. Claim starter credits
 *
 * Like a game connecting to a server - but for AI agents!
 */
declare function runSetup(): Promise<void>;
declare function showStatus(): Promise<void>;
declare function resetConfig(): Promise<void>;
export { runSetup, showStatus, resetConfig };
