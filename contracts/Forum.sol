pragma solidity ^0.4.21;

contract Forum {

    //----------------------------------------USER----------------------------------------
    struct User {
        string userName;    // TODO: set an upper bound instead of arbitrary string
        // TODO: orbitDBAddress;
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
    }

    mapping (address => User) users;
    mapping (string => address) userAddresses;

    event UserSignedUp(
        string userName
    );

    function signUp(string userName) public returns (bool) {  // Also allows user to update his name - TODO: his previous name will appear as taken
        require(!isUserNameTaken(userName));
        users[msg.sender] = User(userName, new uint[](0), new uint[](0));
        userAddresses[userName] = msg.sender;
        emit UserSignedUp(userName);
        return true;
    }

    function login() public view returns (string) {
        require (hasUserSignedUp(msg.sender));
        return users[msg.sender].userName;
    }

    function getUsername(address userAddress) public view returns (string) {
        return users[userAddress].userName;
    }

    function getUserAddress(string userName) public view returns (address) {
        return userAddresses[userName];
    }

    function hasUserSignedUp(address userAddress) public view returns (bool) {
        if (bytes(getUsername(userAddress)).length!=0)
            return true;
        return false;
    }

    function isUserNameTaken(string userName) public view returns (bool) {
        if (getUserAddress(userName)!=0)
            return true;
        return false;
    }

    //----------------------------------------TOPIC----------------------------------------
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
    }

    uint numTopics;   // Total number of topics
    uint numPosts;    // Total number of posts

    mapping (uint => Topic) topics;
    mapping (uint => Post) posts;

    function createTopic() public returns (uint topicID) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create topics
        topicID = numTopics++;
        topics[topicID] = Topic(topicID, msg.sender, block.timestamp, new uint[](0));
        users[msg.sender].topicIDs.push(topicID);
    }

    function createPost(uint topicID) public returns (uint postID) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create posts
        require(topicID<numTopics); // Only allow posting to a topic that exists
        postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);
    }

    function getTopicPosts (uint topicID) public view returns (uint[]) {
        require(topicID<numTopics); // Topic should exist
        return topics[topicID].postIDs;
    }
}
