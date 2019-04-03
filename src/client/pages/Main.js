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

export const MainContext = React.createContext();

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {

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
    let contextVal = {
      numOfFloors: floors,
      numOfElevators: elevators,
      addReservation: this.addTask,
      awaitingReservations: data.awaitingReservations,
      currFloors: data.currFloors,
      elevatorTasks: data.elevatorTasks,
      onFloorArrival: this.props.markElevatorArrival,
      waitingTimes: data.waitingTimes,
      changeElevatorCurrFloor: this.props.changeElevatorCurrFloor,
      stoppedElevators: data.stoppedElevators,
      reduceFloorWaitingTime: this.props.reduceFloorWaitingTime
    }
    return (
      <MainContext.Provider value={contextVal}>
        <div className="mainContainer center-align" >
          <Settings onSelectClick={this.onSettingsChanged}/>
          <Building />
        </div>
      </MainContext.Provider>
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
