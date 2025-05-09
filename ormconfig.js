module.exports = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: process.env.NODE_ENV === 'test',
  cli: {
    migrationsDir: 'migrations',
  },
  type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
  url: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : undefined,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
  entities: [
    process.env.NODE_ENV === 'test' 
      ? '**/*.entity.ts'
      : '**/*.entity.js'
  ]
};