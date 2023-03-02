import React, { useContext } from 'react';
import "./TeacherHomePage.css";
import { AuthContext, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { ClassList } from "../../ClassCode/ClassList";
import { QuizPage } from '../../Quizzes/QuizPage';

export function TeacherHomePage(){
    const user = useContext(AuthContext);
    const current_user = user.user ? user.user : DEFAULT_AUTH_USER;

    
    return (
        <div className="teacher-home">
            <h2>Hello {current_user.username}</h2>
            <br />
            <div>Classes: </div>
            <ClassList classes={current_user.groups}/>
        </div>
    )

}