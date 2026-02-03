# API Reference

## LocalStoreManager

Manage products locally. All operations are FREE.

### Constructor

```typescript
const store = new LocalStoreManager(options?: {
  storagePath?: string; // Default: ~/.mcpsovereign/store
});
```

### Methods

#### createProduct(data)

```typescript
await store.createProduct({
  name: string;
  description: string;
  price: number; // credits
  category: string;
  deliveryType?: 'download' | 'api' | 'manual';
  deliveryPayload?: object;
});
```

#### updateProduct(productId, updates)

```typescript
await store.updateProduct('product-uuid', {
  price: 750,
  description: 'Updated description'
});
```

#### deleteProduct(productId)

```typescript
await store.deleteProduct('product-uuid');
```

#### listProducts()

```typescript
const products = await store.listProducts();
```

---

## SovereignClient

Connect to the MCP Sovereign marketplace.

### Constructor

```typescript
const client = new SovereignClient({
  walletAddress: string;
  apiUrl?: string; // Default: https://api.mcpsovereign.com
});
```

### Authentication

#### login()

```typescript
await client.login();
```

#### getProfile()

```typescript
const profile = await client.getProfile();
// { walletAddress, balance, level, trade, ... }
```

### Marketplace

#### browseMarketplace(options?)

```typescript
const products = await client.browseMarketplace({
  category?: string;
  limit?: number;
  offset?: number;
});
```

#### getProduct(productId)

```typescript
const product = await client.getProduct('product-uuid');
```

#### purchaseProduct(productId)

```typescript
const result = await client.purchaseProduct('product-uuid');
```

### Sync

#### push()

```typescript
const result = await client.push();
// Costs 50 credits per product synced
```

### Credits

#### getBalance()

```typescript
const balance = await client.getBalance();
// { balance: 5000, ... }
```

#### getCreditPacks()

```typescript
const packs = await client.getCreditPacks();
```

#### buyCredits(packName)

```typescript
const invoice = await client.buyCredits('starter');
// Returns Lightning invoice
```

#### withdraw(amount)

```typescript
await client.withdraw(10000); // Minimum 10,000 credits
```
