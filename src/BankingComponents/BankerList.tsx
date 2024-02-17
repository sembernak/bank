import React, { useContext, useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { Bank } from "../Interfaces/BankObject";
import { AuthUser, DEFAULT_AUTH_USER } from "../Interfaces/AuthUser";
import { compareDates, Transaction } from '../Interfaces/Transaction'; //Used to sort the passed in Transactions by date
import { get_auth_users } from "../DatabaseFunctions/UserFunctions";
import { BankUser, MasteryLevel, Role, getTitle } from "../Interfaces/BankUser";
import './ViewTransactions.css'
import { Icon } from "../Avatar/Icon";

export interface UserPair {
    auth_user: AuthUser,
    bank_user: BankUser
}

export function BankerList(
    {current_bank}: {current_bank: Bank}
): JSX.Element {
    const [studentList, setStudentList] = useState<UserPair[]>([]);
    
    useEffect(() => {
        get_auth_users(current_bank.studentList.map(user => user.uid)).then((auth_users: AuthUser[]) => {
            const pairs: UserPair[] = current_bank.studentList.map(bank_user => {
                return {
                    auth_user: auth_users.find(user => user.hash === bank_user.uid) ?? {...DEFAULT_AUTH_USER, username: "DELETED USER"},
                   bank_user: bank_user
                }
            })
            setStudentList(pairs);
        })
    }, [current_bank]);

    return (
        <Container style={{paddingTop: "6vh"}} fluid >
            <h2 className="student-list-header">Ledger</h2>
            <Table style={{ backgroundColor: "#FCF5E5" }} striped hover bordered className="student-table">
                <thead className="student-table-header">
                    <tr>
                        <th><h3>Username</h3></th>
                        <th><h3>Role</h3></th>
                        <th><h3>Balance</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((user_pair, index) => <StudentRow key={index} user_pair={user_pair} />)}
                </tbody>
            </Table>
        </Container>
    )

}

function StudentRow({user_pair}: {user_pair: UserPair}): JSX.Element {
    const bank_user = user_pair.bank_user;
    const auth_user = user_pair.auth_user;

    return (
        <>
            <tr className="student-row">
                <td>
                    <Icon avatar={auth_user.avatar}></Icon>
                    {bank_user.alias==="" ? auth_user.username : bank_user.alias}
                </td>
                <td>{getTitle(bank_user.role)}</td>
                <td>{bank_user.balance}</td>
            </tr>
        </>
    )
}