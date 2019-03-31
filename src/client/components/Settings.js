import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Button} from 'react-bootstrap';

const Settings = (props)=>{
    const [numOfFloors, setNumOfFloors] = useState(5);
    const [numOfElevators, setnumOfElevators] = useState(1);

    function onFloorsChange(e){
        let floorNum = e.target.value;
        if(!isNaN(floorNum)){
            setNumOfFloors(parseInt(floorNum));
        }
    }
    function onNumElevatorsChanged(e){
        let elevatorNum = e.target.value;
        if(!isNaN(elevatorNum)){
            setnumOfElevators(parseInt(elevatorNum));
        }
    } 

    return (
        <Form className="settings" >
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2} xs={2} md={2} lg={2}>
                     מספר הקומות:
                </Form.Label>
                <Col  sm={1} xs={1} md={1} lg={1}>
                     <Form.Control type="text" value={numOfFloors} onChange={onFloorsChange}/>
                </Col>
                <Form.Label column sm={2} xs={2} md={2} lg={2}>
                     מספר המעליות:
                </Form.Label>
                <Col  sm={1} xs={1} md={1} lg={1}>
                <Form.Control type="text" value={numOfElevators} onChange={onNumElevatorsChanged}/>
                </Col>
                <Col  sm={1} xs={1} md={1} lg={1}>
                    <Button onClick={()=>props.onSelectClick(numOfFloors, numOfElevators)}>בחר</Button>
                </Col>
            </Form.Group>
        </Form>
    )
}

Settings.propTypes = {
    floors: PropTypes.number,
    onSelectClick: PropTypes.func.isRequired
}

Settings.defaultProps = {
    floors: 5,
    onSelectClick: (floors, elevators)=>false
}

export default Settings;