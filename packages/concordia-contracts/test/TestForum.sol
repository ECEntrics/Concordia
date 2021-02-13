pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "../contracts/Forum.sol";

contract TestForum {
    function testTrue() public {

        Assert.isTrue(true, "Oops placeholder test failed!");
    }
}