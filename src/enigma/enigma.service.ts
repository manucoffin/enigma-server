import { Injectable } from '@nestjs/common';
import { configService } from '../config/config.service';
import { IDecryptKey } from './interfaces/decrypt-key.interface';

@Injectable()
export class EnigmaService {
  private combinationsList: IDecryptKey[] = [
    { id: 1, key: 1 },
    { id: 2, key: 2 },
    { id: 3, key: 3 },
    { id: 4, key: 4 },
    { id: 5, key: 5 },
    { id: 6, key: 6 },
    { id: 7, key: 7 },
    { id: 8, key: 8 },
    { id: 9, key: 9 },
    { id: 10, key: 10 },
    { id: 11, key: 11 },
    { id: 12, key: 12 },
    { id: 13, key: 13 },
    { id: 14, key: 14 },
    { id: 15, key: 15 },
    { id: 16, key: 16 },
    { id: 17, key: 17 },
    { id: 18, key: 18 },
    { id: 19, key: 19 },
    { id: 20, key: 20 },
    { id: 21, key: 21 },
    { id: 22, key: 22 },
    { id: 23, key: 23 },
    { id: 24, key: 24 },
    { id: 25, key: 25 },
    { id: 26, key: 26 },
  ];

  public getAlgorithm(): string {
    return `console.log('coucou')`;
  }

  public getValidationSlug(): string {
    return configService.getString('VALIDATION_SLUG');
  }

  public removeFailedKeys(keys: IDecryptKey[]): IDecryptKey[] {
    keys.map(k => {
      this.combinationsList.filter(c => c.id === k.id);

      // const deleteIndex = this.combinationsList.findIndex(
      //   c => c.id === combi.id,
      // );
      // delete this.combinationsList[deleteIndex];
    });

    return this.combinationsList;
  }

  public onMessageDecrypted(decryptKey: IDecryptKey): boolean {
    // Envoi message WS à tous les clients connectés pour dire que le message a été trouvé
    return true;
  }
}
