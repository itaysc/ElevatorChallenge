import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const Floor = (props)=>{

    function addReservation(){
        props.addReservation(props.floorNum);
    }

    return (
        <div className="floorContainer">
            <div className="floor floorStyle">
                <button className={`metal linear ${props.isAwaiting?'floorAwaiting': ''}`}
                    onClick={addReservation}>
                     {props.floorNum}
                </button>
            </div>
            {
                props.secondsRemaining && props.secondsRemaining != 0? 
                <div className="waitingTime">{props.secondsRemaining}</div>:
                <div className="waitingTime">0</div>
            }
        </div>
    )
}

Floor.propTypes = {
    addReservation: PropTypes.func.isRequired,
    floorNum: PropTypes.number.isRequired,
    isAwaiting: PropTypes.bool,
    secondsRemaining: PropTypes.number
}

Floor.defaultProps = {
    isAwaiting: false
}

export default Floor;