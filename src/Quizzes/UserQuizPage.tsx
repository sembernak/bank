import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";
import { AuthContext } from "../Authentication/auth";
import { Quiz } from "../Interfaces/Quiz";
import { get_quizzes, update_quiz } from "../DatabaseFunctions/QuizFunctions";
import "./UserQuizPage.css"
import { EditQuizModal } from "./EditQuiz";
import { ImportQuiz } from "./ImportQuiz";

export function TestAccordion({quizList, enableDropping, handleDragStart, handleDrop, handleDragOverStart, handleDragOverEnd} :
    {   quizList : Quiz[], 
        enableDropping: (event: React.DragEvent<HTMLDivElement>)=> void,
        handleDragStart: (event: React.DragEvent<HTMLDivElement>, quiz: Quiz)=> void,
        handleDrop: (event: React.DragEvent<HTMLDivElement>)=> void,
        handleDragOverStart: ()=> void,
        handleDragOverEnd: ()=> void }): JSX.Element {
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

    return <Accordion id={quizList[0].unit} onDragOver={enableDropping}
    onDrop={handleDrop}
    onDragEnter={handleDragOverStart}
    onDragLeave={handleDragOverEnd}>
        <Accordion.Header className="unit-accordion">Unit {quizList[0].unit}</Accordion.Header>
        <Accordion.Body>
            {quizList.map((q, index) => <QuizCard handleDragStart={handleDragStart} key={index} quiz={q} set_quiz={(new_quiz)=>set_quiz_at_index(index, new_quiz)}/>)}
        </Accordion.Body>
    </Accordion>
}

export function UserQuizPage(): JSX.Element {
    const user = useContext(AuthContext).user;
    const [quizzes, set_quizzes] = useState<Quiz[]>([]);
    const [, setDragOver] = React.useState(false);
    const handleDragOverStart = () => setDragOver(true);
    const handleDragOverEnd = () => setDragOver(false);

    useEffect(() => {
        get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz))
    }, [user])

    const assignUnits = (quizzes : Quiz[]) => {
        const units: { [unit: string] : Quiz[]; } = {};

        for (const quiz of quizzes) {
            if (units[quiz.unit]) {
                units[quiz.unit].push(quiz);
            } else {
                units[quiz.unit] = [quiz];
            }
        }

        return units;
    }

    const handleDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        quiz: Quiz
    ) => {
        event.dataTransfer.setData("text", JSON.stringify(quiz));
    };

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData("text");
        console.log(id);
        const newUnit = event.currentTarget as Element; //unit where the quiz was dropped
        const tempQuiz = JSON.parse(event.dataTransfer.getData("text"));
        const newQuiz = {
            ...tempQuiz,
            unit: newUnit.id
        };

        update_quiz(newQuiz).then(() => {
            get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz));
        });

        setDragOver(false);
    }

    return (
        <Container fluid className="user-quiz-page">
            <h1>Your Quizzes</h1>
            <div className="quiz-list">
                {Object.keys(assignUnits(quizzes)).map((key) => <TestAccordion enableDropping={enableDropping} handleDragOverStart={handleDragOverStart} handleDragStart={handleDragStart} handleDrop={handleDrop} handleDragOverEnd={handleDragOverEnd} quizList={assignUnits(quizzes)[key]}></TestAccordion>)}
            </div>
            <Row>
                <Col style={{textAlign: "right"}}><ImportQuiz/></Col>
                <Col style={{textAlign: "left"}}><Link to="/teachers/createquiz"><Button size="lg">Create A New Quiz</Button></Link></Col>
            </Row>
        </Container>
    )
}

function QuizCard({quiz, set_quiz, handleDragStart}: {quiz: Quiz, set_quiz: (new_quiz: Quiz)=>void, handleDragStart(event: React.DragEvent<HTMLDivElement>,
    quiz: Quiz)}): JSX.Element {
    function save_quiz(quiz: Quiz) {
        //save quiz to database then update the quizzes state since onValue isn't used
        update_quiz(quiz).then(() => {
            set_quiz(quiz);
        });
    }

    return (
        <div draggable={true} onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, quiz)}>
            <Card className="quiz-card">
                <Card.Header><h3>{quiz.title}</h3></Card.Header>
                <Card.Body>
                    <div>{quiz.description}</div>
                    <div>{quiz.questions.length} questions</div>
                </Card.Body>
                <Card.Footer><EditQuizModal quiz={quiz} save={save_quiz}/></Card.Footer>
            </Card>
        </div>
    )
}