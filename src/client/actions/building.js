import types from './types';

export const orderElevator = (floorNum) => {
  return {type: types.ORDER_ELEVATOR, payload: floorNum};
};

export const markElevatorArrival = (elevatorNum, floorNum, callback=null) => async(dispatch)=>{
    setTimeout(()=>{ // setTimeout to free the elevator
      dispatch({type: types.UNLOCK_ELEVATOR, payload: elevatorNum})
    }, 2000)
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

export const changeElevatorCurrFloor = (elevatorNum, floorNum) => {
  return {type: types.CHANGE_ELEVATOR_CURR_FLOOR, payload: {elevatorNum, floorNum}};
};

