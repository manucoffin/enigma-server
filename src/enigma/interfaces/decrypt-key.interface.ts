export enum DecryptKeyStatus {
  Unknown,
  Pending,
  Rejected,
  Validated,
}

export interface IDecryptKey {
  id: number;
  key: any; // Key can be of any type depending of the encrypting algorithm
  status: DecryptKeyStatus;
}
