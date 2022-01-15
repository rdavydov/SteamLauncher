import {cwd} from 'node:process';
import {join, basename} from 'node:path';
import {builtinModules} from 'node:module';
import {defineConfig, UserConfigExport} from 'vite';
import {dependencies} from './package.json';

const builtinModulesNodeProtocol = builtinModules.map((module) => 'node:' + module);
const externalModules = [...Object.keys(dependencies), 'electron'];

export default function createConfig(packagePath: string) {
  return defineConfig(({mode}) => {
    const isDevelopment = mode === 'development';
    const rootPath = cwd();
    const viteDistName = basename(packagePath);
    const viteRoot = join(packagePath, 'src');
    const viteOutDirectory = join(packagePath, 'dist');
    const viteConfig: UserConfigExport = {
      root: viteRoot,
      envDir: rootPath,
      build: {
        target: 'esnext',
        emptyOutDir: true,
        outDir: viteOutDirectory,
        polyfillModulePreload: false,
      },
    };

    if (isDevelopment) {
      viteConfig.build!.minify = false;
    }

    if (viteDistName === 'main' || viteDistName === 'preload') {
      viteConfig.build!.lib = {
        entry: join(viteRoot, 'index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js',
      };
      viteConfig.build!.rollupOptions = {
        external: [...externalModules, ...builtinModules, ...builtinModulesNodeProtocol],
      };
    }

    return viteConfig;
  });
}
