import {Button, Form} from 'react-bootstrap'
import { ref, getDatabase, update, onValue, set} from '@firebase/database';
import "../firebase";
import {Bank} from "../Interfaces/BankObject"
import React, { useContext, useState } from 'react';
import { AuthContext, getCurrentUser } from "../Authentication/auth";
import { BankUser } from "../Interfaces/BankUser";
import { NoUserPage } from "../Authentication/NoUserPage/NoUserPage";

export function ClassCodeForm(){
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<BankUser>();
    const [className,setClassName] = useState<string>('');
    
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in

    if(!userObj) getCurrentUser(userContext.state, setUserObj);

    function updateClassName(event: React.ChangeEvent<HTMLInputElement>){
        setClassName(event.target.value)
    }

    function createCode(){
        if (className===''){
            alert("Please enter a class name")
            return 
        }
        let codeExists=true
        let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
        let code=""
        while(codeExists)
            codeExists=false
            for (var i=0;i<6;i++){
                code+=characters.charAt(Math.floor(Math.random()*characters.length))
            }
            onValue(ref(getDatabase(),"/groups"),ss=>{
                let groupObj=ss.val();
                if (groupObj!==null){
                    let groupIDS=Object.keys(groupObj);
                    groupIDS.forEach(key => {if(key===code) codeExists=true})
                }
            })
        alert(code)
        let newBank: Bank={
            bankId:code,
            teacherID:userObj? userObj.id: '',
            studentList:['placeholder'],
            classTitle:className,
        }
        userObj? userObj.groups.push(code+className): code='';
        update(ref(getDatabase(),"/groups/"+code),{bankObj:newBank});
        if(userObj){
            if(userContext.state){
                set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups);
            }
        }
        window.location.reload()
    }

    return (<div>
        <Form.Group controlId="createClass">
            <Form.Control
                value={className}
                onChange={updateClassName}/>
            <Button onClick={createCode}>Create Class Code</Button>
        </Form.Group>
    </div>)
}
