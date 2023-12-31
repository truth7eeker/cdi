import api from './api/api';
import { type IAnswer, type IQuestion } from './api/schema';
import 'style.scss';

const BASE_URL = process.env.QUIZ_URL;

let questions: IQuestion[] = [];
let currIndex: number = 0;
let isChecked: boolean = false;
let points: number = 0;

const quizTemplate = `<div class="quiz__content">
            <h3 class="quiz__subtitle"> </h3>
            <h2 class="quiz__title"></h2>
            <ul class="quiz__options">
            </ul>
            <button type="button" class="quiz__btn"></buton>
          </div>`;

const resetQuiz = () => {
    questions = [];
    handleCheckedFlag(false);
    currIndex = 0;
    points = 0;
};

const handleCheckedFlag = (val: boolean) => {
    isChecked = val;
};

// fetch data and render basic quiz structure
const startQuiz = async () => {
    const wrapper = document.querySelector('.quiz');
    resetQuiz();

    questions = await api.getData(`${BASE_URL}/questions`);

    if (questions && questions.length > 0) {
        wrapper.innerHTML = quizTemplate;
        createQuestion();
    }
};

const next = () => {
    if (currIndex === questions.length - 1) {
        return;
    }

    if (!isChecked) {
        alert('Select one option');
        return;
    } else {
        currIndex = currIndex + 1;
        createQuestion();
        //  answer can be selected
        handleCheckedFlag(false);
    }
};

const createEl = (id: number, title: string) => {
    const list = document.querySelector('.quiz__options');
    const options = document.querySelectorAll('.quiz__option');

    if (options.length === 4) {
        return;
    } else {
        const li = document.createElement('li');
        li.textContent = title;
        li.classList.add('quiz__option');
        li.setAttribute('data-answer-id', id.toString());
        li.addEventListener('click', async () => { await select(id); });
        list.append(li);
    }
};

const updateEl = (className: string, text: string) => {
    const el = document.querySelector(className);
    el.textContent = text;
};

const handleClass = (
    selectedID: number,
    correctID: number,
    currID: number,
    option: HTMLUListElement
) => {
    const isUserCorrect = correctID === Number(selectedID);
    const isTargetCorrect = currID === correctID;
    const isTargetIncorrect = currID === Number(selectedID);

    // after the correct answer is revealed, no more selections
    if (isChecked) {
        return;
    }

    if ((isUserCorrect && isTargetCorrect) || isTargetCorrect) {
        option.classList.add('correct');
    } else if ((!isUserCorrect && isTargetIncorrect) || isTargetIncorrect) {
        option.classList.add('incorrect');
    }
};

const handleBtn = (text: string, func: () => void) => {
    const btn = document.querySelector('.quiz__btn');

    btn.textContent = text;
    btn.addEventListener('click', func);
};

const provideFeedback = () => {
    const base = `You got ${points} of ${questions.length} points.`;
    let feedback = '';

    if (points === questions.length) {
        feedback = `Awesome! ${base}`;
    } else if (points === questions.length - 1) {
        feedback = `Almost there! ${base}`;
    } else {
        feedback = `${base} Was tricky, huh? Try again!`;
    }
    return feedback;
};

const showResults = () => {
    const wrapper = document.querySelector('.quiz');
    wrapper.innerHTML = `<div class="quiz__content quiz__results">
   <h3>${provideFeedback()}</h3>
   <button type="button" class="quiz__btn"></button>
   </iv>`;

    handleBtn('Play again', startQuiz);
};

const select = async (selectedID: number) => {
    const { correctID, result } = await api.checkAnswer(
        `${BASE_URL}/answer`,
        questions[currIndex],
        selectedID
    );
    const options = document.querySelectorAll('.quiz__option');

    if (isChecked) {
        return;
    }

    options.forEach((option: HTMLUListElement) => {
        handleClass(selectedID, correctID, Number(option.getAttribute('data-answer-id')), option);
    });

    if (currIndex > questions.length - 2) {
        handleBtn('Show results', showResults);
    }

    //  revealed the correct answer, no more attempts
    handleCheckedFlag(true);
    points = result;
};

const createQuestion = () => {
    const options = document.querySelectorAll('.quiz__option');
    const currQ = questions[currIndex];

    //  insert title for the current question
    updateEl('.quiz__subtitle', `Question ${currQ.id}/${questions.length}`);
    updateEl('.quiz__title', currQ.title);

    //  create li elements for options or update their text
    currQ.answers.map((answer: IAnswer, id: number) => {
        if (options.length > 0) {
            options[id].textContent = answer.title;
            options[id].setAttribute('data-answer-id', answer.id.toString());
        } else {
            createEl(answer.id, answer.title);
        }
        return answer;
    });

    //  reset options' classes
    options.forEach((option) => {
        option.classList.remove('correct');
        option.classList.remove('incorrect');
    });

    handleBtn('Next', next);
};

window.onload = startQuiz;

// needed for tests

const quiz = {
    BASE_URL,
    startQuiz,
    next,
    resetQuiz,
    quizTemplate,
    handleCheckedFlag,
    showResults,
    handleBtn,
    provideFeedback,
    get questions () { return questions; },
    get currIndex () { return currIndex; },
    get points () { return points; },
    set points (val: number) { points = val; }
};

export default quiz;
