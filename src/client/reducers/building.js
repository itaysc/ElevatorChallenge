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
        etask = etask.filter(entry=> entry.floor!=action.payload.floorNum);
        etasks[action.payload.elevatorNum] = etask;
        return {...state, elevatorTasks: etasks};

    case types.CHANGE_ELEVATOR_CURR_FLOOR:
        let elvCurrFloors = [...state.currFloors];
        elvCurrFloors[action.payload.elevatorNum] = action.payload.floorNum;
        return {...state, currFloor: elvCurrFloors};

    case types.UNLOCK_ELEVATOR:
        let lockedElevators = state.stoppedElevators.filter(e=>e!= action.payload.elevatorNum);
        let remainingTasks2 = [...state.elevatorTasks];
        let currElvRemainingFloors2 = remainingTasks2[action.payload.elevatorNum] || [];
        currElvRemainingFloors2 = currElvRemainingFloors2.filter(entry=> entry.floor!=action.payload.floorNum);
        if(currElvRemainingFloors2.length > 0){
            currElvRemainingFloors2[0].started = true;
        }
        remainingTasks2[action.payload.elevatorNum] = currElvRemainingFloors2;
        return {...state, stoppedElevators: lockedElevators, elevatorTasks: remainingTasks2};

    case types.ARRIVED_TO_FLOOR: 
        let remainingFloors = state.awaitingReservations.filter(f=>f!=action.payload.floorNum);
        let remainingTasks = [...state.elevatorTasks];
        let waitingTimes2 = [...state.waitingTimes];
        waitingTimes2[action.payload.floorNum] = 0;
        let currFloors = [...state.currFloors];
        currFloors[action.payload.elevatorNum] = action.payload.floorNum;
        let stoppedElevators = [...state.stoppedElevators];
        stoppedElevators.push(action.payload.elevatorNum);
        let currElvRemainingFloors = remainingTasks[action.payload.elevatorNum] || [];
        if(currElvRemainingFloors.filter(r=>(r.started && r.floor == action.payload.floorNum)).length > 0){
            let audio = document.getElementById(`dingSound${action.payload.elevatorNum}`);
            audio.load();
            audio.play();
        }
        // currElvRemainingFloors = currElvRemainingFloors.filter(entry=> entry.floor!=action.payload.floorNum);
        // if(currElvRemainingFloors.length > 0){
        //     currElvRemainingFloors[0].started = true;
        // }
        // remainingTasks[action.payload.elevatorNum] = currElvRemainingFloors;
        return {...state, 
                currFloors, awaitingReservations:remainingFloors,
                waitingTimes: waitingTimes2,
                stoppedElevators};

    case types.ADD_ELEVATOR_TASK:
        let isStarted =(state.elevatorTasks.length === 0 ||  
                        (!state.elevatorTasks[action.payload.elevatorNum] ||
                        ( state.elevatorTasks[action.payload.elevatorNum] && 
                        state.elevatorTasks[action.payload.elevatorNum].length === 0)));
        let tasks = [...state.elevatorTasks];
        let waitingTimes = [...state.waitingTimes];
        waitingTimes[action.payload.floorNum] = action.payload.timeToWait;
        if(!Array.isArray(tasks[action.payload.elevatorNum])){
            tasks[action.payload.elevatorNum] = [];
        }
        let reservations = [...state.awaitingReservations];
        reservations.push(action.payload.floorNum);
        tasks[action.payload.elevatorNum].push({started: isStarted, floor: action.payload.floorNum});
        return {...state, elevatorTasks: tasks, awaitingReservations: reservations, waitingTimes};

    case types.REDUCE_FLOOR_WAITING_TIME:
        let wtimes = [...state.waitingTimes];
        wtimes[action.payload] = wtimes[action.payload] - 0.5;
        return {...state, waitingTimes: wtimes }

    case types.SET_FLOOR_WAITING_TIME:
        let wt = [...state.waitingTimes];
        wt[action.payload.floorNum] = action.payload.timeToWait;
        return {...state, waitingTimes: wt }

    case types.REDUCE_ALL_FLOORS_WAITING_TIME:
            let remainingTasks3 = [];
            // [[{started, floorNum}, {started, floorNum}], [{started, floorNum}, {started, floorNum}]]
            state.elevatorTasks.map((t, elevatorNum)=>{
                if(t && t.length > 0){
                    t.map(job=>{
                        if(job.floor != action.payload){
                            remainingTasks3.push(job.floor);
                        }
                    })
                }
            });
            let waitT = [...state.waitingTimes];
            remainingTasks3.map(index=>{
                waitT[index] = waitT[index] - 0.5;
            })
            return {...state, waitingTimes: waitT }

    default:
      return state;
  }
}
