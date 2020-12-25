import { User } from './user';
import { Round } from './round';

export class Game {
    _id: Number;
    name: String;
    gameMaster: User;
    createdAt: Date;
    players: User[];
    currentState: String;
    stateUntil: Date;
    currentRound: Round;
}
