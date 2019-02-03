let web3,isMetaMask = false,contract;
document.onload = function(){
    if (typeof window.web3 !== 'undefined') {
        console.log('web3 is enabled');
        web3 = new Web3(window.web3.currentProvider);
        if (web3.currentProvider.isMetaMask === true) {
            console.log('MetaMask is active');
            contract = new web3.eth.Contract(abi,adddress);
        } else {
            console.log('MetaMask is not available')
        }
    } else {
        console.log('web3 is not found');
    }
    
}

checkDetails = async (event) => {
    event.preventDefault();
    
    try{
        if( contract.methods.propertyExists(PIN)  && contract.methods.viewPropertyOwner(PIN) )
    } catch(err){
        throw err;
    }
}

console.log(buyerId,sellerId,witnessId,PIN);