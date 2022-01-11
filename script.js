let provider;
window.ethereum.request({
	method: 'wallet_switchEthereumChain',
	params: [{ chainId: '0x4' }],
}).then((response)=>{
	provider = new ethers.providers.Web3Provider(window.ethereum);
});

const AirdropAddress = '0x5a331711bb6245F4B35a3617a8Bda93d2e3E947E';

async function onNext() {
	let regexp;
	
	let txId = document.querySelector('input[name="txId"]').value;
	if(txId.startsWith('0x')) {
		txId = txId.substr(2);
	}
	regexp = /[0-9a-fA-F]{64}/i;
	if(!regexp.test(txId)) {
		error('Invalid Token ID');
		return;
	}

	let to = document.querySelector('input[name="to"]').value;
	if(to.startsWith('0x')) {
		to = to.substr(2);
	}
	regexp = /[0-9a-fA-F]{40}/i;
	if(!regexp.test(to)) {
		error('Invalid Address');
		return;
	}
	
	document.querySelector('#encryptedCode').value = 'Loading...';
	document.querySelector('input[name="ownerPubkey"]').value = 'Loading...';
	
	let url = `https://us-central1-gifuwolf.cloudfunctions.net/function-1/?txId=${txId}&to=${to}`;
	let response = await fetch(url);
	let parsed = await response.json();

	if(parsed.error) {
		error(parsed.error);
		return;
	}
	
	document.querySelector('#encryptedCode').value = parsed.code;
	document.querySelector('input[name="ownerPubkey"]').value = parsed.ownerPublicKey;
}

async function onSubmit() {
	let code = document.querySelector('#decryptedCode').value;
	let gas = await provider.estimateGas({to:AirdropAddress, data:code});
	gas = parseInt(gas.toString()) + 50000;
	let response = await provider.getSigner().sendTransaction({to:AirdropAddress, gasLimit:gas, data:code});
}

function error(msg) {
	alert(msg);
}
