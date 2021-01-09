import { User } from './user';
import { Question } from './question';
import { Game } from './game';

export class Answer {
    _id: Number;
    creator: User;
    text: String;
    createdAt: Date;
    pickedBy: User[];
    fromQuestion: Question;
    game: Game;
}
