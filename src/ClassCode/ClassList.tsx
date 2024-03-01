
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get_bank, delete_bank } from "../DatabaseFunctions/BankFunctions";
import { Bank, DEFAULT_BANK, copy_bank } from "../Interfaces/BankObject";
import "./ClassList.css";
import { AuthContext } from "../Authentication/auth";
import { displayPartsToString } from "typescript";


export function ClassList({ classes }: { classes: string[] }): JSX.Element {
    return (
        <div className="class-card-list">
            {classes.map(bank_id => <ClassButton key={bank_id} bank_id={bank_id} />)}
        </div>
    )
}

export function DeleteClass(bank_id: string): void {
    delete_bank(bank_id);
}


function ClassButton({ bank_id }: { bank_id: string }): JSX.Element {
    const [bank, set_bank] = useState<Bank>(copy_bank(DEFAULT_BANK));
    const [show, set_show] = useState(false);

    const user = useContext(AuthContext).user;
    useEffect(() => {
        get_bank(bank_id).then(b => {
            if (b !== null) { set_bank(b); }
        })
    }, []);

    const handleClose = () => set_show(false);
    const handleCloseDelete = () => {set_show(false); DeleteClass(bank_id);};
    const handleShow = () => set_show(true);

    //Only render the button if the AuthUser has a BankUser im the bank or is the teacher
    return bank.studentList.find((bank_user) => bank_user.uid === user.hash) || bank.teacherID === user.hash ? (
        <Card className="class-card" >
            <Card.Body>
                <Card.Header style={{ color: "black", backgroundColor: bank.color }}><h2>{bank.classTitle}</h2></Card.Header>
                <Card.Text>
                    {bank.description}
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Link to={"../" + bank_id}><Button size="lg">Open</Button></Link>
                <Button hidden={!user.isTeacher} variant="danger" onClick={handleShow} size="lg">Delete</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deleting {bank.classTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this class?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button hidden={!user.isTeacher} variant="danger" onClick={handleCloseDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                </div>
            </Card.Body>
        </Card>
    ) : (
        <></>
    )
}