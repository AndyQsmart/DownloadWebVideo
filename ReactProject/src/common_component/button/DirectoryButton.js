import React, { Component } from 'react';
import { ipcRenderer } from 'electron'
import Button from '@material-ui/core/Button';

class DirectoryButton extends Component {
    constructor(props) {
        super(props);

        this.button = React.createRef()

        this.onClick = this.onClick.bind(this)
        this.getPath = this.getPath.bind(this)
    }

    getPath(res) {
        if (!res) {
            return
        }
        const { onChange } = this.props
        if (onChange) {
            onChange(res.filePaths)
        }
    }

    onClick() {
        const { onClick, multiple, } = this.props

        let properties = ['openDirectory']
        if (multiple) {
            properties.push('multiSelections')
        }
        ipcRenderer.invoke('api-dialog', {
            properties,
        }).then(this.getPath);

        if (onClick) {
            onClick()
        }
    }

    render() {
        const { component, onClick, onChange, multiple, ...others } = this.props
        let Component = component ? component : Button
        return (
            <Component onClick={this.onClick} {...others} >
                {this.props.children}
            </Component>
        );
    }
}

export default DirectoryButton;
