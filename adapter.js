const AirdropAddress = '0x4D89CF72c29C7f42dBa1A48AeECA4ef381fc2D8C';

let provider;
let account;
window.ethereum.request({
	method: 'eth_requestAccounts',
}).then((response)=>{
	provider = new ethers.providers.Web3Provider(window.ethereum);
	contract = new ethers.Contract(AirdropAddress, ContractABI, provider);
	
	account = response[0];
	
	window.ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId: '0x2710' }],
		//params: [{ chainId: '0x4' }],
	}).then((response)=>{
		if(onAdapterLoad) {
			onAdapterLoad();
		}
	}).catch((err)=>{
		alert(err.message);
	});
});

function error(msg) {
	alert(msg);
}
