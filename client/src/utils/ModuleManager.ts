import { Auxiliary } from './Auxiliary';
import { Logger, Group, sleep } from 'async-monitor.js';

interface ModuleCache {
  [key: string]: any;
}

interface ExternalModules {
  'async-monitor.js': typeof import('async-monitor.js');
  [key: string]: any;
}

export class ModuleManager {
  private static moduleCache: ModuleCache = {};
  private static externalModules: ExternalModules = {
    'async-monitor.js': { Logger, Group, sleep }
  };
  private static urlCache: Record<string, any> = {};

  static async loadExternalUrl(url: string): Promise<any> {
    if (this.urlCache[url]) {
      return this.urlCache[url];
    }

    try {
      const response = await fetch(url);
      const text = await response.text();
      
      const blob = new Blob([text], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      
      const module = await import(/* @vite-ignore */ blobUrl);
      
      this.urlCache[url] = module;
      URL.revokeObjectURL(blobUrl);
      
      return module;
    } catch (error) {
      throw new Error(`Failed to load external module from ${url}: ${error}`);
    }
  }

  static registerModule(name: string, code: string): void {
    try {
      const moduleFunction = new Function('exports', 'require', 'Auxiliary', `
        const module = { exports: {} };
        ${code}
        return module.exports;
      `);
      
      const exports = {};
      const require = (moduleName: string) => {
        if (this.externalModules[moduleName]) {
          return this.externalModules[moduleName];
        }
        return this.moduleCache[moduleName];
      };
      
      this.moduleCache[name] = moduleFunction(exports, require, Auxiliary);
    } catch (error) {
      throw new Error(`Failed to register module '${name}': ${error}`);
    }
  }

  static getModule(name: string): any {
    return this.moduleCache[name];
  }

  static clearCache(): void {
    this.moduleCache = {};
    this.urlCache = {};
  }

  static async executeCode(code: string): Promise<any> {
    const require = (moduleName: string) => {
      if (moduleName.startsWith('http')) {
        throw new Error('External URL modules must be loaded with await require()');
      }
      if (this.externalModules[moduleName]) {
        return this.externalModules[moduleName];
      }
      return this.getModule(moduleName);
    };
    require.async = async (moduleName: string) => {
      if (moduleName.startsWith('http')) {
        return await this.loadExternalUrl(moduleName);
      }
      return require(moduleName);
    };
    
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    return await new AsyncFunction('require', 'Auxiliary', code)(require, Auxiliary);
  }

  static registerExternalModule(name: string, module: any): void {
    this.externalModules[name] = module;
  }
}