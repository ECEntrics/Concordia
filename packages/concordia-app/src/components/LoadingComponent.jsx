import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Progress } from 'semantic-ui-react';

// CSS
import '../assets/css/loading-component.css';

// Images
import ethereum_logo from '../assets/images/ethereum_logo.svg';
import ipfs_logo from '../assets/images/ipfs_logo.svg';
import orbitdb_logo from '../assets/images/orbitdb_logo.png';
import app_logo from '../assets/images/app_logo.png';

class LoadingComponent extends Component {
    render(){
        const { image_type, message_list, progress_type } = this.props ;
        let imageSrc, imageAlt, listItems, indicating, error;

        if (image_type === "ethereum"){
            imageSrc = ethereum_logo;
            imageAlt = "ethereum_logo";
        }
        else if (image_type === "ipfs"){
            imageSrc = ipfs_logo;
            imageAlt = "ipfs_logo";
        }
        else if (image_type === "orbit"){
            imageSrc = orbitdb_logo;
            imageAlt = "orbitdb_logo";
        }
        else if (image_type === "app"){
            imageSrc = app_logo;
            imageAlt = "app_logo";
        }

        if(progress_type === "indicating")
            indicating = true;
        else if(progress_type === "error")
            error = true;

        if(message_list){
            listItems = message_list.map((listItem) =>
                <li>{listItem}</li>
            );
        }

        const list = message_list ? <ul>{listItems}</ul> : '';

        return(
            <main className="loading-screen">
                <Container>
                    <img src={imageSrc} alt={imageAlt} className="loading-img" />
                    <p><strong>{this.props.title}</strong></p>
                    <p>{this.props.message}</p>
                    {list}
                </Container>
                <Progress percent={this.props.progress} size='small' indicating={indicating} error={error}/>
            </main>
        );
    }
}

LoadingComponent.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    message_list: PropTypes.arrayOf(PropTypes.string),
    image_type: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    progress_type: PropTypes.string.isRequired,
};

export default LoadingComponent;
