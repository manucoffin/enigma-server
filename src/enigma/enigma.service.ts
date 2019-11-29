import { Injectable } from '@nestjs/common';
import { configService } from '../config/config.service';
import {
  DecryptKeyStatus,
  IDecryptKey,
} from './interfaces/decrypt-key.interface';

@Injectable()
export class EnigmaService {
  public decryptKeys: IDecryptKey[] = [
    { id: 1, key: -1, status: DecryptKeyStatus.Unknown },
    { id: 2, key: -2, status: DecryptKeyStatus.Unknown },
    { id: 3, key: -3, status: DecryptKeyStatus.Unknown },
    { id: 4, key: -4, status: DecryptKeyStatus.Unknown },
    { id: 5, key: -5, status: DecryptKeyStatus.Unknown },
    { id: 6, key: -6, status: DecryptKeyStatus.Unknown },
    { id: 7, key: -7, status: DecryptKeyStatus.Unknown },
    { id: 8, key: -8, status: DecryptKeyStatus.Unknown },
    { id: 9, key: -9, status: DecryptKeyStatus.Unknown },
    { id: 10, key: -10, status: DecryptKeyStatus.Unknown },
    { id: 11, key: -11, status: DecryptKeyStatus.Unknown },
    { id: 12, key: -12, status: DecryptKeyStatus.Unknown },
    { id: 13, key: -13, status: DecryptKeyStatus.Unknown },
    { id: 14, key: -14, status: DecryptKeyStatus.Unknown },
    { id: 15, key: -15, status: DecryptKeyStatus.Unknown },
    { id: 16, key: -16, status: DecryptKeyStatus.Unknown },
    { id: 17, key: -17, status: DecryptKeyStatus.Unknown },
    { id: 18, key: -18, status: DecryptKeyStatus.Unknown },
    { id: 19, key: -19, status: DecryptKeyStatus.Unknown },
    { id: 20, key: -20, status: DecryptKeyStatus.Unknown },
    { id: 21, key: -21, status: DecryptKeyStatus.Unknown },
    { id: 22, key: -22, status: DecryptKeyStatus.Unknown },
    { id: 23, key: -23, status: DecryptKeyStatus.Unknown },
    { id: 24, key: -24, status: DecryptKeyStatus.Unknown },
    { id: 25, key: -25, status: DecryptKeyStatus.Unknown },
    { id: 26, key: -26, status: DecryptKeyStatus.Unknown },
  ];

  public getAlgorithm(): string {
    return `function decryptMessage(str, amount) {
      if (amount < 0) {
        amount = amount + 26;
      }

      let output = '';
  
      for (let i = 0; i < str.length; i++) {
        let c = str[i];
  
        if (c.match(/[a-z]/i)) {
          const code = str.charCodeAt(i);
  
          if (code >= 65 && code <= 90)
            c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
          else if (code >= 97 && code <= 122)
            c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
  
        output += c;
      }
  
      return output;
    };
    decryptMessage(strVar, amountVar);`;
  }

  public getValidationSlug(): string {
    return configService.getString('VALIDATION_SLUG');
  }

  public removeFailedKeys(keys: IDecryptKey[]): IDecryptKey[] {
    keys.map(k => {
      this.decryptKeys.filter(c => c.id === k.id);

      // const deleteIndex = this.decryptKeys.findIndex(
      //   c => c.id === combi.id,
      // );
      // delete this.decryptKeys[deleteIndex];
    });

    return this.decryptKeys;
  }

  public generateBatch(batchSize): IDecryptKey[] {
    const batch = [];

    // We add to the batch all keys that have not been tested yet
    this.decryptKeys.map(key => {
      if (batch.length < batchSize && key.status === DecryptKeyStatus.Unknown) {
        batch.push(key);
      }
    });

    return batch;
  }

  public updateKeysStatus(keys: IDecryptKey[], status: DecryptKeyStatus): void {
    this.decryptKeys.map(decryptKey => {
      if (keys.find(k => k.id === decryptKey.id)) {
        decryptKey.status = status;
      }
      return decryptKey;
    });
  }
}
