export interface IAnswer {
    id: number;
    title: string;
    isCorrect?: boolean
}

export interface IQuestion {
    id: number;
    title: string;
    answers: IAnswer[]
}

