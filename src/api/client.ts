import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export interface GHLConfig {
  accessToken: string;
  baseUrl?: string;
  locationId: string;
  version?: string;
}

export interface RateLimitInfo {
  daily: number;
  burst: number;
  dailyRemaining: number;
  burstRemaining: number;
}

export class GHLClient {
  private readonly baseUrl: string;
  private axiosInstance: AxiosInstance;
  private rateLimitDaily = 200000;
  private rateLimitBurst = 100;
  private rateLimitDailyRemaining = 200000;
  private rateLimitBurstRemaining = 100;
  public readonly locationId: string;

  constructor(config: GHLConfig) {
    this.baseUrl = config.baseUrl || 'https://services.leadconnectorhq.com';
    this.locationId = config.locationId;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        accept: 'application/json',
        version: config.version || '2021-07-28',
        authorization: `Bearer ${config.accessToken}`,
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Response interceptor for rate limit tracking
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Update rate limits from headers
        if (response.headers['x-ratelimit-daily-limit']) {
          this.rateLimitDaily = parseInt(response.headers['x-ratelimit-daily-limit'], 10);
        }
        if (response.headers['x-ratelimit-daily-remaining']) {
          this.rateLimitDailyRemaining = parseInt(response.headers['x-ratelimit-daily-remaining'], 10);
        }
        if (response.headers['x-ratelimit-limit']) {
          this.rateLimitBurst = parseInt(response.headers['x-ratelimit-limit'], 10);
        }
        if (response.headers['x-ratelimit-remaining']) {
          this.rateLimitBurstRemaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
        }
        return response;
      },
      (error) => this.handleError(error)
    );

    // Configure retry logic
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: (retryCount, error) => axiosRetry.exponentialDelay(retryCount, error, 1000),
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
      },
    });
  }

  private handleError(error: AxiosError): Promise<never> {
    const { response, request } = error;

    if (response) {
      if (response.data) {
        return Promise.reject(response.data);
      }
      if (response.statusText) {
        return Promise.reject({ message: response.statusText });
      }
    }

    if (request) {
      return Promise.reject({ message: `Could not reach ${this.baseUrl}` });
    }

    return Promise.reject({ message: error.message });
  }

  private async handleRateLimit(): Promise<void> {
    if (this.rateLimitDailyRemaining < 100) {
      console.warn(`⚠️  Low daily rate limit: ${this.rateLimitDailyRemaining} remaining`);
    }
    
    if (this.rateLimitBurstRemaining < 10) {
      console.warn('⚠️  Burst rate limit low, waiting 10 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  public getRateLimitInfo(): RateLimitInfo {
    return {
      daily: this.rateLimitDaily,
      burst: this.rateLimitBurst,
      dailyRemaining: this.rateLimitDailyRemaining,
      burstRemaining: this.rateLimitBurstRemaining,
    };
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await this.handleRateLimit();
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.handleRateLimit();
    const response = await this.axiosInstance.post<T>(url, data, {
      ...config,
      headers: { 'content-type': 'application/json', ...(config?.headers || {}) },
    });
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.handleRateLimit();
    const response = await this.axiosInstance.put<T>(url, data, {
      ...config,
      headers: { 'content-type': 'application/json', ...(config?.headers || {}) },
    });
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await this.handleRateLimit();
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}
