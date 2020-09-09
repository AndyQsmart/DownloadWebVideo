import React from 'react'
import styles from './OverHiddenBox.css'
import Box from '@material-ui/core/Box';

const OverHiddenBox = React.forwardRef((props, ref) => {
    return <Box ref={ref} className={styles.container} {...props}  />;
})

export default OverHiddenBox;