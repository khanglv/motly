import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    // Migration chạy qua kết nối trực tiếp (Neon: "Direct connection")
    url: env('DIRECT_URL')
  }
});
