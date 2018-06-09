pragma solidity ^0.4.23;

contract Forum {

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        OrbitDB orbitdb;
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    mapping (address => User) users;
    mapping (string => address) userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName,address userAddress);

    function signUp(string username, string orbitDBId, string orbitTopicsDB, string orbitPostsDB, string orbitPublicKey, string orbitPrivateKey) public returns (bool) {
        require (!hasUserSignedUp(msg.sender), "User has already signed up.");
        require(!isUserNameTaken(username), "Username is already taken.");
        users[msg.sender] = User(username, OrbitDB(orbitDBId, orbitTopicsDB, orbitPostsDB, orbitPublicKey, orbitPrivateKey), new uint[](0), new uint[](0), true);
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

    function getUserTopics(address userAddress) public view returns (uint[]) {
        require (hasUserSignedUp(msg.sender), "User hasn't signed up yet.");
        return users[userAddress].topicIDs;
    }

    function getUserPosts(address userAddress) public view returns (uint[]) {
        require (hasUserSignedUp(msg.sender), "User hasn't signed up yet.");
        return users[userAddress].postIDs;
    }

    //----------------------------------------OrbitDB----------------------------------------
    struct OrbitDB {
        string id;     // TODO: set an upper bound instead of arbitrary string
        string topicsDB;    //TODO: not sure yet which of these are actually needed
        string postsDB;
        string publicKey;
        string privateKey;
    }


    function getOrbitDBId(address userAddress) public view returns (string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.id;
    }

    function getOrbitTopicsDB(address userAddress) public view returns (string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.topicsDB;
    }

    function getOrbitPostsDB(address userAddress) public view returns (string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.postsDB;
    }

    function getOrbitPublicKey(address userAddress) public view returns (string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.publicKey;
    }

    //TODO: encrypt using Metamask in the future
    function getOrbitPrivateKey(address userAddress) public view returns (string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.privateKey;
    }

    function getOrbitDBInfo(address userAddress) public view returns (string, string, string, string, string) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return (
                users[userAddress].orbitdb.id,
                users[userAddress].orbitdb.topicsDB,
                users[userAddress].orbitdb.postsDB,
                users[userAddress].orbitdb.publicKey,
                users[userAddress].orbitdb.privateKey
        );
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
        uint topicID;
    }

    uint numTopics;   // Total number of topics
    uint numPosts;    // Total number of posts

    mapping (uint => Topic) topics;
    mapping (uint => Post) posts;

    event TopicCreated(uint topicID, uint postID);
    event PostCreated(uint postID, uint topicID);
    /* event NumberOfTopicsReceived(uint numTopics);
    event TopicReceived(string orbitTopicsDB, address author, string username, uint timestamp, uint[] postIDs); */

    function createTopic() public returns (uint, uint) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create topics
        //Creates topic
        uint topicID = numTopics++;
        topics[topicID] = Topic(topicID, msg.sender, block.timestamp, new uint[](0));
        users[msg.sender].topicIDs.push(topicID);

        //Adds first post to topic
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);

        emit TopicCreated(topicID, postID);
        return (topicID, postID);
    }

    function createPost(uint topicID) public returns (uint) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create posts
        require(topicID<numTopics); // Only allow posting to a topic that exists
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);
        emit PostCreated(postID, topicID);
        return postID;
    }

    function getNumberOfTopics() public view returns (uint) {
        /* emit NumberOfTopicsReceived(numTopics); */
        return numTopics;
    }

    function getTopic(uint topicID) public view returns (string, address, string, uint, uint[]) {
        //require(hasUserSignedUp(msg.sender)); needed?
        require(topicID<numTopics);
        return (getOrbitTopicsDB(topics[topicID].author),
            topics[topicID].author,
            users[topics[topicID].author].username,
            topics[topicID].timestamp,
            topics[topicID].postIDs
        );
    }

    function getTopicPosts(uint topicID) public view returns (uint[]) {
        require(topicID<numTopics); // Topic should exist
        return topics[topicID].postIDs;
    }

    function getPost(uint postID) public view returns (string, address, string, uint, uint) {
        //require(hasUserSignedUp(msg.sender)); needed?
        require(postID<numPosts);
        return (getOrbitPostsDB(posts[postID].author),
            posts[postID].author,
            users[posts[postID].author].username,
            posts[postID].timestamp,
            posts[postID].topicID
        );
    }
}
