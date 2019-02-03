let web3,isMetaMask = false;

if (typeof window.web3 !== 'undefined') {
    console.log('web3 is enabled');
    web3 = new Web3(window.web3.currentProvider);
    if (web3.currentProvider.isMetaMask === true) {
        console.log('MetaMask is active')
    } else {
        console.log('MetaMask is not available')
    }
} else {
    console.log('web3 is not found')
}

if(isMetaMask){
    contract = new web3.eth.Contract(abi,adddress);
}