import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
} from '@nestjs/websockets';
import * as Fs from 'fs';

enum ClientStatus {
    INVALID_CODE = 'INVALID_CODE',
    NEW_GAME = 'NEW_GAME',
    JOIN_GAME = 'JOIN_GAME',
    START_GAME = 'START_GAME',
}
enum AdminStatus { INVALID_CODE = 'INVALID_CODE', START_GAME = 'START_GAME' }

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users: number = 0;
    questions: any = JSON.parse(Fs.readFileSync('./src/questions.json', 'utf8'));
    gameRoom: any = {
        1: {
            clients: [],
            status: [],
            metadata: [],
        },
    };


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

    @SubscribeMessage('msg')
    handleEvent(client, data: { type: string, code: string }): WsResponse<unknown> {
        const event = 'msg';
        const respond: any = {
            event, data: {
                code: ClientStatus.INVALID_CODE,
            },
        };
        switch (data.type) {
            case ClientStatus.JOIN_GAME:
                // Check if game exist
                const gameRoom = this.gameRoom[data.code];
                if (!gameRoom) {
                    respond.data.code = ClientStatus.INVALID_CODE;
                } else {
                    gameRoom.clients.push(client);
                    respond.data.code = ClientStatus.JOIN_GAME;
                    respond.data.data = gameRoom.metadata;
                }
                break;
        }
        return respond;
    }


    @SubscribeMessage('msgAdmin')
    handleEventAdmin(admin, data: { type: string, code: string }): WsResponse<unknown> {
        const event = 'msg';
        let respond: any = {
            event, data: {
                code: 'UNDEFINED',
            },
        };
        switch (data.type) {
            case AdminStatus.START_GAME:
                // Check if game exist
                const gameRoom = this.gameRoom[data.code];
                if (!gameRoom) {
                    respond.data.code = AdminStatus.INVALID_CODE;
                } else {
                    console.log(gameRoom.clients.length)
                    gameRoom.clients.forEach(client => {
                        this.adminStartClient(client);
                    });
                    respond = null;
                }
                break;
        }
        return respond;
    }

    adminStartClient(client) {
        const respond: any = {
            event: 'msg',
            data: {
                code: ClientStatus.START_GAME,
            },
        };
        client.emit(respond)
    }
}
