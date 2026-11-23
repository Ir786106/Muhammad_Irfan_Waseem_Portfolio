import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'**/*.e2e.ts',workers:1,use:{baseURL:'http://127.0.0.1:4321',headless:true},webServer:{command:'npm run dev -- --port 4321',url:'http://127.0.0.1:4321',reuseExistingServer:true},reporter:[['list'],['html',{open:'never'}]]});
