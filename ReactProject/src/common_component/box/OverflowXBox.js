import React from 'react'
import styles from './OverflowXBox.css'
import Box from '@material-ui/core/Box';

const OverflowXBox = React.forwardRef((props, ref) => {
    return <Box ref={ref} className={styles.container} {...props}  />;
})

export default OverflowXBox;