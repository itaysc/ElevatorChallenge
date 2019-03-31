import types from './types';

export const changeSettings = (numOfFloors, numOfElevators) => {
  return {type: types.CHANGE_SETTINGS, payload: {numOfFloors, numOfElevators}};
};


export const changeNumOfFloors = (numOfFloors) => {
  return {type: types.CHANGE_NUM_OF_FLOORS, payload: numOfFloors};
};

export const changeNumOfElavators = (numOfElevators) => {
  return {type: types.CHANGE_NUM_OF_ELEVATORS, payload: numOfElevators};
};

