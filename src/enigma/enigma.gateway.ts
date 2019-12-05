import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EnigmaService } from './enigma.service';
import {
  DecryptKeyStatus,
  IDecryptKey,
} from './interfaces/decrypt-key.interface';
import { configService } from '../config/config.service';
import { DecryptionSuccessDto } from './dto/decryption-success.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway()
export class EnigmaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users: number = 0;

  constructor(private enigmaService: EnigmaService) {
    this.broadcastBatchInterval = setInterval(() => {
      this.broadcastNewBatch();
    }, 1000);
  }

  private broadcastBatchInterval;

  async handleConnection(client: Socket) {
    this.users++;
    this.server.emit('users', this.users);

    this.broadcastDecryptKeys(client);
  }

  async handleDisconnect() {
    this.users--;
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('batch-accepted')
  async onBatchAccepted(client: Socket, keys: IDecryptKey[]) {
    // First we mark the keys from the batch as "Pending"
    this.enigmaService.updateKeysStatus(keys, DecryptKeyStatus.Pending);

    this.broadcastDecryptKeys(client);
  }

  @SubscribeMessage('batch-rejected')
  async onBatchRejected(client: Socket, keys: IDecryptKey[]) {
    // First we mark the keys from the batch as "Rejected"
    this.enigmaService.updateKeysStatus(keys, DecryptKeyStatus.Rejected);

    // Then we send to all clients the new statuses
    this.broadcastDecryptKeys(client);
  }

  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('message-decrypted')
  async onMessageDecrypted(client, data: DecryptionSuccessDto) {
    clearInterval(this.broadcastBatchInterval);
    // First we mark all the keys as rejected
    this.enigmaService.updateKeysStatus(
      this.enigmaService.decryptKeys,
      DecryptKeyStatus.Rejected,
    );

    // And then we mark only the valid key as "Validated"
    this.enigmaService.updateKeysStatus(
      [data.decryptKey],
      DecryptKeyStatus.Validated,
    );

    this.broadcastDecryptKeys(client);

    // We notify each client that the message has been decrypted
    this.server.emit('message-decrypted', {
      decryptedMessage: data.decryptedMessage,
      key: data.decryptKey,
    });
  }

  @SubscribeMessage('reset')
  async onReset(client) {
    // Mark all the keys to unknown
    this.enigmaService.updateKeysStatus(
      this.enigmaService.decryptKeys,
      DecryptKeyStatus.Unknown,
    );

    // And restart the interval
    this.broadcastBatchInterval = setInterval(() => {
      this.broadcastNewBatch();
    }, 1000);
  }

  private broadcastNewBatch(): void {
    // We create a new batch
    const newBatch = this.enigmaService.generateBatch(
      configService.getNumber('BATCH_SIZE'),
    );

    // And we broadcast it to all connected clients
    this.server.emit('batch', {
      encryptedMessage: configService.getString('ENCRYPTED_MESSAGE'),
      decryptKeys: newBatch,
    });
  }

  private broadcastDecryptKeys(client): void {
    this.server.emit('decrypt-keys', this.enigmaService.decryptKeys);
  }
}
