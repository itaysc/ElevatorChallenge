import types from '../actions/types';

const initialState = {
    floors: 5,
    elevators: 1
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_SETTINGS:
      return {
        floors: action.payload.numOfFloors, 
        elevators: action.payload.numOfElevators
      };
    case types.CHANGE_NUM_OF_FLOORS: return {...state, floors: action.payload};
    case types.CHANGE_NUM_OF_ELEVATORS: return {...state, elevators: action.payload};
    default:
      return state;
  }
}
