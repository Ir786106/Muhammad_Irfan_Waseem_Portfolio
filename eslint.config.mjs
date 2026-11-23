import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default tseslint.config({ignores:['dist/**','.astro/**','research/**','node_modules/**']},...tseslint.configs.recommended,...astro.configs.recommended,{rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}]}});
