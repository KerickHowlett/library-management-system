/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'path';

const PROXY = {
    '/api': {
        changeOrigin: true,
        target: `${process.env.VITE_API_DOMAIN}/api`,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
};

export default defineConfig(() => ({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/client',
    server: {
        port: 4200,
        host: 'localhost',
        proxy: PROXY,
    },
    preview: {
        port: 4300,
        host: 'localhost',
        proxy: PROXY,
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    envDir: path.resolve(__dirname, '../../.env'),
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
        outDir: '../../dist/client',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    test: {
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/client',
            provider: 'v8' as const,
        },
    },
}));
