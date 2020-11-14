import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import Board from './Board';
import './styles.css';
import { drizzle } from '../../redux/store';

const { contracts: { Forum: { methods: { getNumberOfTopics } } } } = drizzle;

const Home = () => {
  const [numberOfTopicsCallHash, setNumberOfTopicsCallHash] = useState('');
  const getNumberOfTopicsResults = useSelector((state) => state.contracts.Forum.getNumberOfTopics);

  useEffect(() => {
    setNumberOfTopicsCallHash(getNumberOfTopics.cacheCall());
  }, []);

  const numberOfTopics = useMemo(() => (getNumberOfTopicsResults[numberOfTopicsCallHash] !== undefined
    ? parseInt(getNumberOfTopicsResults[numberOfTopicsCallHash].value, 10)
    : null),
  [getNumberOfTopicsResults, numberOfTopicsCallHash]);

  return useMemo(() => (
      <Container id="home-container" textAlign="center">
          {numberOfTopics !== null && <Board numberOfTopics={numberOfTopics} />}
      </Container>
  ), [numberOfTopics]);
};

export default memo(Home);
