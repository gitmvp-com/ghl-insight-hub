interface Webhook {
  id: string;
  type: string;
  headers: any;
  body: any;
  query: any;
  timestamp: Date;
}

export class WebhookStore {
  private webhooks: Webhook[] = [];
  private maxWebhooks = 500;

  add(webhook: Webhook) {
    this.webhooks.push(webhook);
    
    if (this.webhooks.length > this.maxWebhooks) {
      this.webhooks = this.webhooks.slice(-this.maxWebhooks);
    }
  }

  getAll(limit = 50, type?: string): Webhook[] {
    let filtered = this.webhooks;
    
    if (type) {
      filtered = filtered.filter(w => w.type === type);
    }
    
    return filtered.slice(-limit).reverse();
  }

  getById(id: string): Webhook | undefined {
    return this.webhooks.find(w => w.id === id);
  }

  getCount(): number {
    return this.webhooks.length;
  }

  clear(): number {
    const count = this.webhooks.length;
    this.webhooks = [];
    return count;
  }
}
