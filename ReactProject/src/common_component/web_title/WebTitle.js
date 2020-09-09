import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

class WebTitle extends PureComponent {
    constructor(props) {
        super(props)

        this.last_title = null
    }

    componentDidUpdate() {
        document.title = this.props.name
    }

    componentDidMount() {
        this.last_title = document.title
        document.title = this.props.name
    }

    componentWillUnmount() {
        document.title = this.last_title
    }

    render() {
        return null
    }
}


WebTitle.propTypes = {
    name: PropTypes.string,
}

WebTitle.defaultProps = {
    name: '',
}

export default WebTitle;