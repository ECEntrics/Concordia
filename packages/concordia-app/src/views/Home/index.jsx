import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import Board from './Board';
import './styles.css';
import { drizzle } from '../../redux/store';

const { contracts: { [FORUM_CONTRACT]: { methods: { numTopics } } } } = drizzle;

const Home = () => {
  const [numberOfTopicsCallHash, setNumberOfTopicsCallHash] = useState('');
  const numTopicsResults = useSelector((state) => state.contracts[FORUM_CONTRACT].numTopics);

  useEffect(() => {
    setNumberOfTopicsCallHash(numTopics.cacheCall());
  }, []);

  const numberOfTopics = useMemo(() => (numTopicsResults[numberOfTopicsCallHash] !== undefined
    ? parseInt(numTopicsResults[numberOfTopicsCallHash].value, 10)
    : null),
  [numTopicsResults, numberOfTopicsCallHash]);

  return useMemo(() => (
      <Container id="home-container" textAlign="center">
          {numberOfTopics !== null && <Board numberOfTopics={numberOfTopics} />}
      </Container>
  ), [numberOfTopics]);
};

export default memo(Home);
