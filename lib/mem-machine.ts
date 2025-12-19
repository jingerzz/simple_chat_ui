export class MemMachineClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.MEM_MACHINE_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async addMemory(content: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('Failed to add memory:', error);
    }
  }

  async retrieveContext(query: string): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.memories || [];
    } catch (error) {
      console.error('Failed to retrieve context:', error);
      return [];
    }
  }

  async deleteMemory(memoryId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memoryId }),
      });
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  }
}

export const memMachine = new MemMachineClient();
