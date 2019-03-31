import React, {Fragment, Component, useState} from 'react';
import PropTypes from 'prop-types';
import elvImg from '../../assets/images/elv.png';
import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'
import directions from '../../helpers/directions';
//import Bell from './Bell';

const BRICK_HEIGHT = 110;
const BRICK_BORDER = 7;

class Elavator extends Component{

    constructor(props){
        super(props);
        this.state={
            //playDing: false
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
        isStopping: PropTypes.bool
    }
    
    static defaultProps = {
        tasks: [],
        currFloor: 0,
        direction: directions.UP,
        isStopping: false
    }
    
    // shouldComponentUpdate(nextProps, nextState){
    //     return ((nextProps.tasks !== this.props.tasks)&& (nextProps.tasks.length > 0)) ||
    //         nextState.playDing;
    // }

    getDistanceBetweenFloors = ()=>{
        if(this.props.tasks && this.props.tasks.length > 0){
            let direction = (this.props.currFloor > this.props.tasks[0])? 1: -1;
            let floorDiff = Math.abs((this.props.currFloor - this.props.tasks[0]));
            let heightToTravel = ((floorDiff * direction * BRICK_HEIGHT)+(floorDiff * BRICK_BORDER));
            return {
                distance: heightToTravel,
                duration: 500 * floorDiff,
                floorDiff
            };
        }else{
            return {
                distance: 0,
                duration: 0,
                floorDiff: 0
            };
        }
    }

    render(){
        return (
            <div style={{float:'left'}}>
                {/* <button onClick={()=>setIsMoving(true)}>click</button> */}
             <Animate
                start={() => ({
                    y: 0,
                })}

                update={() => {
                    let hasTasks = this.props.tasks.length>0; 
                    let floor = this.props.tasks[0];
                    let {distance, duration, floorDiff} = this.getDistanceBetweenFloors() ;
                    if(hasTasks && !this.props.isStopping){
                        let x = 0; 
                        let currFloor = this.props.currFloor;
                        // follow the elevator with its route- mark each floor.
                        var intervalID = setInterval(function () {
                            if (++x === floorDiff) {
                                window.clearInterval(intervalID);
                            }

                            this.props.changeElevatorCurrFloor(this.props.elevatorNum, (x + currFloor));
                         }, 500);
                         // set timeout until the elevator arrives to destination floor
                        setTimeout(()=>{
                            this.props.onFloorArrival(this.props.elevatorNum, floor);// mark arrival
                        }, duration)
                    }
                    return({
                        y: [hasTasks ? distance : 0],
                        timing: { duration/*, ease: easeExpOut*/ },
                    })
                }}
             >
    
                {
                    (state)=>{
                        const {y} = state;
                        let yPos = `${this.props.currFloor * -103}px`
                        return (
                            <div className='translationDiv' style={{
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
                {/* <Bell play={this.state.playDing}/> */}
            </div>
        )
    }

}


export default Elavator;