import React from 'react'
import styles from './GlassBox.css'
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types'

const BlurMap = {
    3: true,
    5: true,
    10: true,
    15: true,
}

const GlassBox = React.forwardRef((props, ref) => {
    const {blur, ...other} = props
    let className = styles['blur-5px']
    if (BlurMap[blur]) {
        className = styles['blur-'+blur+'px']
    }
    return <Box ref={ref} className={className} bgcolor='rgba(50, 50, 50, 0.8)' {...other} />;
})

GlassBox.propTypes = {
    blur: PropTypes.number,
}

export default GlassBox;