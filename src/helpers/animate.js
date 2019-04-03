const BRICK_HEIGHT = 110;
const BRICK_BORDER = 7;


export default function(element, durationMills, startY, endY) {
    let direction = startY > endY? -1: 1;
    let distance = Math.abs(startY-endY);
    let numOfFloors = (distance / (BRICK_HEIGHT + BRICK_BORDER));
    let duration = numOfFloors * 500; // 500 mills per floor.
    //let interval =   
    let pos = startY;
    let id = setInterval(frame, 10);
    setTimeout(()=>{clearInterval(id);}, duration)
    function frame() {
      if (pos == endY) {
        clearInterval(id);
      } else {
        pos = direction > 0? pos+1: pos-1;
        element.style.top = pos + 'px'; 
      }
    }
  }