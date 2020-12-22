import { User } from './user';

export class Question {
    _id: Number;
    text: string;
    correctAnswer: string;
    creator: User;
    createdAt: Date;
    accepted: Boolean;
    imagePath: string;
}
