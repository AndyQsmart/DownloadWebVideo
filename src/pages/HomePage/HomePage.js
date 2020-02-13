import React, { PureComponent } from 'react';
import NavBar from '../../instance_component/NavBar/NavBar';
import Box from '@material-ui/core/Box';

class HomePage extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Box height='100%' display='flex' >
                <NavBar />
                <Box width={10} flexGrow={1} >
                    主页 
                </Box>
            </Box>
        );
    }
}

export default HomePage;