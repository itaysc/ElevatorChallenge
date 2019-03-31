import types from '../actions/types';


const initialState = {
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

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ORDER_ELEVATOR:
        let awaitingReservations = [...state.awaitingReservations];
        awaitingReservations.push(action.payload);
        return {...state, awaitingReservations};

    case types.REMOVE_ELEVATOR_TASK:
        let etasks = [...state.elevatorTasks];
        let etask = etasks[action.payload.elevatorNum] || [];
        etask = etask.filter(floor=> floor!=action.payload.floorNum);
        etasks[action.payload.elevatorNum] = etask;
        return {...state, elevatorTasks: etasks};

    case types.CHANGE_ELEVATOR_CURR_FLOOR:
        let elvCurrFloors = [...state.currFloors];
        elvCurrFloors[action.payload.elevatorNum] = action.payload.floorNum;
        return {...state, currFloor: elvCurrFloors};

    case types.UNLOCK_ELEVATOR:
        let lockedElevators = state.stoppedElevators.filter(e=>e!= action.payload);
        return {...state, stoppedElevators: lockedElevators};

    case types.ARRIVED_TO_FLOOR: 
        let remainingFloors = state.awaitingReservations.filter(f=>f!=action.payload.floorNum);
        let remainingTasks = [...state.elevatorTasks];
        let waitingTimes2 = [...state.waitingTimes];
        waitingTimes2[action.payload.floorNum] = 0;
        let currFloors = [...state.currFloors];
        currFloors[action.payload.elevatorNum] = action.payload.floorNum;
        let stoppedElevators = [...state.stoppedElevators];
        stoppedElevators.push(action.payload.elevatorNum);
        //let currElvRemainingFloors = [...remainingTasks[action.payload.elevatorNum]];
        let currElvRemainingFloors = remainingTasks[action.payload.elevatorNum] || [];
        if(currElvRemainingFloors.includes(action.payload.floorNum)){
            let audio = document.getElementById(`dingSound${action.payload.elevatorNum}`);
            audio.load();
            audio.play();
        }
        currElvRemainingFloors = currElvRemainingFloors.filter(floor=> floor!=action.payload.floorNum);
        remainingTasks[action.payload.elevatorNum] = currElvRemainingFloors;
        return {...state, elevatorTasks: remainingTasks, 
                currFloors, awaitingReservations:remainingFloors,
                waitingTimes: waitingTimes2,
                stoppedElevators};

    case types.ADD_ELEVATOR_TASK:
        let tasks = [...state.elevatorTasks];
        let waitingTimes = [...state.waitingTimes];
        waitingTimes[action.payload.floorNum] = action.payload.timeToWait;
        if(!Array.isArray(tasks[action.payload.elevatorNum])){
            tasks[action.payload.elevatorNum] = [];
        }
        let reservations = [...state.awaitingReservations];
        reservations.push(action.payload.floorNum);
        tasks[action.payload.elevatorNum].push(action.payload.floorNum);
        // tasks.sort((a,b)=>{
        //     if(Math.abs(a - action.payload.currFloor) < Math.abs(b - action.payload.currFloor)){
        //         return 1
        //     }else{
        //         return -1;
        //     }
        // });
        return {...state, elevatorTasks: tasks, awaitingReservations: reservations, waitingTimes};
        

    case types.SET_FLOOR_WAITING_TIME:
        let wt = [...state.waitingTimes];
        wt[action.payload.floorNum] = action.payload.timeToWait;
        return {...state, waitingTimes: wt }
    default:
      return state;
  }
}
