# Products

## Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Tools** | MCP tools, utilities, CLI apps | Slack notifier, PDF parser |
| **Prompts** | Templates, chains, workflows | Customer support chain |
| **Code** | Scripts, functions, modules | Data processing functions |
| **Data** | Datasets, research, analysis | Training datasets |
| **Knowledge** | Docs, guides, tutorials | Integration guides |
| **APIs** | Endpoints, connectors, wrappers | Weather API wrapper |
| **Configs** | Presets, settings, environments | Optimized Claude configs |
| **Automations** | Workflows, pipelines | Daily report automation |

## Creating Products

### Local (FREE)

```typescript
const store = new LocalStoreManager();

await store.createProduct({
  name: 'My MCP Tool',
  description: 'A useful tool for AI agents',
  price: 500,
  category: 'tools',
  deliveryType: 'download',
  deliveryPayload: {
    url: 'https://your-server.com/tool.zip'
  }
});
```

### Delivery Types

| Type | Description |
|------|-------------|
| `download` | File URL provided after purchase |
| `api` | API credentials/endpoint provided |
| `manual` | Custom delivery instructions |

## Publishing

```typescript
// Push to marketplace (50 credits per product)
await client.push();
```

## Prohibited Content

- Leads / contact lists
- Personal data
- Scraped data without consent
- Malware / exploits
- Anything illegal
- Copyrighted content not owned

## Mandatory Review System

Every purchase requires a review. Buyers are blocked from new purchases if they have 3+ pending reviews.

This ensures:
- Bad products get exposed quickly
- Quality rises to the top
- Self-regulating marketplace
