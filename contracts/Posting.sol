pragma solidity >=0.5.6 <0.6.0;

contract Posting {
    address forumContractAddress;

    function setForumContractAddress() public{
        require(forumContractAddress==address(0));
        forumContractAddress = msg.sender;
    }

    struct Topic {
        uint topicID;
        address author;
        uint timestamp;
        uint[] postIDs;
    }

    struct Post {
        uint postID;
        address author;
        uint timestamp;
        uint topicID;
    }

    uint numTopics;   // Total number of topics
    uint numPosts;    // Total number of posts

    mapping (uint => Topic) topics;
    mapping (uint => Post) posts;

    function createTopic(address author) public returns (uint, uint) {
        require(msg.sender==forumContractAddress);
        //Creates topic
        uint topicID = numTopics++;
        topics[topicID] = Topic(topicID, author, block.timestamp, new uint[](0));

        //Adds first post to topic
        uint postID = numPosts++;
        posts[postID] = Post(postID, author, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);

        return (topicID, postID);
    }

    function createPost(uint topicID, address author) public returns (uint) {
        require(msg.sender==forumContractAddress);
        require(topicID<numTopics); // Only allow posting to a topic that exists
        uint postID = numPosts++;
        posts[postID] = Post(postID, author, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);

        return postID;
    }

    function getNumberOfTopics() public view returns (uint) {
        return numTopics;
    }

    function getTopicInfo(uint topicID) public view returns (address, uint, uint[] memory) {
        require(topicID<numTopics);
        return (topics[topicID].author,
        topics[topicID].timestamp,
        topics[topicID].postIDs
        );
    }

    function getTopicPosts(uint topicID) public view returns (uint[] memory) {
        require(topicID<numTopics); // Topic should exist
        return topics[topicID].postIDs;
    }

    function getPostInfo(uint postID) public view returns (address, uint, uint) {
        require(postID<numPosts);
        return (
        posts[postID].author,
        posts[postID].timestamp,
        posts[postID].topicID
        );
    }

}
