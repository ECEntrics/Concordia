//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Forum.sol";
import "../contracts/Voting.sol";

contract TestVoting {
    Forum forum;
    uint firstTopicId;

    function beforeAll() public {
        forum = Forum(DeployedAddresses.Forum());

        forum.signUp('testAccount');
        (firstTopicId,) = forum.createTopic();
    }

    function testIsPollExistent() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        bool actual = voting.isPollExistent(firstTopicId);

        Assert.equal(actual, false, "Poll should not exist");
    }

    function testCreatePoll() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        uint actual = voting.createPoll(firstTopicId, 3, 'asdf', false);

        Assert.equal(actual, firstTopicId, "Topic Id should be 1");
    }

    function testGetTotalVotes() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        uint actual = voting.getTotalVotes(firstTopicId);

        Assert.equal(actual, 0, "Topic Id should be 0");
    }

    function testGetPollInfo() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        (uint actualNumberOfOptions, string memory actualDataHash, , uint actualNumberOfVotes) = voting.getPollInfo(firstTopicId);

        Assert.equal(actualNumberOfOptions, 3, "Number of votes should be 0");
        Assert.equal(actualDataHash, 'asdf', "Number of votes should be 0");
        Assert.equal(actualNumberOfVotes, 0, "Number of votes should be 0");
    }

    function testVote() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        voting.vote(firstTopicId, 1);
        uint votesActual = voting.getTotalVotes(firstTopicId);

        Assert.equal(votesActual, 1, "Number of votes should be 1");
    }

    function testGetVoteCount() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        uint actualVotesOption0 = voting.getVoteCount(firstTopicId, 1);
        uint actualVotesOption1 = voting.getVoteCount(firstTopicId, 2);
        uint actualVotesOption2 = voting.getVoteCount(firstTopicId, 3);

        Assert.equal(actualVotesOption0, 1, "Vote count is not correct");
        Assert.equal(actualVotesOption1, 0, "Vote count is not correct");
        Assert.equal(actualVotesOption2, 0, "Vote count is not correct");
    }

    function testChangeVoteWhenDisabled() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        (uint topicId,) = forum.createTopic();
        voting.createPoll(topicId, 3, 'asdf', false);

        voting.vote(topicId, 1);
        uint actualVotesOption0 = voting.getVoteCount(topicId, 1);
        uint actualVotesOption1 = voting.getVoteCount(topicId, 2);
        voting.vote(topicId, 2);
        uint actualVotesOption2 = voting.getVoteCount(topicId, 1);
        uint actualVotesOption3 = voting.getVoteCount(topicId, 2);

        Assert.equal(actualVotesOption0, 1, "Number of votes should be 1");
        Assert.equal(actualVotesOption1, 0, "Number of votes should be 0");
        Assert.equal(actualVotesOption2, 1, "Number of votes should be 1");
        Assert.equal(actualVotesOption3, 0, "Number of votes should be 0");
    }

    function testChangeVoteWhenEnabled() public {
        Voting voting = Voting(DeployedAddresses.Voting());

        (uint topicId,) = forum.createTopic();
        voting.createPoll(topicId, 3, 'asdf', true);

        voting.vote(topicId, 1);
        uint actualVotesOption0 = voting.getVoteCount(topicId, 1);
        uint actualVotesOption1 = voting.getVoteCount(topicId, 2);
        voting.vote(topicId, 2);
        uint actualVotesOption2 = voting.getVoteCount(topicId, 1);
        uint actualVotesOption3 = voting.getVoteCount(topicId, 2);

        Assert.equal(actualVotesOption0, 1, "Number of votes should be 1");
        Assert.equal(actualVotesOption1, 0, "Number of votes should be 0");
        Assert.equal(actualVotesOption2, 0, "Number of votes should be 0");
        Assert.equal(actualVotesOption3, 1, "Number of votes should be 1");
    }
}
