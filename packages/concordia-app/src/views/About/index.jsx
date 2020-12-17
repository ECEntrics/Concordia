import React, {
  memo, useEffect, useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Container } from 'semantic-ui-react';
import AboutMd from '../../assets/About.md';

const targetBlank = () => ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

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
      <Container id="about-container">
          <div style={{ textAlign: 'center' }}>
              {/* TODO: add logo */}
              LOGO
              <br />
              {`v${process.env.REACT_APP_VERSION}`}
          </div>
          <ReactMarkdown
            source={aboutMd}
            renderers={{
              link: targetBlank(),
              linkReference: targetBlank(),
            }}
          />
      </Container>
  );
};

export default memo(About);
