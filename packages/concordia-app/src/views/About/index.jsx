import React, {
  memo, useEffect, useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Image, Segment } from 'semantic-ui-react';
import AboutMd from '../../assets/About.md';
import appLogo from '../../assets/images/app_logo_circle.svg';
import targetBlank from '../../utils/markdownUtils';

import './styles.css';

const About = () => {
  const [aboutMd, setAboutMd] = useState('');

  useEffect(() => {
    fetch(AboutMd)
      .then((response) => response.text())
      .then((text) => {
        setAboutMd(text);
      });
  }, []);

  return (
      <Container>
          <Segment id="about-segment">
              <div style={{ textAlign: 'center' }}>
                  <Image id="about-app-logo" src={appLogo} size="small" centered />
                  {`v${process.env.REACT_APP_VERSION}`}
              </div>
              <ReactMarkdown
                source={aboutMd}
                renderers={{
                  link: targetBlank(),
                  linkReference: targetBlank(),
                }}
              />
          </Segment>
      </Container>
  );
};

export default memo(About);
