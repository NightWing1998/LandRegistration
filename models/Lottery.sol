pragma solidity 0.4.22;
contract property{
    struct person{
        string name;
        uint id;
    }
    struct Land{
        uint propertyIdNo;
        string landAddress;
        person owner;
        person registrationOfficer;
        // person witness;
        uint buyPrice;
        string buyDate;
        // function () internal view returns(mapping(string => string) memory) toMapping;
    }
    mapping(address => person) registrationOfficers;
    mapping(uint => Land) registered;
    
    function officerExists() public view returns(string memory){
        return registrationOfficers[msg.sender].name;
    }
    
    function addRegistrationOfficer(string memory name,uint id) public payable returns(bool){
        registrationOfficers[msg.sender].name = name;
        registrationOfficers[msg.sender].id = id;
        // registrationOfficers[msg.sender].owned = [];
        return true;
    }
    
    function viewPropertyOwner(uint PIN) public view returns(string memory,uint){
        return (registered[PIN].owner.name,registered[PIN].owner.id);
    } 
    
    function propertyExists(uint id) public view returns(string memory,string memory){
        return (registered[id].landAddress,registered[id].owner.name);
    }
    
    function viewPropertyDetails(uint id) public view returns(uint,string memory,string memory,uint,string memory,uint,string memory){
        return (registered[id].propertyIdNo,registered[id].landAddress,registered[id].owner.name,registered[id].owner.id,registered[id].registrationOfficer.name,registered[id].registrationOfficer.id,registered[id].buyDate);
    }
    
    function recordPropertyTransaction(uint PIN,uint sellerId,uint buyerId,string buyerName) public payable returns(bool){
        if( registered[PIN].owner.id == sellerId ){
            registered[PIN].owner.name = buyerName;
            registered[PIN].owner.id = buyerId;
            return true;
        } else{
            return false;
        }
    }
    
}