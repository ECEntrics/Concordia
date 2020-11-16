//SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "./Forum.sol";

contract Voting {
    Forum public forum;

    constructor(Forum addr) {
        forum = Forum(addr);
    }

    struct Poll {
        uint topicID;
        uint numOptions;
        string dataHash;
        mapping (address => uint) voters;
        uint[] voteCounts;  // First element will hold total count
        uint timestamp;
    }

    mapping (uint => Poll) polls;

    event PollCreated(uint topicID);
    event UserVoted(address userAddress);

    function createPoll(uint topicID, uint numOptions, string memory dataHash) public returns (uint) {
        require(forum.hasUserSignedUp(msg.sender));  // Only registered users can create polls
        require(topicID<forum.getNumberOfTopics()); // Only allow poll creation if topic exists
        require (forum.getTopicAuthor(topicID) == msg.sender); // Only allow poll creation from the author of the topic
        require(polls[topicID].timestamp == 0); // Only allow poll creation if it doesn't exist yet

        Poll storage poll = polls[topicID];
        poll.topicID = topicID;
        poll.numOptions = numOptions;
        poll.dataHash = dataHash;
        poll.voteCounts = new uint[](numOptions+1);
        poll.timestamp = block.timestamp;

        emit PollCreated(topicID);
        return topicID;
    }

    // Verify that poll exists
    function isPollExistent(uint topicID) public view returns (bool) {
        if (polls[topicID].timestamp != 0)
            return true;
        return false;
    }

    function hasVoted(uint topicID, address voter) public view returns (bool) {
        require(isPollExistent(topicID));
        if (polls[topicID].voters[voter] != 0)
            return true;
        return false;
    }

    function getPollInfo(uint topicID) public view returns (uint, string memory, uint, uint) {
        require(isPollExistent(topicID));
        return (
        polls[topicID].numOptions,
        polls[topicID].dataHash,
        polls[topicID].timestamp,
        polls[topicID].voteCounts[0]
        );
    }

    // Gets vote count for a specific option (option 0 will return total count)
    function getVoteCount(uint topicID, uint option) public view returns (uint) {
        require(isPollExistent(topicID)); // Verify that poll exists
        return (polls[topicID].voteCounts[option]);
    }

    function vote(uint topicID, uint option) public {
        require(isPollExistent(topicID));
        Poll storage poll = polls[topicID];
        require(option > 0 && option <= poll.numOptions); // Verify that this option exists
        address voter = msg.sender;
        uint currentVote = poll.voters[voter];
        if(currentVote == option)
            return;
        if(currentVote == 0)   // Voter hadn't voted before
            poll.voteCounts[0]++;
        else
            poll.voteCounts[currentVote]--;
        poll.voteCounts[option]++;
        poll.voters[voter] = option;
        emit UserVoted(voter);
    }
}
