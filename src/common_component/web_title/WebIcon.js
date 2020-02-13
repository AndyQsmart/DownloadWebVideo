import React, { PureComponent } from 'react';

class WebIcon extends PureComponent {
    constructor(props) {
        super(props)

        this.last_icon = null
    }

    componentDidUpdate() {
        if (this.props.icon) {
            document.getElementById("link-icon").href = this.props.icon
        }
    }

    componentDidMount() {
        let link_icon = document.getElementById("link-icon")
        this.last_icon = link_icon.href
        if (this.props.icon) {
            link_icon.href = this.props.icon
        }
    }

    componentWillUnmount() {
        document.getElementById("link-icon").href = this.last_icon
    }

    render() {
        return null
    }
}

WebIcon.defaultProps = {
    icon: '',
}

export default WebIcon;