import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users: number = 0;
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
                code: 'UNDEFINED',
            },
        };
        switch (data.type) {
            case 'JOIN_GAME':
                // Check if game exist
                if (!this.gameRoom[data.code]) {
                    respond.data.code = 'INVALID_CODE';
                } else {
                    respond.data.code = 'JOIN_GAME';
                    respond.data.data = this.gameRoom[data.code];
                }
                break;
        }
        console.log(respond)
        return respond;
    }
}
