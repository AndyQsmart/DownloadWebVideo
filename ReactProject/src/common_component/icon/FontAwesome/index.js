import React, { PureComponent } from 'react';
import '../../../common_css/font_awesome/css/font-awesome.min.css'

class Icon extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, color, size, className, style, larger, ...others} = this.props
        let the_class_name = "fa fa-"+name
        if (className) {
            the_class_name += ' '+className
        }
        if (larger) {
            the_class_name += ' '+'fa-'+larger
        }
        return (
            <i className={the_class_name}
                style={{
                    ...style,
                    color: color, 
                    fontSize: size,
                }}
                {...others}
            >
                {this.props.children}
            </i>
        );
    }
}

export default Icon;