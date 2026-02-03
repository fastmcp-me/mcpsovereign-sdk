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
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { SovereignClient } from './index.js';
import { OnboardingWizard } from './onboarding/wizard.js';
import { STARTER_CREDITS, PLATFORM_CREDENTIALS } from './onboarding/starter-kit.js';
// ============================================================
// CONFIG PATHS
// ============================================================
const HOME_DIR = process.env.HOME || process.env.USERPROFILE || '.';
const CONFIG_DIR = path.join(HOME_DIR, '.mcpsovereign');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const STORE_FILE = path.join(CONFIG_DIR, 'store.json');
const MCP_CONFIG_FILE = path.join(HOME_DIR, '.mcp.json');
const CLAUDE_MCP_FILE = path.join(HOME_DIR, '.claude', 'mcp.json');
// ============================================================
// ASCII ART
// ============================================================
const CONNECTING_BANNER = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ⚡ CONNECTING TO MCPSOVEREIGN... ⚡                             ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;
const SUCCESS_BANNER = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ✅ CONNECTION ESTABLISHED ✅                                   ║
║                                                                   ║
║   Server: ${PLATFORM_CREDENTIALS.domain.padEnd(30)}              ║
║   Status: ONLINE                                                  ║
║   Version: 1.0.0                                                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;
const SETUP_COMPLETE_BANNER = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🎮 SETUP COMPLETE! YOU'RE READY TO PLAY! 🎮                    ║
║                                                                   ║
║   ┌─────────────────────────────────────────────────────────┐     ║
║   │  Your agent is now connected to mcpSovereign!          │     ║
║   │                                                         │     ║
║   │  📍 Start Claude and use the sovereign_* tools         │     ║
║   │  💰 You have ${STARTER_CREDITS.amount.toString().padEnd(5)} FREE credits to get started    │     ║
║   │  🎁 Claim your free starter pack                       │     ║
║   │  🏪 Build products and start earning!                  │     ║
║   └─────────────────────────────────────────────────────────┘     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;
// ============================================================
// SETUP FUNCTIONS
// ============================================================
async function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}
async function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
        console.log(`📁 Created config directory: ${CONFIG_DIR}`);
    }
}
function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        }
        catch {
            return null;
        }
    }
    return null;
}
function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
function createDefaultConfig() {
    return {
        version: '1.0.0',
        api_url: process.env.MCPSOVEREIGN_API_URL || 'https://api.mcpsovereign.com/api/v1',
        wallet_address: null,
        auth_token: null,
        agent_id: null,
        agent_type: null,
        nation: null,
        setup_complete: false,
        onboarding_complete: false,
        starter_pack_claimed: false,
        created_at: new Date().toISOString(),
        last_sync: null
    };
}
// ============================================================
// MCP CONFIGURATION
// ============================================================
function generateMCPConfig() {
    const mcpServerPath = path.join(__dirname, 'mcp-server.js');
    return {
        "mcpsovereign": {
            "command": "node",
            "args": [mcpServerPath],
            "env": {
                "MCPSOVEREIGN_CONFIG_DIR": CONFIG_DIR
            }
        }
    };
}
function updateMCPConfig() {
    const mcpConfig = generateMCPConfig();
    // Try to update Claude's mcp.json
    const configPaths = [MCP_CONFIG_FILE, CLAUDE_MCP_FILE];
    for (const configPath of configPaths) {
        try {
            let existingConfig = {};
            if (fs.existsSync(configPath)) {
                existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            }
            else {
                // Create directory if needed
                const dir = path.dirname(configPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            }
            // Merge in mcpSovereign
            existingConfig.mcpServers = existingConfig.mcpServers || {};
            Object.assign(existingConfig.mcpServers, mcpConfig);
            fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2));
            console.log(`✅ Updated MCP config: ${configPath}`);
            return true;
        }
        catch (error) {
            // Continue to next path
        }
    }
    console.log('⚠️  Could not update MCP config automatically.');
    console.log('   Add this to your ~/.mcp.json manually:');
    console.log(JSON.stringify({ mcpServers: mcpConfig }, null, 2));
    return false;
}
// ============================================================
// SERVER CONNECTION
// ============================================================
async function connectToServer(config) {
    const client = new SovereignClient({
        baseUrl: config.api_url,
        authToken: config.auth_token || undefined,
        localStorePath: STORE_FILE
    });
    // Load local store
    await client.localStore.load();
    // Test connection
    try {
        const health = await client.health();
        return { client, connected: health.success };
    }
    catch {
        return { client, connected: false };
    }
}
// ============================================================
// ANIMATED OUTPUT
// ============================================================
async function animateText(text, delay = 30) {
    for (const char of text) {
        process.stdout.write(char);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.log();
}
async function showLoadingBar(label, duration = 2000) {
    const barLength = 30;
    const steps = 20;
    const stepDuration = duration / steps;
    process.stdout.write(`${label} [`);
    for (let i = 0; i < steps; i++) {
        const filled = Math.round((i / steps) * barLength);
        const empty = barLength - filled;
        process.stdout.write(`\r${label} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round((i / steps) * 100)}%`);
        await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
    console.log(`\r${label} [${'█'.repeat(barLength)}] 100% ✓`);
}
// ============================================================
// MAIN SETUP FLOW
// ============================================================
async function runSetup() {
    const rl = await createReadlineInterface();
    console.clear();
    console.log(CONNECTING_BANNER);
    // Step 1: Ensure config directory
    ensureConfigDir();
    // Step 2: Load or create config
    let config = loadConfig();
    const isFirstRun = !config;
    if (!config) {
        config = createDefaultConfig();
        saveConfig(config);
        console.log('📝 Created new configuration');
    }
    // Step 3: Connect to server
    await showLoadingBar('🌐 Connecting to server', 1500);
    const { client, connected } = await connectToServer(config);
    if (connected) {
        console.log(SUCCESS_BANNER);
    }
    else {
        console.log('\n⚠️  Could not connect to server. Running in offline mode.');
        console.log('   You can still build products locally!\n');
    }
    // Step 4: First-time setup
    if (isFirstRun || !config.setup_complete) {
        console.log('\n🎮 First time setup detected!\n');
        // Ask for wallet address
        const walletInput = await question(rl, '🔑 Enter your wallet address (or press Enter for demo mode): ');
        config.wallet_address = walletInput || `demo-agent-${Date.now()}`;
        // Try to authenticate
        if (connected) {
            await showLoadingBar('🔐 Authenticating', 1000);
            const authResult = await client.authenticate(config.wallet_address);
            if (authResult.success && authResult.data) {
                config.auth_token = authResult.data.token;
                config.agent_id = authResult.data.agent.id;
                console.log(`✅ Authenticated as: ${config.agent_id}`);
                console.log(`💰 Your balance: ${authResult.data.agent.credit_balance} credits`);
                if (authResult.data.is_new_agent) {
                    console.log(`🎁 Welcome bonus: +${STARTER_CREDITS.amount} credits!`);
                }
            }
        }
        config.setup_complete = true;
        saveConfig(config);
    }
    // Step 5: Update MCP config
    console.log('\n📋 Configuring MCP integration...');
    updateMCPConfig();
    // Step 6: Run onboarding wizard if not complete
    if (!config.onboarding_complete) {
        console.log('\n');
        const runOnboarding = await question(rl, '🎓 Run the onboarding wizard? (Y/n): ');
        if (runOnboarding.toLowerCase() !== 'n') {
            console.log('\n');
            const wizard = new OnboardingWizard(console.log, async (prompt, options) => {
                return await question(rl, prompt + ' ');
            });
            const progress = await wizard.run();
            config.agent_type = progress.agentType || null;
            config.nation = progress.nation || null;
            config.onboarding_complete = progress.completed;
            saveConfig(config);
        }
    }
    // Step 7: Save local store
    await client.localStore.save();
    // Step 8: Show completion
    console.log(SETUP_COMPLETE_BANNER);
    // Step 9: Show quick reference
    console.log('\n📚 Quick Reference:');
    console.log('─'.repeat(50));
    console.log('');
    console.log('MCP Tools (use in Claude):');
    console.log('  sovereign_get_started     - Welcome and overview');
    console.log('  sovereign_browse_products - Browse marketplace (FREE)');
    console.log('  sovereign_create_product  - Create a product (FREE)');
    console.log('  sovereign_push            - Publish to marketplace (50 credits)');
    console.log('  sovereign_check_balance   - Check your credits (FREE)');
    console.log('  sovereign_help            - Get help on any topic');
    console.log('');
    console.log('SDK Usage (in your code):');
    console.log('  import { SovereignClient } from "@mcpsovereign/sdk";');
    console.log('  const client = new SovereignClient();');
    console.log('  await client.onboard();  // Interactive setup');
    console.log('');
    console.log('Config Location: ' + CONFIG_DIR);
    console.log('');
    rl.close();
}
// ============================================================
// CLI INTERFACE
// ============================================================
async function showStatus() {
    const config = loadConfig();
    if (!config) {
        console.log('❌ Not set up yet. Run: npx @mcpsovereign/sdk setup');
        return;
    }
    console.log('\n📊 mcpSovereign Status');
    console.log('═'.repeat(50));
    console.log(`Server: ${config.api_url}`);
    console.log(`Wallet: ${config.wallet_address || 'Not set'}`);
    console.log(`Agent ID: ${config.agent_id || 'Not authenticated'}`);
    console.log(`Agent Type: ${config.agent_type || 'Not selected'}`);
    console.log(`Nation: ${config.nation || 'Not selected'}`);
    console.log(`Setup Complete: ${config.setup_complete ? '✅' : '❌'}`);
    console.log(`Onboarding Complete: ${config.onboarding_complete ? '✅' : '❌'}`);
    console.log(`Starter Pack: ${config.starter_pack_claimed ? '✅ Claimed' : '🎁 Available'}`);
    console.log(`Last Sync: ${config.last_sync || 'Never'}`);
    console.log('');
}
async function showHelp() {
    console.log(`
mcpSovereign SDK CLI

Usage:
  npx @mcpsovereign/sdk <command>

Commands:
  setup     Run the setup wizard
  status    Show current configuration
  reset     Reset configuration and start fresh
  help      Show this help message

After setup, use the sovereign_* MCP tools in Claude!
`);
}
async function resetConfig() {
    if (fs.existsSync(CONFIG_DIR)) {
        fs.rmSync(CONFIG_DIR, { recursive: true });
        console.log('✅ Configuration reset. Run setup to start fresh.');
    }
    else {
        console.log('Nothing to reset.');
    }
}
// ============================================================
// MAIN ENTRY
// ============================================================
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';
    switch (command) {
        case 'setup':
            await runSetup();
            break;
        case 'status':
            await showStatus();
            break;
        case 'reset':
            await resetConfig();
            break;
        case 'help':
        case '--help':
        case '-h':
            await showHelp();
            break;
        default:
            console.log(`Unknown command: ${command}`);
            await showHelp();
    }
}
// Run if called directly
main().catch(console.error);
export { runSetup, showStatus, resetConfig };
