import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { EnigmaService } from './enigma.service';
import { IDecryptKey } from './interfaces/decrypt-key.interface';
import { DecryptionFailedDto } from './dto/decryption-failed.dto';

@ApiUseTags('Enigma')
@Controller('enigma')
export class EnigmaController {
  constructor(private enigmaService: EnigmaService) {}

  @Get('algorithm')
  // @UseGuards(new JwtAuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Algorithm fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiUnauthorizedResponse({
    description: 'Action unauthorized.',
  })
  getAlgorithm(): string {
    return JSON.stringify(this.enigmaService.getAlgorithm());
  }

  @Get('validation-slug')
  // @UseGuards(new JwtAuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Validation slug fetched.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiUnauthorizedResponse({
    description: 'Action unauthorized.',
  })
  getValidationSlug(): string {
    return JSON.stringify(this.enigmaService.getValidationSlug());
  }

  @Post('decryption-failed')
  // @UseGuards(new JwtAuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Combinations removed from list.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiUnauthorizedResponse({
    description: 'Action unauthorized.',
  })
  postDecryptionFailed(@Body() payload: DecryptionFailedDto): IDecryptKey[] {
    return this.enigmaService.removeFailedKeys(payload.decryptKeys);
  }
}
