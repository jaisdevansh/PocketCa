export class HealthService {
  public async checkHealth(): Promise<{ status: string; version: string; timestamp: string }> {
    // In a real application, this could check database connectivity, redis, etc.
    return {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
