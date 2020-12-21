export class Game {
    _id: Number;
    name: string;
    gameMaster: Number;
    createdAt: Date;
    players: Number[];
    currentQuestion: Number;
    currentState: String;
}
