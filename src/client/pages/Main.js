import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSettings} from '../actions/settings';
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
      awaitingReservations: [],
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
  orderElevator = (floorNum) => {
    let awaitingReservations = [...this.state.awaitingReservations];
    awaitingReservations.push(floorNum);
    this.setState(floorNum);
  };
  
  markElevatorArrival = (elevatorNum, floorNum)=>{
      setTimeout(()=>{ // setTimeout to free the elevator
        let blockedElevators = this.state.stoppedElevators.filter(e=>e!=elevatorNum);
        this.setState({stoppedElevators: blockedElevators});
      }, 2000)
      let remainingFloors = this.state.awaitingReservations.filter(f=>f!=floorNum);
      let remainingTasks = [...this.state.elevatorTasks];
      let waitingTimes2 = [...this.state.waitingTimes];
      waitingTimes2[floorNum] = 0;
      let currFloors = [...this.state.currFloors];
      currFloors[elevatorNum] = floorNum;
      let stoppedElevators = [...this.state.stoppedElevators];
      stoppedElevators.push(elevatorNum);
      let currElvRemainingFloors = remainingTasks[elevatorNum] || [];
      if(currElvRemainingFloors.includes(floorNum)){
          let audio = document.getElementById(`dingSound${elevatorNum}`);
          audio.load();
          audio.play();
      }
      currElvRemainingFloors = currElvRemainingFloors.filter(floor=> floor!=floorNum);
      remainingTasks[elevatorNum] = currElvRemainingFloors;
      this.setState({
        elevatorTasks: remainingTasks, 
        currFloors, 
        awaitingReservations:remainingFloors,
        waitingTimes: waitingTimes2,
        stoppedElevators
      });
  };
  
   addElevatorTask = (elevatorNum, floorNum, timeToWait) => {
    let tasks = [...this.state.elevatorTasks];
    let waitingTimes = [...this.state.waitingTimes];
    waitingTimes[floorNum] = timeToWait;
    if(!Array.isArray(tasks[elevatorNum])){
        tasks[elevatorNum] = [];
    }
    let reservations = [...this.state.awaitingReservations];
    reservations.push(floorNum);
    tasks[elevatorNum].push(floorNum);
    this.setState({
      elevatorTasks: tasks, 
      awaitingReservations: reservations, 
      waitingTimes
    });
  };
  
   setFloorWaitingTime = (floorNum, timeToWait) => {
    let wt = [...this.state.waitingTimes];
    wt[floorNum] = timeToWait;
    this.setState({waitingTimes: wt});
  };
  
   removeElevatorTask = (elevatorNum, floorNum) => {
    let etasks = [...this.state.elevatorTasks];
    let etask = etasks[elevatorNum] || [];
    etask = etask.filter(floor=> floor!=floorNum);
    etasks[elevatorNum] = etask;
    this.setState({
      elevatorTasks: etasks
    })
  };
  
   changeElevatorCurrFloor = (elevatorNum, floorNum) => {
    let elvCurrFloors = [...this.state.currFloors];
    elvCurrFloors[elevatorNum] = floorNum;
    this.setState({currFloor: elvCurrFloors});
  };

  addTask = (floorNum)=>{
    let {elevators} = this.props.settings;
    let {elevatorTasks, currFloors, awaitingReservations, elevatorDirections, stoppedElevators} = this.state;
    if(!awaitingReservations.includes(floorNum)){ // add new floor reservation only if it doesn`t exist.
      let {elevator, timeToWait} = findElevator(floorNum, 
                                  elevatorTasks, 
                                  currFloors, 
                                  elevatorDirections, 
                                  elevators,
                                  stoppedElevators);
      this.setFloorWaitingTime(floorNum, timeToWait);
      let remainingTime = timeToWait;
      let interval = setInterval(()=>{
        remainingTime-=(500/1000);
        if(remainingTime > 0){
          this.setFloorWaitingTime(floorNum, remainingTime);
        }else{
          clearInterval(interval);
        }
        
      }, 500);
      this.addElevatorTask(elevator, floorNum, timeToWait);
    }

  }

  onSettingsChanged = (floors, elevators)=>{
    this.props.changeSettings(floors, elevators);
  }

  render(){
    let {floors, elevators} = this.props.settings;

    return (
      <div className="mainContainer center-align" >
        <Settings onSelectClick={this.onSettingsChanged}/>
        <Building numOfFloors={floors} 
          numOfElevators={elevators} 
          addReservation={this.addTask}
          awaitingReservations={this.state.awaitingReservations}
          currFloors={this.state.currFloors}
          elevatorTasks={this.state.elevatorTasks}
          onFloorArrival={this.markElevatorArrival}
          waitingTimes={this.state.waitingTimes}
          changeElevatorCurrFloor={this.changeElevatorCurrFloor}
          stoppedElevators={this.state.stoppedElevators}/>
      </div>
    );
  }

};

const mapDispatchToProps = (dispatch)=> {
  return bindActionCreators({
    changeSettings
  }, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {  
    settings: state.settings
  };
}

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Home)
};
