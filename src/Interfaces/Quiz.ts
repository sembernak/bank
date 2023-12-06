import { MasteryLevel } from "./BankUser";
import { QuizQuestion, resolve_nullish_quizquestion } from "./QuizQuestion"

export interface Quiz{
    owner: string; //hash id of the teacher who created the quiz

    unit: string; //collection of quizzes that this quiz belongs to

    title: string; //name of quiz

    description: string; //what quiz is on

    money: number; //how much money a student earns for earning a 100% on the quiz
    
    questions: QuizQuestion[]; //the actual questions in the quiz

    hash: string

    allowed_attempts: [number, number, number, number]
}

export function default_quiz(): Quiz {
    return {
        owner: "",
        unit: "0",
        title: "",
        description: "",
        money: 0,
        questions: [],
        hash: "",
        allowed_attempts: [1, 1, 1, 1]
    }
}

export function resolve_nullish_quiz(quiz: Quiz): Quiz {
    return {
        owner: quiz.owner ?? "",
        unit: quiz.unit ?? "0",
        title: quiz.title ?? "",
        description: quiz.description ?? "",
        money: quiz.money ?? 0,
        questions: quiz.questions===undefined ? [] : (
            quiz.questions.map((q: QuizQuestion) => resolve_nullish_quizquestion(q))
        ),
        hash: quiz.hash ?? [],
        allowed_attempts: quiz.allowed_attempts ?? [1, 1, 1, 1]
    }
}