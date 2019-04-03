import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSettings} from '../actions/settings';
import * as buildingActions from '../actions/building';
import Elavator from '../components/Elevator';
import Building from '../components/Building';
import Settings from '../components/Settings';
import Floor from '../components/Floor';
import BuildingFloors from '../components/BuildingFloors';
import findElevator from '../../helpers/findElevator';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {

      //associative array based on elevator numbers which describes the remaining floors for each elevators
      elevatorTasks: [],
      //associative array based on elevator numbers which describes the current floor of each elevator
      currFloors: [] ,
      //associative array based on elevator numbers which describes the current direction of each elevator
      elevatorDirections: [],
      //associative array based on floor numbers which describes the amount of time (seconds) until elevator arrival
      waitingTimes: [],
      //associative array based on elevators numbers which describes the elevators that are stopping for 2 seconds
      stoppedElevators: []
    }
  }

  
  
  addTask = (floorNum)=>{
    let {elevators} = this.props.settings;
    let {elevatorTasks, currFloors, awaitingReservations, elevatorDirections, stoppedElevators} = this.props.data;
    if(!awaitingReservations.includes(floorNum)){ // add new floor reservation only if it doesn`t exist.
      let {elevator, timeToWait} = findElevator(floorNum, 
                                  elevatorTasks, 
                                  currFloors, 
                                  elevatorDirections, 
                                  elevators,
                                  stoppedElevators);

      this.props.addElevatorTask(elevator, floorNum, timeToWait);
      this.props.setFloorWaitingTime(floorNum, timeToWait);
      let remainingTime = timeToWait;
      
      // let interval = setInterval(()=>{
      //   remainingTime-=(500/1000);
      //   if(remainingTime > 0){
      //     this.props.setFloorWaitingTime(floorNum, remainingTime);
      //   }else{
      //     clearInterval(interval);
      //     this.props.setFloorWaitingTime(floorNum, 0);
      //   }
        
      // }, 500);
      
    }

  }

  onSettingsChanged = (floors, elevators)=>{
    this.props.changeSettings(floors, elevators);
  }

  render(){
    let {floors, elevators} = this.props.settings;
    let {data} = this.props;
    return (
      <div className="mainContainer center-align" >
        <Settings onSelectClick={this.onSettingsChanged}/>
        <Building numOfFloors={floors} 
          numOfElevators={elevators} 
          addReservation={this.addTask}
          awaitingReservations={data.awaitingReservations}
          currFloors={data.currFloors}
          elevatorTasks={data.elevatorTasks}
          onFloorArrival={this.props.markElevatorArrival}
          waitingTimes={data.waitingTimes}
          changeElevatorCurrFloor={this.props.changeElevatorCurrFloor}
          stoppedElevators={data.stoppedElevators}
          reduceFloorWaitingTime={this.props.reduceFloorWaitingTime}/>
      </div>
    );
  }

};

const mapDispatchToProps = (dispatch)=> {
  return bindActionCreators({
    changeSettings,
    ...buildingActions
  }, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {  
    settings: state.settings,
    data: state.elevatorsManagement
  };
}

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Home)
};
