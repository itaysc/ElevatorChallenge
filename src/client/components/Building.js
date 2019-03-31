import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import BuildingFloors from './BuildingFloors';
import Elavator from './Elevator';
import Floor from './Floor';

const Building = (props)=>{

    //const [elevators, setElevators] = useState([]);

    function renderElevators(){
        let elevators = [];
        for(let i = 0; i < props.numOfElevators; i++){
            let currFloor =( props.currFloors.length > 0 && props.currFloors[i])? props.currFloors[i]: 0;
            let isStopping = props.stoppedElevators.includes(i);
            elevators.push(
                    <Elavator key={`elevator${i}`} 
                        elevatorNum={i}
                        currFloor={currFloor} 
                        tasks={props.elevatorTasks[i]}
                        onFloorArrival={props.onFloorArrival}
                        changeElevatorCurrFloor={props.changeElevatorCurrFloor}
                        isStopping={isStopping}/>
                );
        }

        return elevators;
    }

    function renderFloors(){
        let floors = [];
        for(let i = (props.numOfFloors -1); i >= 0 ; i--){
            let isAwaiting= props.awaitingReservations.includes(i);
            let waitingTime = props.waitingTimes && props.waitingTimes[i]?props.waitingTimes[i]: 0;
            if(i === 0){ // Initially set elevators at floor 0
                floors.push(
                    <div key={`floor${i}`} style={{display:'flex'}}>
                        <Floor key={`floor${i}`} 
                            floorNum={i} 
                            addReservation={props.addReservation}
                            isAwaiting={isAwaiting}
                            secondsRemaining={waitingTime}/>
                        { renderElevators() }
                    </div>
                );
            }else{
                
                floors.push(<Floor key={`floor${i}`} 
                                floorNum={i} 
                                addReservation={props.addReservation}
                                isAwaiting={isAwaiting}
                                secondsRemaining={waitingTime}
                                />);
            }
            
        }

        return floors;
    }

    return (
        <div className="buildingContainer">
            <BuildingFloors 
                numOfFloors={props.numOfFloors} 
                numOfElevators={props.numOfElevators}
                renderFloors={renderFloors}
            />
        </div>
    )
}

Building.propTypes = {
    awaitingReservations: PropTypes.arrayOf(PropTypes.number),
    addReservation: PropTypes.func.isRequired,
    numOfFloors: PropTypes.number.isRequired,
    numOfElevators: PropTypes.number.isRequired,
    currFloors: PropTypes.arrayOf(PropTypes.number),
    elevatorTasks: PropTypes.array,
    onFloorArrival: PropTypes.func,
    waitingTimes: PropTypes.array,
    changeElevatorCurrFloor: PropTypes.func,
    stoppedElevators: PropTypes.arrayOf(PropTypes.number)
}


export default Building;