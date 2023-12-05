import { type IQuestion } from './schema';

const getData = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url as RequestInfo | URL);
        return await response.json();
    } catch (error) {
        throw new Error(`${error}`);
    }
};

const checkAnswer = async (url: string, question: IQuestion, selectedId: number): Promise<any> => {
    try {
        const response = await fetch(url as RequestInfo | URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questionID: question.id, userAnswerID: selectedId })
        });

        return await response.json();
    } catch (error) {
        throw new Error(`${error}`);
    }
};

const api = {
    getData,
    checkAnswer
};

export default api;
