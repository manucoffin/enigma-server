import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { configService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { ConfigService } from '../config/config.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: 'osef',
        publicKey: configService.getPublicKey(),
      }),
      // inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
