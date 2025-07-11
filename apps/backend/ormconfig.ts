import { DataSource } from 'typeorm';
import configuration from './src/config/configuration';

const config = configuration();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Disable synchronize for production
  logging: config.app.nodeEnv === 'development',
});
