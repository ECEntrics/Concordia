//SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "./Forum.sol";

contract Voting {
    // Error messages for require()
    string constant TOPIC_POLL_DIFFERENT_CREATOR = "Only topic's author can create a poll.";
    string constant POLL_EXISTS = "Poll already exists.";
    string constant POLL_DOES_NOT_EXIST = "Poll does not exist.";
    string constant INVALID_OPTION = "Invalid option.";
    string constant USER_HAS_NOT_VOTED = "User hasn't voted.";

    Forum public forum;

    constructor(Forum addr) {
        forum = Forum(addr);
    }

    struct Poll {
        uint topicID;
        uint numOptions;
        string dataHash;
        mapping(address => uint) votes;
        mapping(uint => address[]) voters;
        bool enableVoteChanges;
        uint timestamp;
    }

    mapping(uint => Poll) polls;

    event PollCreated(uint topicID);
    event UserVotedPoll(address userAddress, uint topicID, uint vote);

    function pollExists(uint topicID) public view returns (bool) {
        if (polls[topicID].timestamp != 0)
            return true;
        return false;
    }

    function createPoll(uint topicID, uint numOptions, string memory dataHash, bool enableVoteChanges) public returns (uint) {
        require(forum.hasUserSignedUp(msg.sender), forum.USER_HAS_NOT_SIGNED_UP());
        require(forum.topicExists(topicID), forum.TOPIC_DOES_NOT_EXIST());
        require(forum.getTopicAuthor(topicID) == msg.sender, TOPIC_POLL_DIFFERENT_CREATOR);
        require(!pollExists(topicID), POLL_EXISTS);

        Poll storage poll = polls[topicID];
        poll.topicID = topicID;
        poll.numOptions = numOptions;
        poll.dataHash = dataHash;
        poll.enableVoteChanges = enableVoteChanges;
        poll.timestamp = block.timestamp;

        emit PollCreated(topicID);
        return topicID;
    }

    function getPollInfo(uint topicID) public view returns (uint, string memory, uint, uint) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);

        uint totalVotes = getTotalVotes(topicID);

        return (
        polls[topicID].numOptions,
        polls[topicID].dataHash,
        polls[topicID].timestamp,
        totalVotes
        );
    }

    function isOptionValid(uint topicID, uint option) public view returns (bool) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        if (option <= polls[topicID].numOptions)    // Option 0 is valid as well (no option chosen)
            return true;
        return false;
    }

    function hasVoted(uint topicID, address voter) public view returns (bool) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        if (polls[topicID].votes[voter] != 0)
            return true;
        return false;
    }

    function getVote(uint topicID, address voter) public view returns (uint) {
        require(hasVoted(topicID, voter), USER_HAS_NOT_VOTED);
        return polls[topicID].votes[voter];
    }

    function getVoteCount(uint topicID, uint option) public view returns (uint) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        require(isOptionValid(topicID, option), INVALID_OPTION);
        return (polls[topicID].voters[option].length);
    }

    function getTotalVotes(uint topicID) public view returns (uint) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);

        Poll storage poll = polls[topicID];
        uint totalVotes = 0;

        for (uint pollOption = 1; pollOption <= poll.numOptions; pollOption++)
            totalVotes += poll.voters[pollOption].length;

        return totalVotes;
    }

    // Gets voters for a specific option
    function getVoters(uint topicID, uint option) public view returns (address[] memory) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        return (polls[topicID].voters[option]);
    }

    function getVoterIndex(uint topicID, address voter) public view returns (uint) {
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        require(hasVoted(topicID, voter), USER_HAS_NOT_VOTED);
        Poll storage poll = polls[topicID];
        uint votedOption = getVote(topicID, voter);
        address[] storage optionVoters = poll.voters[votedOption];

        for (uint voterIndex = 0; voterIndex < optionVoters.length; voterIndex++)
            if (optionVoters[voterIndex] == voter)
                return voterIndex;

        revert("Couldn't find voter's index!");
    }

    function vote(uint topicID, uint option) public {
        require(forum.hasUserSignedUp(msg.sender), forum.USER_HAS_NOT_SIGNED_UP());
        require(pollExists(topicID), POLL_DOES_NOT_EXIST);
        require(isOptionValid(topicID, option), INVALID_OPTION);
        Poll storage poll = polls[topicID];
        address voter = msg.sender;
        uint prevOption = poll.votes[voter];
        if (prevOption == option)
            return;

        // Voter hasn't voted before
        if (prevOption == 0) {
            poll.voters[option].push(voter);
            poll.votes[voter] = option;
            emit UserVotedPoll(voter, topicID, option);
        }
        else if (poll.enableVoteChanges) {
            uint voterIndex = getVoterIndex(topicID, voter);
            // Swap with last voter address and delete vote
            poll.voters[prevOption][voterIndex] = poll.voters[prevOption][poll.voters[prevOption].length - 1];
            poll.voters[prevOption].pop();
            if (option != 0)
                poll.voters[option].push(voter);
            poll.votes[voter] = option;
            emit UserVotedPoll(voter, topicID, option);
        }
    }
}
