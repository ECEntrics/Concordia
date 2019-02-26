import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

const FloatingButton = (props) => {
    return (
        <div className="action-button" onClick={props.onClick}>
            <Button icon color='teal' size='large'>
                <Icon name='add'/>
            </Button>
        </div>
    );
};

export default FloatingButton;