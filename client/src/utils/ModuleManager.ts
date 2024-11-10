import { Auxiliary } from './Auxiliary';
import { Logger, Group, sleep, Monitor, Sequence, Tree, Watch } from 'async-monitor.js';

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
    'async-monitor.js': { Logger, Group, sleep, Monitor, Sequence, Tree, Watch }
  };
  private static urlCache: Record<string, any> = {};

  static async loadExternalUrl(url: string): Promise<any> {
    if (this.urlCache[url]) {
      return this.urlCache[url];
    }

    try {
      const response = await fetch(url);
      const text = await response.text();
      const module = await this.executeCode(text, url);
      this.urlCache[url] = module;
      return module;
    } catch (error) {
      console.error(`Failed to load external URL ${url}:`, error);
      throw error;
    }
  }

  static async executeCode(code: string, filename: string = 'anonymous'): Promise<any> {
    // Create module context
    const module = { exports: {} };
    const require = this.createRequire(filename);

    // Transform imports to requires
    code = this.transformImports(code);

    // Create execution context
    const context = {
      module,
      exports: module.exports,
      require,
      console,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      process,
      Buffer,
      __filename: filename,
      __dirname: filename.split('/').slice(0, -1).join('/')
    };

    // Execute in sandbox
    try {
      const fn = new Function(...Object.keys(context), code);
      await fn.apply(null, Object.values(context));
      return module.exports;
    } catch (error) {
      console.error(`Error executing code in ${filename}:`, error);
      throw error;
    }
  }

  private static createRequire(filename: string) {
    return (path: string) => {
      // Check module cache
      if (this.moduleCache[path]) {
        return this.moduleCache[path];
      }

      // Check external modules
      if (this.externalModules[path]) {
        return this.externalModules[path];
      }

      // Resolve relative paths
      const resolvedPath = this.resolvePath(path, filename);
      
      // Load module
      try {
        // For demo, assume all external modules are URLs
        if (path.startsWith('http')) {
          return this.loadExternalUrl(path);
        }
        
        // Otherwise treat as built-in/cached module
        throw new Error(`Module not found: ${path}`);
      } catch (error) {
        console.error(`Failed to require ${path}:`, error);
        throw error;
      }
    };
  }

  private static resolvePath(path: string, current: string): string {
    if (path.startsWith('.')) {
      const parts = current.split('/').slice(0, -1);
      const relative = path.split('/');
      for (const part of relative) {
        if (part === '.') continue;
        if (part === '..') parts.pop();
        else parts.push(part);
      }
      return parts.join('/');
    }
    return path;
  }

  private static transformImports(code: string): string {
    // Basic transform of ES6 imports to requires
    return code.replace(
      /import\s+(?:{([^}]+)}\s+from\s+)?['"]([^'"]+)['"]/g,
      (_, imports, path) => {
        if (!imports) {
          return `require("${path}")`;
        }
        const vars = imports.split(',').map(i => i.trim());
        return `const {${vars.join(',')}} = require("${path}")`;
      }
    );
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

  static registerExternalModule(name: string, module: any): void {
    this.externalModules[name] = module;
  }
}