pragma solidity ^0.4.23;

contract Forum {

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        string orbitMainDB;     // TODO: set an upper bound instead of arbitrary string
        string orbitTopicsDB;
        string orbitPostsDB;

        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    mapping (address => User) users;
    mapping (string => address) userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName,address userAddress);

    function signUp(string username, string orbitMainDB, string orbitTopicsDB, string orbitPostsDB) public returns (bool) {
        require (!hasUserSignedUp(msg.sender), "User has already signed up.");
        require(!isUserNameTaken(username), "Username is already taken.");
        users[msg.sender] = User(username, orbitMainDB, orbitTopicsDB, orbitPostsDB, new uint[](0), new uint[](0), true);
        userAddresses[username] = msg.sender;
        emit UserSignedUp(username, msg.sender);
        return true;
    }

    function updateUsername(string newUsername) public returns (bool) {
        require (hasUserSignedUp(msg.sender), "User hasn't signed up yet.");
        require(!isUserNameTaken(newUsername), "Username is already taken.");
        string memory oldUsername = getUsername(msg.sender);
        delete userAddresses[users[msg.sender].username];
        users[msg.sender].username = newUsername;
        userAddresses[newUsername] = msg.sender;
        emit UsernameUpdated(newUsername, oldUsername, msg.sender);
        return true;
    }

    function getUsername(address userAddress) public view returns (string) {
        return users[userAddress].username;
    }

    function getUserAddress(string username) public view returns (address) {
        return userAddresses[username];
    }

    function hasUserSignedUp(address userAddress) public view returns (bool) {
        return users[userAddress].signedUp;
    }

    function isUserNameTaken(string username) public view returns (bool) {
        if (getUserAddress(username)!=address(0))
            return true;
        return false;
    }

    function getOrbitMainDB(address userAddress) public view returns (string) {
        return users[userAddress].orbitMainDB;
    }

    function getOrbitTopicsDB(address userAddress) public view returns (string) {
        return users[userAddress].orbitTopicsDB;
    }

    function getOrbitPostsDB(address userAddress) public view returns (string) {
        return users[userAddress].orbitPostsDB;
    }
    //----------------------------------------POSTING----------------------------------------
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
