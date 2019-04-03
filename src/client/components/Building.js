import React, {Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import BuildingFloors from './BuildingFloors';
import Elavator from './Elevator';
import Floor from './Floor';
import {MainContext} from '../pages/Main';

const Building = (props)=>{

    const context = useContext(MainContext);

    function renderElevators(){
        let elevators = [];
        for(let i = 0; i < context.numOfElevators; i++){
            let currFloor =( context.currFloors.length > 0 && context.currFloors[i])? context.currFloors[i]: 0;
            let waitingOnFloor = context.stoppedElevators.includes(i);
            elevators.push(
                    <Elavator key={`elevator${i}`} 
                        elevatorNum={i}
                        currFloor={currFloor} 
                        tasks={context.elevatorTasks[i]}
                        waitingOnFloor={waitingOnFloor}
                        />
                );
        }

        return elevators;
    }

    function renderFloors(){
        let floors = [];
        for(let i = (context.numOfFloors -1); i >= 0 ; i--){
            let isAwaiting= context.awaitingReservations.includes(i);
            let waitingTime = context.waitingTimes && context.waitingTimes[i]?context.waitingTimes[i]: 0;
            if(i === 0){ // Initially set elevators at floor 0
                floors.push(
                    <div key={`floor${i}`} style={{display:'flex'}}>
                        <Floor key={`floor${i}`} 
                            floorNum={i} 
                            addReservation={context.addReservation}
                            isAwaiting={isAwaiting}
                            secondsRemaining={waitingTime}/>
                        { renderElevators() }
                    </div>
                );
            }else{
                
                floors.push(<Floor key={`floor${i}`} 
                                floorNum={i} 
                                addReservation={context.addReservation}
                                isAwaiting={isAwaiting}
                                secondsRemaining={waitingTime}
                                />);
            }
            
        }

        return floors;
    }

    return (
        <div className="buildingContainer">
            <BuildingFloors  renderFloors={renderFloors}/>
        </div>
    )
}


export default Building;