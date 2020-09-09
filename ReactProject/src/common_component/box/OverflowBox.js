import React from 'react'
import styles from './OverflowBox.css'
import Box from '@material-ui/core/Box';

const OverflowBox = React.forwardRef((props, ref) => {
    return <Box ref={ref} className={styles.container} {...props}  />;
})

export default OverflowBox;