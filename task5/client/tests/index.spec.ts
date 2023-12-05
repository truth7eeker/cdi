import { IQuestion } from '../src/api/schema';
import api from '../src/api/api';
import quiz from '../src/main';

const db: IQuestion[] = [
    {
        id: 1,
        title: 'Why do programmers prefer dark mode?',
        answers: [
            { id: 1, title: 'Because it\'s easier on the eyes' },
            { id: 2, title: 'Because light attracts bugs' },
            {
                id: 3,
                title: 'Because they don\'t like to see their mistakes'

            },
            { id: 4, title: 'Because it makes them look mysterious' }
        ]
    },
    {
        id: 2,
        title: 'Why was the JavaScript developer sad?',
        answers: [
            { id: 1, title: 'Because he couldn\'t find his semicolon' },
            { id: 2, title: 'Because he got stuck in an infinite loop' },
            { id: 3, title: 'Because his code kept returning undefined' },
            { id: 4, title: 'Because he didn\'t Node how to Express himself' }
        ]
    },
    {
        id: 3,
        title: 'Why do programmers hate nature?',
        answers: [
            { id: 1, title: 'Because it has too many bugs' },
            { id: 2, title: 'Because they can\'t debug the trees' },
            { id: 3, title: 'Because it doesn\'t have Wi-Fi' },
            { id: 4, title: 'Because it\'s not user-friendly' }
        ]
    }
]

describe('quiz functionality', () => {

    beforeEach(async () => {
        document.body.innerHTML = `<div class="quiz">${quiz.quizTemplate}</div>`
        spyOn(api, 'getData').and.returnValue(Promise.resolve(db));
        await quiz.startQuiz()
    })

    it("should get questions", async () => {
        expect(api.getData).toHaveBeenCalledWith(`${quiz.BASE_URL}/questions`);
        expect(quiz.questions.length).toBe(db.length);
    });

    it("should reset everything", () => {
        quiz.resetQuiz()

        expect(quiz.questions.length).toBe(0);
        expect(quiz.currIndex).toBe(0);
        expect(quiz.points).toBe(0);
    });

    it('should increment currentIndex', async () => {
      
        quiz.handleCheckedFlag(true);
        quiz.next();
        expect(quiz.currIndex).toBe(1);

        quiz.handleCheckedFlag(true);
        quiz.next();
        expect(quiz.currIndex).toBe(2);

    });

    it('should not increment curentIndex for the last question', async () => {
        quiz.resetQuiz();

        expect(quiz.currIndex).toEqual(0);

        await quiz.startQuiz()
        quiz.handleCheckedFlag(true);
        quiz.next();
        expect(quiz.currIndex).toBe(1);

        quiz.handleCheckedFlag(true);
        quiz.next();
        expect(quiz.currIndex).toBe(2);

        quiz.handleCheckedFlag(true);
        quiz.next();
        expect(quiz.currIndex).toBe(2);
    });

    it('shoud alert if answer isn\'t selected', async() => {
        spyOn(window, 'alert');

        quiz.handleCheckedFlag(false)
        quiz.next();

        expect(window.alert).toHaveBeenCalledWith('Select one option')
    })

    it('should send correct answer id and total points', async () => {
        spyOn(api, 'checkAnswer').and.returnValue(Promise.resolve({correctID: 2, result: 3}))

        const {result, correctID } = await api.checkAnswer(`${quiz.BASE_URL}/answer`, db[3], 2);

        expect(result).toBe(3);
        expect(correctID).toBe(2)
    })

    it('should not increment points if answer is incorrect', async () => {
        spyOn(api, 'checkAnswer').and.returnValue(Promise.resolve({correctID: 2, result: 2}))

        const {result, correctID } = await api.checkAnswer(`${quiz.BASE_URL}/answer`, db[3], 2);

        expect(result).toBe(2);
        expect(correctID).toBe(2)
    })

    it('should show results', () => {
        spyOn(quiz, 'handleBtn').and.callThrough()

        quiz.showResults()

        const result = document.querySelector('.quiz__results');
        const feedback = document.querySelector('.quiz__results h3').textContent;

        expect(result).toBeDefined()
        expect(feedback).toBeDefined()
  
    })

    it('should provide feedback', () => {
        quiz.points = 3
        const maxRes = quiz.provideFeedback()
        expect(maxRes).toBe(`Awesome! You got ${quiz.points} of ${db.length} points.`)

        quiz.points = 2
        const averRes = quiz.provideFeedback()
        expect(averRes).toBe(`Almost there! You got ${quiz.points} of ${db.length} points.`)

        quiz.points = 1
        const lowRes = quiz.provideFeedback()
        expect(lowRes).toBe(`You got ${quiz.points} of ${db.length} points. Was tricky, huh? Try again!`)

    })
});




