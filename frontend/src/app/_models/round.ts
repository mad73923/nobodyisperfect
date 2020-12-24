import { User } from './user';
import { Question } from './question';
import { Game } from './game';
import { Answer } from './answer';

export class Round {
    _id: Number;
    currentQuestion: Question;
    fromGame: Game
    correctAnswerPickedBy: User[];
    answers: Answer[];
    reader: User;
    createdAt: Date;
}
