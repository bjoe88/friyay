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
    GET_CLIENT_CODE = 'GET_CLIENT_CODE',
    SEND_CLIENT_CODE = 'SEND_CLIENT_CODE',
    INVALID_CODE = 'INVALID_CODE',
    NEW_GAME = 'NEW_GAME',
    JOIN_GAME = 'JOIN_GAME',
    START_GAME = 'START_GAME',
    QUESTION = 'QUESTION',
    RESULT = 'RESULT',
    ANSWER = 'ANSWER',
    ENDGAME = 'ENDGAME',
}

enum AdminStatus { INVALID_CODE = 'INVALID_CODE', START_GAME = 'START_GAME' }

enum GameRoomStatus { NEW_GAME = 0, START_GAME = 1, END_GAME = 2 }

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users: number = 0;
    questions: any = JSON.parse(Fs.readFileSync('./src/questions.json', 'utf8'));
    gameRoom: any = {
        1: {
            clients: [],
            status: GameRoomStatus.NEW_GAME,
            metadata: [],
            clientData: []
        },
    };
    clientIdMapKey = {};

    async handleConnection(client: any) {
        this.users++;
        client.emit('msg', { code: ClientStatus.GET_CLIENT_CODE });
    }

    async handleDisconnect() {
        this.users--;
    }

    @SubscribeMessage('msg')
    handleEvent(client, data: { type: string, code?: string, clientKey?: string }): WsResponse<unknown> {
        const self = this;
        const event = 'msg';
        const respond: any = {
            event, data: {
                code: ClientStatus.INVALID_CODE,
            },
        };
        if (data.type === ClientStatus.SEND_CLIENT_CODE) {
            self.clientIdMapKey[client.id] = data.clientKey;
            return;
        }
        if (!self.clientIdMapKey[client.id]) {
            client.emit('msg', { code: ClientStatus.GET_CLIENT_CODE });
            return;
        }
        switch (data.type) {
            case ClientStatus.JOIN_GAME:
                // Check if game exist
                const gameRoom = self.gameRoom[data.code];
                if (!gameRoom) {
                    respond.data.code = ClientStatus.INVALID_CODE;
                } else {
                    gameRoom.clients.push(client);
                    respond.data.code = ClientStatus.JOIN_GAME;
                    respond.data.data = gameRoom.metadata;
                }

                //Link with user if exist. else create new link
                let gameRoomClient = gameRoom.clientData[self.clientIdMapKey[client.id]];
                if (!gameRoomClient) {
                    gameRoomClient = gameRoom.clientData[self.clientIdMapKey[client.id]] = {
                        question: 0,
                    };
                }
                client.emit('msg', respond.data);
                if (gameRoom.status === GameRoomStatus.START_GAME) {
                    self.sendQuestion(gameRoom, client);
                }
                break;
        }
        return;
    }


    @SubscribeMessage('msgAdmin')
    handleEventAdmin(admin, data: { type: string, code: string }): WsResponse<unknown> {
        const self = this;
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
                    gameRoom.status = GameRoomStatus.START_GAME;
                    gameRoom.clients.forEach(client => {
                        this.adminStartClient(client);
                        this.sendQuestion(gameRoom, client);
                    });
                    respond = null;
                }
                break;
        }
        return respond;
    }

    adminSendClientQuestion(question, client) {
        const respond: any = {
            event: 'msg',
            data: {
                code: ClientStatus.QUESTION,
                question,
            },
        };
        client.emit(respond.event, respond.data);
    }

    adminStartClient(client) {
        const respond: any = {
            event: 'msg',
            data: {
                code: ClientStatus.START_GAME,
            },
        };
        client.emit(respond.event, respond.data);
    }

    sendQuestion(gameRoom, client) {
        const self = this;
        const question = { ...(self.getQuestion(gameRoom.clientData[self.clientIdMapKey[client.id]].question)) };
        question.question.answer = null;
        this.adminSendClientQuestion(question, client);
    }

    getQuestion(questionNumber) {
        const self = this;
        return self.questions[questionNumber];
    }
}
