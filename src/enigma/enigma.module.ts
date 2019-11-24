import { Module } from '@nestjs/common';
import { EnigmaController } from './enigma.controller';
import { EnigmaService } from './enigma.service';

@Module({
  controllers: [EnigmaController],
  providers: [EnigmaService]
})
export class EnigmaModule {}
