import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { IDecryptKey } from '../interfaces/decrypt-key.interface';

export class DecryptionFailedDto {
  @IsDefined()
  @ApiModelProperty()
  readonly decryptKeys: IDecryptKey[];
}
