import { User } from './user';

export class Game {
    _id: Number;
    name: string;
    gameMaster: User;
    createdAt: Date;
    players: User[];
    currentQuestion: Number;
    currentState: String;
}
