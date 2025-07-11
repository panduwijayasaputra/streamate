import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

interface DatabaseInfo {
  version: string;
  tableCount: number;
  connection: {
    host: string | number;
    port: number;
    database: string;
    isConnected: boolean;
  };
}

interface MigrationStatus {
  hasUnappliedMigrations: boolean;
  pendingMigrations: any[];
}

interface HealthCheckResult {
  status: string;
  details?:
    | string
    | DatabaseInfo
    | {
        connection: string;
        tables: number;
        version: string;
      };
}

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.checkConnection();
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      await this.dataSource.query('SELECT 1');
      this.logger.log('Database connection established successfully');
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Database connection failed:', errorMessage);
      return false;
    }
  }

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Running database migrations...');
      await this.dataSource.runMigrations();
      this.logger.log('Database migrations completed successfully');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Migration failed:', errorMessage);
      throw error;
    }
  }

  async revertLastMigration(): Promise<void> {
    try {
      this.logger.log('Reverting last migration...');
      await this.dataSource.undoLastMigration();
      this.logger.log('Last migration reverted successfully');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Migration revert failed:', errorMessage);
      throw error;
    }
  }

  async getMigrationStatus(): Promise<MigrationStatus> {
    try {
      const migrations = await this.dataSource.showMigrations();
      const pendingMigrations = await this.dataSource.runMigrations();

      return {
        hasUnappliedMigrations: migrations,
        pendingMigrations:
          pendingMigrations.length > 0 ? pendingMigrations : [],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to get migration status:', errorMessage);
      throw error;
    }
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    try {
      const connection = this.dataSource;
      const queryRunner = connection.createQueryRunner();

      // Get database version
      const versionResult = (await queryRunner.query(
        'SELECT version()',
      )) as Array<{ version: string }>;

      // Get table count
      const tableCountResult = (await queryRunner.query(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)) as Array<{ table_count: string }>;

      // Get connection info - cast to access PostgreSQL options
      const options = connection.options as {
        host?: string;
        port?: number;
        database?: string;
      };
      const connectionInfo = {
        host: options.host || 'unknown',
        port: (options.port as number) || 5432,
        database: options.database || 'unknown',
        isConnected: connection.isInitialized,
      };

      await queryRunner.release();

      return {
        version: versionResult[0]?.version || 'Unknown',
        tableCount: parseInt(tableCountResult[0]?.table_count || '0'),
        connection: connectionInfo,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to get database info:', errorMessage);
      throw error;
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const isConnected = await this.checkConnection();

      if (!isConnected) {
        return { status: 'unhealthy', details: 'Database connection failed' };
      }

      const dbInfo = await this.getDatabaseInfo();

      return {
        status: 'healthy',
        details: {
          connection: 'established',
          tables: dbInfo.tableCount,
          version: dbInfo.version,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'unhealthy',
        details: errorMessage,
      };
    }
  }
}
