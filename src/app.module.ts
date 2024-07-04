import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';

// Função para verificar variáveis de ambiente
function checkEnvironmentVariables() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in the environment variables.');
    process.exit(1);
  } else {
    console.log('Mongo URI:', process.env.MONGO_URI);
  }
}

checkEnvironmentVariables();

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.mongoUri),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'your_ethereal_username',
          pass: 'your_ethereal_password',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
