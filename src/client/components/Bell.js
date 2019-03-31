import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';

const Bell = (props)=>{
    return (
        <Sound
            url= {require('./ding.mp3')}
            playStatus={props.play?Sound.status.PLAYING: Sound.status.STOPPED}
            ignoreMobileRestrictions ={true}
            playbackRate={2}
      />
    )
}

Bell.propTypes = {
    play: PropTypes.bool
}

Bell.defaultProps = {
    play: false
}

export default Bell;