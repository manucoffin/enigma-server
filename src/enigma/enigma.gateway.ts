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

@WebSocketGateway()
export class EnigmaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users: number = 0;

  constructor(private enigmaService: EnigmaService) {}

  async handleConnection() {
    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  async handleDisconnect() {
    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('batch-accepted')
  onBatchAccepted(client: Socket, keys: IDecryptKey[]) {
    // First we mark the keys from the batch as "Pending"
    this.enigmaService.updateKeysStatus(keys, DecryptKeyStatus.Pending);

    // Then we create a new batch
    const newBatch = this.enigmaService.generateBatch(
      configService.getNumber('BATCH_SIZE'),
    );

    // Finally we broadcast the new batch to all connected clients
    client.broadcast.emit('batch', {
      encryptedMessage: configService.getString('ENCRYPTED_MESSAGE'),
      decryptKeys: newBatch,
    });
  }

  @SubscribeMessage('chat')
  async onChat(client, message) {
    client.broadcast.emit('chat', message);
  }

  // Broadcast batchs

  // Client refuses batch => send not yet to server
  // Client accept the batch => send yes to server + broadcast to other clients that batch was accepted

  // Server broadcast remaining batches

  // ...

  // Broadcast message decrypted when client found it
}
