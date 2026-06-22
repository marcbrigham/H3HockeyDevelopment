import path from 'node:path'
import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const DB_URL = process.env.DATABASE_URL ?? `file:${path.resolve('prisma/dev.db')}`

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: DB_URL
  },
  migrate: {
    async adapter() {
      const libsql = createClient({ url: DB_URL })
      return new PrismaLibSQL(libsql)
    }
  }
})
