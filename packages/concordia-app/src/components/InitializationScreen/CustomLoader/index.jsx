import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Progress } from 'semantic-ui-react';

// Images
import ethereumLogo from '../../../assets/images/ethereum_logo.svg';
import ipfsLogo from '../../../assets/images/ipfs_logo.svg';
import orbitdbLogo from '../../../assets/images/orbitdb_logo.svg';
import appLogo from '../../../assets/images/app_logo.png';

const LoadingComponent = (props) => {
  useEffect(() => function cleanup() {
    document.body.classList.add('app');
  }, []);

  const {
    imageType, messageList, progressType, title, message, progress,
  } = props;
  let imageSrc; let imageAlt; let listItems; let indicating; let
    error;

  if (imageType === 'ethereum') {
    imageSrc = ethereumLogo;
    imageAlt = 'ethereum_logo';
  } else if (imageType === 'ipfs') {
    imageSrc = ipfsLogo;
    imageAlt = 'ipfs_logo';
  } else if (imageType === 'orbit') {
    imageSrc = orbitdbLogo;
    imageAlt = 'orbitdb_logo';
  } else if (imageType === 'app') {
    imageSrc = appLogo;
    imageAlt = 'app_logo';
  }

  if (progressType === 'indicating') indicating = true;
  else if (progressType === 'error') error = true;

  if (messageList) {
    listItems = messageList.map((listItem) => <li>{listItem}</li>);
  }

  const list = messageList ? <ul>{listItems}</ul> : '';

  return (
      <main className="loading-screen">
          <Container>
              <img src={imageSrc} alt={imageAlt} className="loading-img" />
              <p><strong>{title}</strong></p>
              <p>{message}</p>
              {list}
          </Container>
          <Progress percent={progress} size="small" indicating={indicating} error={error} />
      </main>
  );
};

LoadingComponent.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  messageList: PropTypes.arrayOf(PropTypes.string),
  imageType: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  progressType: PropTypes.string.isRequired,
};

export default LoadingComponent;
