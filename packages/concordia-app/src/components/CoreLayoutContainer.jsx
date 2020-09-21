import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuComponent from './MenuComponent';

export default class CoreLayout extends Component {
    render() {
        return (
            <div>
                <MenuComponent/>
                {this.props.children}
            </div>
        )
    }
}

CoreLayout.propTypes = {
    children: PropTypes.element.isRequired
};
