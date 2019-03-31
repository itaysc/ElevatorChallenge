import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSettings} from '../actions/settings';
import {orderElevator, 
        addElevatorTask, 
        markElevatorArrival, 
        setFloorWaitingTime,
        removeElevatorTask,
        changeElevatorCurrFloor} from '../actions/building';
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
      
    }
  }

  addTask = (floorNum)=>{
    let {elevators} = this.props.settings;
    let {elevatorTasks, currFloors, awaitingReservations, elevatorDirections} = this.props.elevatorsManagement;
    if(!awaitingReservations.includes(floorNum)){ // add new floor reservation only if it doesn`t exist.
      let {elevator, timeToWait} = findElevator(floorNum, elevatorTasks, 
        currFloors, elevatorDirections, 
        elevators);
      this.props.setFloorWaitingTime(floorNum, timeToWait);
      let remainingTime = timeToWait;
      let interval = setInterval(()=>{
        remainingTime-=(500/1000);
        if(remainingTime > 0){
          this.props.setFloorWaitingTime(floorNum, remainingTime);
        }else{
          clearInterval(interval);
        }
        
      }, 500);
      this.props.addElevatorTask(elevator, floorNum, timeToWait);
    }

  }

  onFloorArrival = (elevatorNum, floorNum)=>{
    this.props.markElevatorArrival(elevatorNum, floorNum);
  }

  // static getDrivedStateFromProps(props, state){
  //   let {elevatorsManagement} = props;

  // }

  onSettingsChanged = (floors, elevators)=>{
    this.props.changeSettings(floors, elevators);
  }

  render(){
    let {floors, elevators} = this.props.settings;
    let {orderElevator, changeElevatorCurrFloor} = this.props;
    let {awaitingReservations, 
          currFloors, 
          elevatorTasks, 
          waitingTimes,
          stoppedElevators} = this.props.elevatorsManagement;
    return (
      <div className="mainContainer center-align" >
        <Settings onSelectClick={this.onSettingsChanged}/>
        <Building numOfFloors={floors} 
          numOfElevators={elevators} 
          addReservation={this.addTask}
          awaitingReservations={awaitingReservations}
          currFloors={currFloors}
          elevatorTasks={elevatorTasks}
          onFloorArrival={this.onFloorArrival}
          waitingTimes={waitingTimes}
          changeElevatorCurrFloor={changeElevatorCurrFloor}
          stoppedElevators={stoppedElevators}/>
      </div>
    );
  }

};

const mapDispatchToProps = (dispatch)=> {
  return bindActionCreators({
    changeSettings,
    markElevatorArrival,
    orderElevator,
    addElevatorTask,
    setFloorWaitingTime,
    removeElevatorTask,
    changeElevatorCurrFloor
  }, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {  
    settings: state.settings,
    elevatorsManagement: state.elevatorsManagement
  };
}

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Home)
};
