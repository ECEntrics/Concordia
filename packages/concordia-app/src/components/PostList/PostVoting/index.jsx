import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { POST_VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';
import './styles.css';

const CHOICE_DEFAULT = '0';
const CHOICE_UP = '1';
const CHOICE_DOWN = '2';

const {
  contracts: {
    [POST_VOTING_CONTRACT]: {
      methods: {
        getVote: { cacheCall: getVoteChainData },
        getUpvoteCount: { cacheCall: getUpvoteCountChainData },
        getDownvoteCount: { cacheCall: getDownvoteCountChainData },
        upvote, downvote, unvote,
      },
    },
  },
} = drizzle;

const PostVoting = (props) => {
  const { postId, postAuthorAddress } = props;
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const userAccount = useSelector((state) => state.accounts[0]);

  // Current votes
  const getVoteResult = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getVote);
  const getUpvoteCountResult = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getUpvoteCount);
  const getDownvoteCountResult = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getDownvoteCount);

  const [getVoteCallHash, setGetVoteCallHash] = useState([]);
  const [getUpvoteCountCallHash, setGetUpvoteCountCallHash] = useState([]);
  const [getDownvoteCountCallHash, setGetDownvoteCountCallHash] = useState([]);

  const [ownVote, setOwnVote] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(null);
  const [downvoteCount, setDownvoteCount] = useState(null);

  // Voting
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [voting, setVoting] = useState(false);
  const [createVoteCacheSendStackId, setVoteCacheSendStackId] = useState('');

  // Current votes
  useEffect(() => {
    if (drizzleInitialized && !drizzleInitializationFailed && postId !== null) {
      if (upvoteCount === null) setGetUpvoteCountCallHash(getUpvoteCountChainData(postId));

      if (downvoteCount === null) setGetDownvoteCountCallHash(getDownvoteCountChainData(postId));
    }
  }, [downvoteCount, drizzleInitializationFailed, drizzleInitialized, postId, upvoteCount, userAccount]);

  useEffect(() => {
    const shouldGetOwnVoteFromChain = ownVote === null;

    if (drizzleInitialized && !drizzleInitializationFailed && shouldGetOwnVoteFromChain
            && postId !== null && userAccount !== null) {
      setGetVoteCallHash(getVoteChainData(postId, userAccount));
    }
  }, [drizzleInitializationFailed, drizzleInitialized, ownVote, postId, userAccount]);

  useEffect(() => {
    if (getVoteCallHash && getVoteResult && getVoteResult[getVoteCallHash]) {
      setOwnVote(getVoteResult[getVoteCallHash].value);
    }
  }, [getVoteCallHash, getVoteResult]);

  useEffect(() => {
    if (getUpvoteCountCallHash && getUpvoteCountResult && getUpvoteCountResult[getUpvoteCountCallHash]) {
      setUpvoteCount(getUpvoteCountResult[getUpvoteCountCallHash].value);
    }
  }, [getUpvoteCountCallHash, getUpvoteCountResult]);

  useEffect(() => {
    if (getDownvoteCountCallHash && getDownvoteCountResult && getDownvoteCountResult[getDownvoteCountCallHash]) {
      setDownvoteCount(getDownvoteCountResult[getDownvoteCountCallHash].value);
    }
  }, [getDownvoteCountCallHash, getDownvoteCountResult]);

  // Voting
  useEffect(() => {
    if (voting && transactionStack && transactionStack[createVoteCacheSendStackId]
            && transactions[transactionStack[createVoteCacheSendStackId]]) {
      if (transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_SUCCESS
          || transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_ERROR) {
        setVoting(false);
      }
    }
  }, [createVoteCacheSendStackId, transactionStack, transactions, voting]);

  const vote = useCallback((choice) => {
    if (voting) return;

    setVoting(true);
    if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_DOWN) && choice === CHOICE_UP) setVoteCacheSendStackId(upvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_UP) && choice === CHOICE_DOWN) setVoteCacheSendStackId(downvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_UP && choice === CHOICE_UP) || (ownVote === CHOICE_DOWN && choice === CHOICE_DOWN)) setVoteCacheSendStackId(unvote.cacheSend(...[postId], { from: userAccount }));
  }, [ownVote, postId, userAccount, voting]);

  const disableVoting = userAccount === null || !hasSignedUp || postAuthorAddress === null || userAccount === postAuthorAddress;
  const totalVoteCount = (upvoteCount !== null && downvoteCount !== null) ? upvoteCount - downvoteCount : null;
  return useMemo(() => (
      <div className="post-voting">
          <Button
            compact
            size="mini"
            icon="arrow down"
            negative={ownVote === CHOICE_DOWN}
            disabled={disableVoting}
            onClick={() => vote(CHOICE_DOWN)}
          />
          <Popup
            trigger={(
                <span className="unselectable">
              &nbsp;&nbsp;
                    {totalVoteCount || 0}
                        &nbsp;&nbsp;
                </span>
            )}
            disabled={(upvoteCount === null && downvoteCount === null) || (upvoteCount === '0' && downvoteCount === '0')}
            position="bottom center"
          >
              {upvoteCount !== '0' ? (
                  <span className="upvote-count">
                      +
                      {upvoteCount}
                        &nbsp;&nbsp;
                  </span>
              ) : null}

              {downvoteCount !== '0' ? (
                  <span className="downvote-count">
                      -
                      {downvoteCount}
                  </span>
              ) : null}
          </Popup>
          <Button
            compact
            size="mini"
            icon="arrow up"
            positive={ownVote === CHOICE_UP}
            disabled={disableVoting}
            onClick={() => vote(CHOICE_UP)}
          />
      </div>
  ), [disableVoting, downvoteCount, ownVote, totalVoteCount, upvoteCount, vote]);
};

PostVoting.propTypes = {
  postId: PropTypes.number.isRequired,
  postAuthorAddress: PropTypes.string,
  totalVoteCount: PropTypes.number,
};

export default memo(PostVoting);
