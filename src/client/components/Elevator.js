import React, {Fragment, Component, useState} from 'react';
import PropTypes from 'prop-types';
import elvImg from '../../assets/images/elv.png';
import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'
import directions from '../../helpers/directions';
import animate from '../../helpers/animate';
//import Bell from './Bell';

const BRICK_HEIGHT = 110;
const BRICK_BORDER = 7;

class Elavator extends Component{

    constructor(props){
        super(props);
        this.state={
            isMoving: false
        }
    }

    static propTypes = {
        tasks: PropTypes.array,
        direction: PropTypes.number, // 0 = down, 1 = up
        currFloor: PropTypes.number,
        onFloorArrival: PropTypes.func,
        elevatorNum: PropTypes.number,
        removeElevatorTask: PropTypes.func,
        changeElevatorCurrFloor: PropTypes.func,
        waitingOnFloor: PropTypes.bool
    }
    
    static defaultProps = {
        tasks: [],
        currFloor: 0,
        direction: directions.UP,
        waitingOnFloor: false
    }
    // componentWillReceiveProps(nextProps){
    //     if((nextProps.tasks.length === 1 && !nextProps.waitingOnFloor) ||
    //         (!nextProps.waitingOnFloor && this.props.waitingOnFloor && nextProps.tasks.length > 0)){
    //         let elv = document.getElementById(`elevator${this.props.elevatorNum}`);
    //         if(elv){
    //             let {distance, duration, floorDiff, direction} = this.getDistanceBetweenFloors(nextProps);
    //             let travel = direction * distance;
    //             animate(elv, duration, elv.style.top, elv.style.top + travel);
    //         }
    //     }
    // }


    getDistanceBetweenFloors = (props=null)=>{
        if(props == null){
            props = this.props;
        }
        if(props.tasks && props.tasks.length > 0){
            let direction = (props.currFloor > props.tasks[0])? 1: -1;
            let floorDiff = Math.abs((props.currFloor - props.tasks[0]));
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

    componentWillReceiveProps(nextProps){
        if(nextProps.tasks.length > 0){
            this.setState({isMoving: true})
        }else{
            this.setState({isMoving: false})
        }
    }

    render(){
        let {y, duration} = this.state;
        return (
            <Fragment>
                <Animate
                start={() => ({
                    y: 0
                })}

                update={({y}) => {
                        let hasTasks = this.props.tasks.length>0; 
                        let floor = this.props.tasks[0];
                        let elem = document.getElementById(`elevator${this.props.elevatorNum}`)
                        let {distance, duration, floorDiff, direction} = this.getDistanceBetweenFloors() ;
                        if(hasTasks && !this.props.waitingOnFloor){
                            let x = 0; 
                            let currFloor = this.props.currFloor;
                            let props = this.props;
                            // follow the elevator with its route- mark each floor.
                            var intervalID = setInterval(function () {
                                if (++x === floorDiff) {
                                    props.onFloorArrival(props.elevatorNum, floor);// mark arrival
                                    window.clearInterval(intervalID);
                                }

                                props.changeElevatorCurrFloor(props.elevatorNum, (x + currFloor));
                            }, 500);
                        }
                        //let defaultY = direction * this.props.currFloor * (BRICK_HEIGHT+BRICK_BORDER);
                        return({
                            y: [(hasTasks && !this.props.waitingOnFloor) ? distance : 0/*elem.style.top*/],
                            timing: { duration:duration/*, ease: easeExpOut*/ },
                        })
                    
                }}
             >
    
                {
                    (state)=>{
                        let {y} = state;
                        let yPos = `${this.props.currFloor * -103}px`;
                        if(this.props.currFloor > 0 && !this.state.isMoving){
                            y = 0;
                        }
                        return (
                            <div
                                id= {`elevator${this.props.elevatorNum}`}
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
            <audio id={`dingSound${this.props.elevatorNum}`}>
                <source src={require('../../assets/mp3/ding.mp3')} type="audio/mpeg"/>
            </audio>
            </Fragment>
            
        )
    }

}


export default Elavator;