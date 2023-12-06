import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";
import { AuthContext } from "../Authentication/auth";
import { Quiz } from "../Interfaces/Quiz";
import { get_quizzes, update_quiz } from "../DatabaseFunctions/QuizFunctions";
import "./UserQuizPage.css"
import { EditQuizModal } from "./EditQuiz";
import { ImportQuiz } from "./ImportQuiz";
import { DownloadTemplate } from "./DownloadTemplate";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

export function TestAccordion({quizList} : {quizList : Quiz[]}): JSX.Element {
    const user = useContext(AuthContext).user;
    const [quizzes, set_quizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz))
    }, [user]);

    function set_quiz_at_index(index: number, new_quiz: Quiz) {
        set_quizzes(
            quizzes.map((quiz, ind) => index===ind ? new_quiz : quiz)
        );
    }

    return <Accordion>
        <Accordion.Header>Unit {quizList[0].unit}</Accordion.Header>
        <Accordion.Body>
            {quizList.map((q, index) => <QuizCard key={index} quiz={q} set_quiz={(new_quiz)=>set_quiz_at_index(index, new_quiz)}/>)}
        </Accordion.Body>
    </Accordion>
}

export function UserQuizPage(): JSX.Element {
    const user = useContext(AuthContext).user;
    const units: { [unit: string] : Quiz[]; } = {};
    const [quizzes, set_quizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz))
    }, [user])
    
    for (const quiz of quizzes) {
        if (units[quiz.unit]) {
            units[quiz.unit].push(quiz);
        } else {
            units[quiz.unit] = [quiz];
        }
    }

    function set_quiz_at_index(index: number, new_quiz: Quiz) {
        set_quizzes(
            quizzes.map((quiz, ind) => index===ind ? new_quiz : quiz)
        );
    }

    return (
        <Container fluid className="user-quiz-page">
            <h1>Your Quizzes</h1>
            <div className="quiz-list">
                {Object.keys(units).map((key) => <TestAccordion quizList={units[key]}></TestAccordion>)}
            </div>
            <Row>
                <Col style={{textAlign: "right"}}><ImportQuiz/></Col>
                <Col style={{textAlign: "left"}}><Link to="/teachers/createquiz"><Button size="lg">Create A New Quiz</Button></Link></Col>
            </Row>
        </Container>
    )
}

function QuizCard({quiz, set_quiz}: {quiz: Quiz, set_quiz: (new_quiz: Quiz)=>void}): JSX.Element {
    function save_quiz(quiz: Quiz) {
        //save quiz to database then update the quizzes state since onValue isn't used
        update_quiz(quiz).then(() => {
            set_quiz(quiz);
        });
    }

    return (
        <Card className="quiz-card">
            <Card.Header><h3>{quiz.title}</h3></Card.Header>
            <Card.Body>
                <div>{quiz.description}</div>
                <div>{quiz.questions.length} questions</div>
            </Card.Body>
            <Card.Footer><EditQuizModal quiz={quiz} save={save_quiz}/></Card.Footer>
        </Card>
    )
}