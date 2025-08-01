import 'reflect-metadata';
import dotenv from 'dotenv';
import { createApp } from './config/app';
import { configureDI } from './infrastructure/di/container';
import { 
  getServerConfig, 
  getApplicationConfig, 
  getApiConfig,
  configProvider
} from './config';

// Load environment variables
dotenv.config();

export async function startServer() {
  try {
    // Initialize configuration first
    configProvider.initialize();
    
    // Get configuration sections
    const serverConfig = getServerConfig();
    const appConfig = getApplicationConfig();
    const apiConfig = getApiConfig();

    // ⚠️ DEVELOPMENT WARNING: Check for dangerous production settings
    if (serverConfig.environment === 'production' && process.env.ALLOW_PRODUCTION_AUTO_MIGRATION === 'true') {
      console.log('');
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
      console.log('🚨                    ⚠️  CRITICAL WARNING ⚠️                           🚨');
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
      console.log('🚨');
      console.log('🚨  AUTO-MIGRATION IS ENABLED IN PRODUCTION ENVIRONMENT!');
      console.log('🚨');
      console.log('🚨  ⚠️  This is EXTREMELY DANGEROUS and should NEVER be used in real production!');
      console.log('🚨  ⚠️  Database schema will be automatically synchronized on startup!');
      console.log('🚨  ⚠️  This can cause IRREVERSIBLE DATA LOSS!');
      console.log('🚨  ⚠️  This feature is intended for DEVELOPMENT PURPOSES ONLY!');
      console.log('🚨');
      console.log('🚨  📝 To disable this dangerous feature:');
      console.log('🚨     Set ALLOW_PRODUCTION_AUTO_MIGRATION=false in your environment');
      console.log('🚨     Or remove the environment variable entirely');
      console.log('🚨');
      console.log('🚨  📚 For production databases, use proper migration scripts instead:');
      console.log('🚨     - Create migration files manually');
      console.log('🚨     - Use TypeORM CLI: npm run typeorm:migration:generate');
      console.log('🚨     - Run migrations with: npm run typeorm:migration:run');
      console.log('🚨');
      console.log('🚨  ⏰ This application will continue in 10 seconds...');
      console.log('🚨     Press Ctrl+C to abort and fix the configuration!');
      console.log('🚨');
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
      console.log('');
      
      // Give time to read the warning and abort if needed
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Configure dependency injection (now async)
    await configureDI();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(serverConfig.port, serverConfig.host, () => {
      console.log(`${appConfig.startupMessage} ${serverConfig.port}`);
      console.log(`🌍 Environment: ${serverConfig.environment}`);
      console.log(`📖 API documentation available at http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}`);
      console.log(`🔍 Health check: http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}${apiConfig.prefix}${apiConfig.endpoints.health}`);
      console.log(`📝 Todos API: http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}${apiConfig.prefix}${apiConfig.endpoints.todos}`);
      console.log(`👥 Patients API: http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}${apiConfig.prefix}${apiConfig.endpoints.patients}`);
      console.log(`👨‍⚕️ Doctors API: http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}${apiConfig.prefix}${apiConfig.endpoints.doctors}`);
      console.log(`🏠 Address API: http://${serverConfig.host === '0.0.0.0' ? 'localhost' : serverConfig.host}:${serverConfig.port}${apiConfig.prefix}${apiConfig.endpoints.address}`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('🛑 Received shutdown signal, starting graceful shutdown...');
      setTimeout(() => {
        console.log('💥 Forcing shutdown due to timeout');
        process.exit(1);
      }, serverConfig.shutdownTimeout);
      
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server only if this module is being run directly
if (require.main === module) {
  startServer();
}
