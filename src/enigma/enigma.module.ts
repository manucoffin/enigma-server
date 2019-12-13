import { HttpModule, Module } from '@nestjs/common';
import { EnigmaController } from './enigma.controller';
import { EnigmaService } from './enigma.service';
import { EnigmaGateway } from './enigma.gateway';

@Module({
  imports: [HttpModule],
  controllers: [EnigmaController],
  providers: [EnigmaService, EnigmaGateway],
  exports: [],
})
export class EnigmaModule {}
