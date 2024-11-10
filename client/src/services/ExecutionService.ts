import { ModuleManager } from '../utils/ModuleManager';

export interface ExecutionResult {
  success: boolean;
  output: string[];
  error?: string;
}

export class ExecutionService {
  private static output: string[] = [];
  private static originalConsole = { ...console };

  private static interceptConsole() {
    console.log = (...args) => {
      this.output.push(args.map(arg => String(arg)).join(' '));
      this.originalConsole.log(...args);
    };
    console.error = (...args) => {
      this.output.push(`[ERROR] ${args.map(arg => String(arg)).join(' ')}`);
      this.originalConsole.error(...args);
    };
  }

  private static restoreConsole() {
    console.log = this.originalConsole.log;
    console.error = this.originalConsole.error;
  }

  static async executeScript(code: string, filename: string): Promise<ExecutionResult> {
    this.output = [];
    this.interceptConsole();

    try {
      await ModuleManager.executeCode(code, filename);
      
      return {
        success: true,
        output: this.output
      };
    } catch (error) {
      return {
        success: false,
        output: this.output,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      this.restoreConsole();
    }
  }
}