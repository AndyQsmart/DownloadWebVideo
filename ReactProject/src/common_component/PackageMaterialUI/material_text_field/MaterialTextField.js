import React, { PureComponent } from 'react';
import Tools from '../../../common_js/Tools';
import TextField from '@material-ui/core/TextField';
import Icon from '../../../common_component/icon/FontAwesome';

const js_styles = {
    search_icon: {
        cursor: 'pointer',
    }
}

class MaterialTextField extends PureComponent {
    constructor(props) {
        super(props)

        this.onEnterKey = this.onEnterKey.bind(this)
    }

    onEnterKey(e) {
        const { onSearch } = this.props
        if (e.keyCode == Tools.Key.ENTER) {
            onSearch()
        }
    }

    render() {
        const { classes, onSearch, inputProps, ...others } = this.props

        return (
            <TextField
                variant='outlined'
                onKeyUp={this.onEnterKey}
                InputProps={
                    onSearch ?
                        {
                            endAdornment: (
                                <Icon
                                    style={js_styles.search_icon}
                                    name='search'
                                    size={20}
                                    onClick={onSearch}
                                />
                            ),

                        }
                    :
                        null
                }
                inputProps={{
                    style: {
                        padding: '10px 0px 10px 10px',
                    },
                    ...inputProps
                }}
                {...others}
            />
        )
    }
}

export default MaterialTextField