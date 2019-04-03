import React, {Fragment, useContext} from 'react';
import PropTypes from 'prop-types';
import elvImg from '../../assets/images/elv.png';
import { Animate } from 'react-move';
import {MainContext} from '../pages/Main';

const BRICK_HEIGHT = 110;
const BRICK_BORDER = 7;
let needToSetInterval = true;

const Elevator =  (props)=>{

    const context = useContext(MainContext);


    function getDistanceBetweenFloors(){
        if(props.tasks && props.tasks.length > 0){
            let direction = (props.currFloor > props.tasks[0].floor)? 1: -1;
            let floorDiff = Math.abs((props.currFloor - props.tasks[0].floor));
            let heightToTravel = ((floorDiff * direction * BRICK_HEIGHT)+(floorDiff * BRICK_BORDER));
            return {
                distance: heightToTravel,
                duration: 500 * floorDiff,
                floorDiff,
                direction
            };
        }else{
            return {
                distance: 0,
                duration: 0,
                floorDiff: 0,
                direction: 1
            };
        }
    }

    return (
        <Fragment>
            <Animate
            start={() => ({
                y: 0
            })}

            update={({y}) => {
                    let hasTasks = props.tasks && props.tasks.length>0; 
                    let elem = document.getElementById(`elevator${props.elevatorNum}`)
                    let {distance, duration, floorDiff, direction} = getDistanceBetweenFloors();
                    if(hasTasks && !props.waitingOnFloor && props.tasks[0].started){
                        let x = 0; 
                        let currFloor = props.currFloor;
                        // follow the elevator with its route- mark each floor.
                        let floor = props.tasks[0].floor;
                        if(needToSetInterval){
                            needToSetInterval = false;
                            var intervalID = setInterval(increamentFloor, 500);
                        }
                       
                        function increamentFloor(){
                            x++;
                            if (x === floorDiff) {
                                x = 0;
                                needToSetInterval=true;
                                clearInterval(intervalID);
                                context.onFloorArrival(props.elevatorNum, floor);// mark arrival
                                //context.reduceFloorWaitingTime(floor);
                            }else{
                                //context.reduceFloorWaitingTime(floor);
                                context.changeElevatorCurrFloor(props.elevatorNum, (x + currFloor), floor);
                            }
                        }
                    }
                    return({
                        y: [(hasTasks && !props.waitingOnFloor) ? distance : 0/*elem.style.top*/],
                        timing: { duration:duration/*, ease: easeExpOut*/ },
                    })
                
            }}
         >

            {
                (state)=>{
                    let {y} = state;
                    let yPos = `${props.currFloor * -103}px`;

                    return (
                        <div
                            id= {`elevator${props.elevatorNum}`}
                            className='translationDiv' style={{
                            WebkitTransform: `translate3d(0, ${y}px, 0)`,
                            transform: `translate3d(0, ${y}px, 0)`,
                            top: yPos,
                            position:'relative'
                        }}>
                            <img className="elvPng" src ={elvImg}/>
                        </div>
                    )
                }
            }

        </Animate>
        <audio id={`dingSound${props.elevatorNum}`}>
            <source src={require('../../assets/mp3/ding.mp3')} type="audio/mpeg"/>
        </audio>
        </Fragment>
        
    )
}

Elevator.propTypes = {
    tasks: PropTypes.array,
    currFloor: PropTypes.number,
    elevatorNum: PropTypes.number,
    waitingOnFloor: PropTypes.bool
}

export default Elevator;