import { Module } from '@nestjs/common';
import { EnigmaController } from './enigma.controller';
import { EnigmaService } from './enigma.service';
import { EnigmaGateway } from './enigma.gateway';

@Module({
  controllers: [EnigmaController],
  providers: [EnigmaService, EnigmaGateway],
})
export class EnigmaModule {}
