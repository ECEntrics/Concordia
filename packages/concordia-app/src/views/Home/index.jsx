import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Container, Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import HomeScreenTopicList from './HomeTopicList';
import './styles.css';
import { drizzle } from '../../redux/store';

const {
  contracts: {
    [FORUM_CONTRACT]: {
      methods: {
        numTopics:
    {
      cacheCall: numTopicsChainData,
      clearCacheCall: clearNumTopicsChainData,
    },
      },
    },
  },
} = drizzle;

const Home = () => {
  const [numberOfTopicsCallHash, setNumberOfTopicsCallHash] = useState('');
  const numTopicsResults = useSelector((state) => state.contracts[FORUM_CONTRACT].numTopics);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    setNumberOfTopicsCallHash(numTopicsChainData());
  }, []);

  const numberOfTopics = useMemo(() => (numTopicsResults[numberOfTopicsCallHash] !== undefined
    ? parseInt(numTopicsResults[numberOfTopicsCallHash].value, 10)
    : null),
  [numTopicsResults, numberOfTopicsCallHash]);

  useEffect(() => () => clearNumTopicsChainData(), []);

  return useMemo(() => (
      <Container id="home-container" textAlign="center">
          {numberOfTopics !== null && (
              <>
                  {hasSignedUp
                    ? (
                        <Button
                          id="new-topic-button"
                          className="primary-button"
                          content="New Topic"
                          icon="plus"
                          labelPosition="left"
                          positive
                          onClick={() => history.push('/topics/new')}
                        />
                    )
                    : null}
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {numberOfTopics > 0
                  // eslint-disable-next-line react/jsx-no-undef
                    ? (<HomeScreenTopicList />)
                    : (!hasSignedUp
                      ? (
                          <div id="no-topic-message" className="vertical-center-in-parent unselectable">
                              <Header textAlign="center" as="h2">
                                  {t('board.header.no.topics.message')}
                              </Header>
                              <Header textAlign="center" as="h3">
                                  {t('board.sub.header.no.topics.guest')}
                              </Header>
                          </div>
                      )
                      : (
                          <div id="no-topic-message" className="vertical-center-in-parent unselectable">
                              <Header textAlign="center" as="h2">
                                  {t('board.header.no.topics.message')}
                              </Header>
                              <Header textAlign="center" as="h3">
                                  {t('board.sub.header.no.topics.user')}
                              </Header>
                          </div>
                      ))}

              </>
          )}
      </Container>
  ), [numberOfTopics, hasSignedUp, t, history]);
};

export default memo(Home);
