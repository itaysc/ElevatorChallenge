import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Floor from './Floor';
import Elavator from './Elevator';

const BuildingFloors = (props)=>{

    return (
        <div className="floorsContainer">
            { props.renderFloors() }
        </div>
    )
}

BuildingFloors.propTypes = {
    renderFloors: PropTypes.func.isRequired,
    numOfFloors: PropTypes.number.isRequired
}

export default BuildingFloors;