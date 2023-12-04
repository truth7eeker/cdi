import { IQuestion } from "../src/api/schema";

const db: IQuestion[] = [
  {
    id: 1,
    title: "Why do programmers prefer dark mode?",
    answers: [
      { id: 1, title: "Because it's easier on the eyes" },
      { id: 2, title: "Because light attracts bugs" },
      {
        id: 3,
        title: "Because they don't like to see their mistakes"

      },
      { id: 4, title: "Because it makes them look mysterious" }
    ]
  },
  {
    id: 2,
    title: "Why was the JavaScript developer sad?",
    answers: [
      { id: 1, title: "Because he couldn't find his semicolon" },
      { id: 2, title: "Because he got stuck in an infinite loop" },
      { id: 3, title: "Because his code kept returning undefined" },
      { id: 4, title: "Because he didn't Node how to Express himself" }
    ]
  },
  {
    id: 3,
    title: "Why do programmers hate nature?",
    answers: [
      { id: 1, title: "Because it has too many bugs" },
      { id: 2, title: "Because they can't debug the trees" },
      { id: 3, title: "Because it doesn't have Wi-Fi" },
      { id: 4, title: "Because it's not user-friendly" }
    ]
  }
]

let questions: IQuestion[] = [];
let currIndex: number = 0
let points: number = 0;

function startQuiz() {
  questions = db
};

function resetQuiz() {
  questions = [];
  currIndex = 0;
  points = 0;
}

function next() {
  if (currIndex === questions.length - 1) {
    return;
}
  currIndex++
}

function provideFeedback(points:number) {
  const base = `You got ${points} of ${db.length} points.`;
    let feedback = '';

    if (points === db.length) {
        feedback = `Awesome! ${base}`;
    } else if (points === db.length - 1) {
        feedback = `Almost there! ${base}`;
    } else {
        feedback = `${base} Was tricky, huh? Try again!`;
    }
    return feedback;

}

describe("startQuiz", () => {

  it("should get questions",  () => {
    startQuiz();
    expect(questions.length).toBe(3);
  });

  it("should reset everything",  () => {
    questions = db
    currIndex = 1
    points = 1

    resetQuiz()

    expect(questions.length).toBe(0);
    expect(currIndex).toBe(0);
    expect(points).toBe(0);
  });

  it("should increment currentIndex", () => {
    next()

    expect(currIndex).toBe(currIndex++);
  });

  it("should not increment curentIndex if it's the last question", () => {
    currIndex = 3

    const result = next()
    
    expect(result).toEqual(undefined);
  });

  it("should say awesome for max points", async () => {
    points = 3
    
    const result = provideFeedback(points)

    expect(result).toEqual(`Awesome! You got ${points} of 3 points.`);
  });

  it("should say almost there for 1 mistake", async () => {
    points = 2
    
    const result = provideFeedback(points)

    expect(result).toEqual(`Almost there! You got ${points} of 3 points.`);
  });

  it("should say try again for more than 2 mistakes", async () => {
    points = 1
    
    const result = provideFeedback(points)

    expect(result).toEqual(`You got ${points} of 3 points. Was tricky, huh? Try again!`);
  });

});




