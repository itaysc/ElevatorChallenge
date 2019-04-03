import types from './types';

export const orderElevator = (floorNum) => {
  return {type: types.ORDER_ELEVATOR, payload: floorNum};
};

export const markElevatorArrival = (elevatorNum, floorNum, callback=null) => async(dispatch)=>{
    let remainingTime = 2;
    let id = setInterval(changeRemainingTime, 500);
    function changeRemainingTime(){
      remainingTime = remainingTime - 0.5;
      if(remainingTime === 0){
        clearInterval(id);
        dispatch({type: types.UNLOCK_ELEVATOR, payload: {elevatorNum, floorNum}})
      }else{
        dispatch({type: types.REDUCE_ALL_FLOORS_WAITING_TIME, payload: floorNum});
      }
    }
    return dispatch({type: types.ARRIVED_TO_FLOOR, payload: {elevatorNum, floorNum}});
};

export const addElevatorTask = (elevatorNum, floorNum, timeToWait) => {
  return {type: types.ADD_ELEVATOR_TASK, payload: {elevatorNum, floorNum, timeToWait}};
};

export const setFloorWaitingTime = (floorNum, timeToWait) => {
  return {type: types.SET_FLOOR_WAITING_TIME, payload: {floorNum, timeToWait}};
};

export const reduceFloorWaitingTime = (floorNum) => {
  return {type: types.REDUCE_FLOOR_WAITING_TIME, payload: floorNum };
};

export const removeElevatorTask = (elevatorNum, floorNum) => {
  return {type: types.REMOVE_ELEVATOR_TASK, payload: {elevatorNum, floorNum}};
};

export const changeElevatorCurrFloor = (elevatorNum, floorNum, initialFloorNum) => async(dispatch)=> {
  dispatch({type: types.REDUCE_ALL_FLOORS_WAITING_TIME, payload: initialFloorNum});
  return dispatch({type: types.CHANGE_ELEVATOR_CURR_FLOOR, payload: {elevatorNum, floorNum}});
};

