import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Container } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import AppContext from '../../components/AppContext';
import Board from './Board';

const Home = () => {
  const getNumberOfTopicsResults = useSelector((state) => state.contracts.Forum.getNumberOfTopics);
  const { drizzle: { contracts: { Forum: { methods: { getNumberOfTopics } } } } } = useContext(AppContext.Context);
  const [numberOfTopicsCallHash, setNumberOfTopicsCallHash] = useState('');

  useEffect(() => {
    setNumberOfTopicsCallHash(getNumberOfTopics.cacheCall());
  }, [getNumberOfTopics]);

  const numberOfTopics = useMemo(() => (getNumberOfTopicsResults[numberOfTopicsCallHash] !== undefined
    ? parseInt(getNumberOfTopicsResults[numberOfTopicsCallHash].value, 10)
    : null),
  [getNumberOfTopicsResults, numberOfTopicsCallHash]);

  return (
      <Container textAlign="center">
          {numberOfTopics !== null && <Board numberOfTopics={numberOfTopics} />}
      </Container>
  );
};

export default Home;
