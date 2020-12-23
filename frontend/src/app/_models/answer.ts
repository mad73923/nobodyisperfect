import { User } from './user';
import { Question } from './question';

export class Answer {
    _id: Number;
    creator: User;
    text: String;
    createdAt: Date;
    pickedBy: User[];
    fromQuestion: Question;
}
