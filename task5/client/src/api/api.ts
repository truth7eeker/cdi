import { IQuestion } from './schema';

export const getData = async (url: string) => {
   try {
      const response = await fetch(url as RequestInfo | URL);
      return response.json();
   }
   catch (error) {
      throw new Error(`${error}`)
   }
}


export const checkAnswer = async (url: string, question: IQuestion, selectedId: number) => {
   try {
      const response = await fetch(url as RequestInfo | URL, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ questionID: question.id, userAnswerID: selectedId }),
      });

      return response.json();
   } catch (error) {
      throw new Error(`${error}`)
   }

};

