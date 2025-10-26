import axios from 'axios';

/**
 * AI Engine service that connects to your custom NanoChat LLM
 * Running on M2 Max via MPS at http://localhost:8000
 */

export interface AIInsight {
  type: 'prediction' | 'recommendation' | 'anomaly' | 'insight';
  title: string;
  description: string;
  confidence: number;
  data?: any;
  timestamp: Date;
}

export interface LeadScore {
  contactId: string;
  score: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}

export class AIEngine {
  private llmEndpoint: string;
  private enabled: boolean;

  constructor() {
    // Your NanoChat LLM endpoint
    this.llmEndpoint = process.env.LLM_ENDPOINT || 'http://localhost:8000/api/chat';
    this.enabled = process.env.ENABLE_AI === 'true';
  }

  /**
   * Query your custom LLM with context
   */
  private async queryLLM(prompt: string, context?: any): Promise<string> {
    if (!this.enabled) {
      return 'AI features disabled. Set ENABLE_AI=true in .env';
    }

    try {
      const response = await axios.post(this.llmEndpoint, {
        message: prompt,
        context: context ? JSON.stringify(context, null, 2) : undefined,
        temperature: 0.7,
        max_tokens: 500,
      }, {
        timeout: 30000, // 30 second timeout
      });

      return response.data.response || response.data.message || '';
    } catch (error: any) {
      console.error('LLM query failed:', error.message);
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  /**
   * Score lead quality based on contact data
   */
  async scoreContact(contact: any): Promise<LeadScore> {
    const prompt = `Analyze this GoHighLevel contact and provide a lead quality score from 0-100.

Contact Data:
- Name: ${contact.firstName} ${contact.lastName}
- Email: ${contact.email}
- Phone: ${contact.phone || 'N/A'}
- Tags: ${contact.tags?.join(', ') || 'None'}
- Source: ${contact.source || 'Unknown'}
- Date Added: ${contact.dateAdded}
- Last Contacted: ${contact.lastContacted || 'Never'}
- Conversations: ${contact.conversationCount || 0}
- Opportunities: ${contact.opportunityCount || 0}

Provide:
1. Lead score (0-100)
2. Confidence level (0-100)
3. Key factors affecting the score
4. Recommended next action

Format as JSON: {"score": number, "confidence": number, "factors": ["factor1", "factor2"], "recommendation": "string"}`;

    const response = await this.queryLLM(prompt, contact);
    
    try {
      // Parse AI response
      const jsonMatch = response.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          contactId: contact.id,
          score: parsed.score || 50,
          confidence: parsed.confidence || 50,
          factors: parsed.factors || [],
          recommendation: parsed.recommendation || 'Review contact manually',
        };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    // Fallback scoring
    return {
      contactId: contact.id,
      score: 50,
      confidence: 30,
      factors: ['Unable to analyze'],
      recommendation: 'Manual review needed',
    };
  }

  /**
   * Detect anomalies in API usage patterns
   */
  async detectAnomalies(analytics: any): Promise<AIInsight[]> {
    const prompt = `Analyze these GoHighLevel API usage patterns and identify any anomalies or concerns.

Analytics Data:
- Total Requests: ${analytics.requests.total}
- Success Rate: ${((analytics.requests.success / analytics.requests.total) * 100).toFixed(1)}%
- Error Rate: ${((analytics.requests.errors / analytics.requests.total) * 100).toFixed(1)}%
- Average Response Time: ${analytics.requests.avgDuration}ms

Top Endpoints:
${Object.entries(analytics.endpoints || {}).slice(0, 5).map(([endpoint, stats]: [string, any]) => 
  `- ${endpoint}: ${stats.count} calls, ${stats.errors} errors, ${Math.round(stats.avgDuration)}ms avg`
).join('\n')}

Identify:
1. Unusual patterns
2. Potential issues
3. Performance concerns
4. Recommendations

Provide specific, actionable insights.`;

    const response = await this.queryLLM(prompt, analytics);
    
    const insights: AIInsight[] = [];
    
    // Parse AI insights
    const lines = response.split('\n').filter(l => l.trim());
    
    lines.forEach(line => {
      if (line.includes('anomaly') || line.includes('unusual') || line.includes('concern')) {
        insights.push({
          type: 'anomaly',
          title: 'Anomaly Detected',
          description: line,
          confidence: 75,
          timestamp: new Date(),
        });
      } else if (line.includes('recommend') || line.includes('suggest')) {
        insights.push({
          type: 'recommendation',
          title: 'AI Recommendation',
          description: line,
          confidence: 80,
          timestamp: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Predict opportunity win probability
   */
  async predictOpportunityWin(opportunity: any): Promise<number> {
    const prompt = `Analyze this GoHighLevel opportunity and predict the win probability (0-100%).

Opportunity Data:
- Name: ${opportunity.name}
- Value: $${opportunity.monetaryValue || 0}
- Pipeline: ${opportunity.pipelineName}
- Stage: ${opportunity.pipelineStage}
- Contact: ${opportunity.contact?.name || 'Unknown'}
- Age: ${opportunity.createdAt ? Math.floor((Date.now() - new Date(opportunity.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
- Last Activity: ${opportunity.lastActivityAt || 'Unknown'}
- Notes: ${opportunity.notes || 'None'}

Provide win probability as a number between 0-100.`;

    const response = await this.queryLLM(prompt, opportunity);
    
    // Extract number from response
    const match = response.match(/\d+/);
    if (match) {
      const probability = parseInt(match[0]);
      return Math.min(100, Math.max(0, probability));
    }
    
    return 50; // Default
  }

  /**
   * Generate natural language insights from data
   */
  async generateInsights(data: any, dataType: string): Promise<string> {
    const prompt = `Analyze this GoHighLevel ${dataType} data and provide actionable insights.

Data Summary:
${JSON.stringify(data, null, 2)}

Provide:
1. Key trends
2. Notable patterns
3. Actionable recommendations
4. Potential risks or opportunities

Be specific and actionable.`;

    return await this.queryLLM(prompt, data);
  }

  /**
   * Answer natural language questions about GHL data
   */
  async answerQuestion(question: string, context: any): Promise<string> {
    const prompt = `You are an AI assistant specialized in GoHighLevel CRM data analysis.

User Question: ${question}

Available Data Context:
${JSON.stringify(context, null, 2)}

Provide a clear, helpful answer based on the data. If you cannot answer with the available data, say so.`;

    return await this.queryLLM(prompt, context);
  }

  /**
   * Suggest workflow optimizations
   */
  async suggestWorkflowOptimizations(workflow: any): Promise<AIInsight[]> {
    const prompt = `Analyze this GoHighLevel workflow and suggest optimizations.

Workflow: ${workflow.name}
Steps: ${workflow.steps?.length || 0}
Active: ${workflow.status === 'active'}

Suggest specific improvements to:
1. Increase conversion rates
2. Reduce friction
3. Improve timing
4. Enhance personalization`;

    const response = await this.queryLLM(prompt, workflow);
    
    return [{
      type: 'recommendation',
      title: 'Workflow Optimization Suggestions',
      description: response,
      confidence: 70,
      data: workflow,
      timestamp: new Date(),
    }];
  }

  /**
   * Check if AI service is available
   */
  async healthCheck(): Promise<boolean> {
    if (!this.enabled) return false;
    
    try {
      await axios.get(`${this.llmEndpoint.replace('/api/chat', '')}/health`, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
