export default function(awaitingFloor, elevatorTasks, currFloors, elevatorDirections, numOfElevators, stoppedElevators){
    let selectedElevator = 0;
    let minTimeToWaitInMills = Number.MAX_SAFE_INTEGER;

    for(let i = 0; i < numOfElevators; i++){
        let currElvFloor = currFloors[i] || 0;
        if(elevatorTasks[i] && elevatorTasks[i].length > 0){
            let timeToTake = 0;
            elevatorTasks[i].map(entry=>{
                timeToTake += (Math.abs(entry.floor - currElvFloor) * 500);
                timeToTake+= 2000; // stops for 2 seconds in each floor
                currElvFloor = entry.floor;
            });
            if(timeToTake < minTimeToWaitInMills){
                selectedElevator = i;
                minTimeToWaitInMills = timeToTake;
            }
        }else{ // if no tasks assigned for this elevator
            let timeToWait = (Math.abs(awaitingFloor - currElvFloor) * 500);
            if(timeToWait < minTimeToWaitInMills){
                minTimeToWaitInMills = timeToWait;
                selectedElevator = i;
            }
        }
    }

    return {
        elevator: selectedElevator,
        timeToWait:(minTimeToWaitInMills/1000) // return time in seconds
    }
}