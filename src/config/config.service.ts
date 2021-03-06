import { HttpService, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

type EnvType =
  | 'DB_PORT'
  | 'DB_NAME'
  | 'DB_HOST'
  | 'DB_USER'
  | 'DB_PWD'
  | 'DB_PWD'
  | 'JWT_SECRET'
  | 'JWT_EXPIRES_IN'
  | 'PORT'
  | 'ENCRYPTED_MESSAGE'
  | 'VALIDATION_SLUG'
  | 'BATCH_SIZE'
  | 'AUTH_SERVER_URL';

@Injectable()
export class ConfigService {
  public publicKey;

  constructor(private readonly httpService: HttpService) {
    this.publicKey = this.httpService.get(`http://localhost:8888/publicKey`);

    let filename = '.env';
    if (process.env.NODE_ENV === 'test') {
      filename = `.env.${process.env.NODE_ENV}`;
    }
    dotenv.config({
      path: path.resolve(process.cwd(), filename),
    });
  }

  getBoolean(key: EnvType) {
    return !!process.env[key];
  }

  getNumber(key: EnvType) {
    return +process.env[key] as number | undefined;
  }

  getString(key: EnvType) {
    return process.env[key];
  }

  public getPublicKey(): any {
    return this.publicKey;
  }
}

const http = new HttpService();

export const configService = new ConfigService(http);
