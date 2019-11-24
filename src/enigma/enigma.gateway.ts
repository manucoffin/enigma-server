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

@WebSocketGateway()
export class EnigmaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users: number = 0;

  constructor(private enigmaService: EnigmaService) {}

  async handleConnection(client: Socket) {
    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);

    this.broadcastNewBatch(client);
  }

  async handleDisconnect() {
    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('batch-accepted')
  async onBatchAccepted(client: Socket, keys: IDecryptKey[]) {
    // First we mark the keys from the batch as "Pending"
    this.enigmaService.updateKeysStatus(keys, DecryptKeyStatus.Pending);

    this.broadcastNewBatch(client);
  }

  // @UseGuards(new JwtAuthGuard())
  @SubscribeMessage('message-decrypted')
  async onMessageDecrypted(client, data: DecryptionSuccessDto) {
    this.enigmaService.updateKeysStatus(
      [data.decryptKey],
      DecryptKeyStatus.Validated,
    );

    // We notify each client that the message has been decrypted
    client.broadcast.emit('message-decrypted', {
      decryptedMessage: data.decryptedMessage,
      key: data.decryptKey,
    });
  }

  private broadcastNewBatch(client): void {
    // We create a new batch
    const newBatch = this.enigmaService.generateBatch(
      configService.getNumber('BATCH_SIZE'),
    );

    // And we broadcast it to all connected clients
    client.broadcast.emit('batch', {
      encryptedMessage: configService.getString('ENCRYPTED_MESSAGE'),
      decryptKeys: newBatch,
    });
  }

  // Broadcast batchs

  // Client refuses batch => send not yet to server
  // Client accept the batch => send yes to server + broadcast to other clients that batch was accepted

  // Server broadcast remaining batches

  // ...

  // Broadcast message decrypted when client found it
}
