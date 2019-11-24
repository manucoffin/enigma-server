import { Injectable } from '@nestjs/common';
import { configService } from '../config/config.service';

@Injectable()
export class EnigmaService {
  public getAlgorithm(): string {
    return `console.log('coucou')`;
  }

  public getValidationSlug(): string {
    return configService.getString('VALIDATION_SLUG');
  }
}
