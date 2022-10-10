import { LogoutButton } from "../Logout/Logout";
import {useNavigate} from 'react-router-dom';
import React from 'react';
import { AvatarForm } from "../Avatar/Avatar";

export function StudentHomePage(){
    return (<div>
        <LogoutButton></LogoutButton>
        <AvatarForm></AvatarForm>
    </div>)
}