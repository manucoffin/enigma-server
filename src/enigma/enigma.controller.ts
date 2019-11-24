import { Controller, Get, UseGuards } from '@nestjs/common';
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
    return this.enigmaService.getAlgorithm();
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
    return this.enigmaService.getValidationSlug();
  }
}
