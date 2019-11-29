import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnigmaModule } from './enigma/enigma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EnigmaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
