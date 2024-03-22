// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "hardhat/console.sol";

contract FrameLicense {
    struct Frame {
        address owner;
        uint256 uniqueId;
        uint256 price;
        mapping(address => bool) hasLicense;
    }

    mapping(uint256 => Frame) public frames;

    event FrameRegistered(uint256 indexed frameId, address indexed owner, uint256 price);

// admin ------------------------------------------------------------------------------------------------
    function registerNewFrame() public payable returns (uint256){
        // generate new uniqueid
        uint256 _uniqueId = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        require(frames[_uniqueId].uniqueId == 0, "Frame already exists");
        // extract value from msg.value
        uint256 _price = msg.value;

        // create new frame
        Frame storage newFrame = frames[_uniqueId];
        newFrame.owner = msg.sender;
        newFrame.uniqueId = _uniqueId;
        newFrame.price = _price;
  
        emit FrameRegistered(_uniqueId, msg.sender, msg.value);
        return _uniqueId;
    }

    function grantAccess(uint256 _uniqueId, address _user) public {
        require(frames[_uniqueId].uniqueId != 0, "Frame does not exist");
        require(frames[_uniqueId].owner == msg.sender, "You are not the owner of this frame");

        frames[_uniqueId].hasLicense[_user] = true;
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
// admin ------------------------------------------------------------------------------------------------
// user  ------------------------------------------------------------------------------------------------
    function licenseFrame(uint256 _uniqueId) public payable {
        require(frames[_uniqueId].uniqueId != 0, "Frame does not exist");
        require(frames[_uniqueId].owner != msg.sender, "You cannot license your own frame");
        require(frames[_uniqueId].price == msg.value, "Incorrect value");

        // send value to owner
        payable(frames[_uniqueId].owner).transfer(msg.value);
        frames[_uniqueId].hasLicense[msg.sender] = true;
    }

    function hasLicense(uint256 _uniqueId) public view returns (bool){
        require(frames[_uniqueId].uniqueId != 0, "Frame does not exist");
        // if owner return true
        if(frames[_uniqueId].owner == msg.sender){
            return true;
        }
        return frames[_uniqueId].hasLicense[msg.sender];
    }
    
// user  ------------------------------------------------------------------------------------------------
}