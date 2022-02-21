function onAdapterLoad() {
	document.querySelector('input[name="recipient"]').value = account;
	onRecipientChange();
}

async function onOwnerAddressClick() {
	if(document.querySelector('#ownerAddress').value.length > 0) return;
	
	let regexp;
	
	let slpId = await onSlpIdChange();
	if(!slpId) return;

	document.querySelector('#ownerAddress').value = 'Loading...';
	let addr = await getOwner(slpId);
	if(!addr) {
		document.querySelector('#ownerAddress').value = 'Fail to load the address of token owner';
		return;
	}
	document.querySelector('#ownerAddress').value = addr;
}

async function onSlpIdChange() {
	let data = getInputData();
	
	let regexp = /[0-9a-fA-F]{64}/i;
	if(!regexp.test(data.slpId)) {
		error('Invalid Waifu ID');
		return;
	}
	
	let isSlpClaimed = await contract.isSlpClaimed('0x'+data.slpId);
	
	if(isSlpClaimed) {
		error(`SLP ${data.slpId} has been claimed.`);
	}
	
	document.querySelector('#ownerAddress').value = '';
	document.querySelector('#message').value = 'For 2nd Smart Waifu Airdrop: ' + `{"slpId":"${data.slpId}","recipient":"0x${data.recipient}"}`;
	
	return data.slpId;
}
function onRecipientChange() {
	let data = getInputData();
	
	let regexp = /[0-9a-fA-F]{40}/i;
	if(!regexp.test(data.recipient)) {
		error('Invalid Address: ' + document.querySelector('input[name="recipient"]').value );
		return;
	}
	
	document.querySelector('#message').value = 'For 2nd Smart Waifu Airdrop: ' + `{"slpId":"${data.slpId}","recipient":"0x${data.recipient}"}`;

	return data.recipient;
}

function onMessageClick() {
	let data = getInputData();
	document.querySelector('#message').value = 'For 2nd Smart Waifu Airdrop: ' + `{"slpId":"${data.slpId}","recipient":"0x${data.recipient}"}`;
}

function getInputData() {
	let slpId = document.querySelector('input[name="slpId"]').value;
	if(slpId.startsWith('0x')) {
		slpId = slpId.substr(2);
	}

	let recipient = document.querySelector('input[name="recipient"]').value;
	if(recipient.startsWith('0x')) {
		recipient = recipient.substr(2);
	}
	
	return {
		slpId:slpId,
		recipient:recipient,
	};
}

async function onSubmit() {
	document.querySelector('#submit').setAttribute('disabled', 'disabled');
	document.querySelector('#submit').textContent = ' ... ';
	await handleSubmit();
	document.querySelector('#submit').textContent = 'Submit';
	document.querySelector('#submit').removeAttribute('disabled');
}

async function handleSubmit() {
	let data = getInputData();
	
	let signature = document.querySelector('#signature').value;
	signature = encodeURIComponent(signature);
	
	let url = `https://us-central1-gifuwolf.cloudfunctions.net/function-4/?slpId=${data.slpId}&recipient=0x${data.recipient}&signature=${signature}`;
	let response = await fetch(url);
	let parsed = await response.json();

	if(parsed.error) {
		error(parsed.error);
		return;
	}

	let code = parsed.code;
	let gas;
	try {
		gas = await provider.estimateGas({to:AirdropAddress, data:code});
		gas = parseInt(gas.toString()) + 30000;
		
		await provider.getSigner().sendTransaction({to:AirdropAddress, gasLimit:gas, data:code});
	} catch(ex) {
		let msg = ((ex)=>{
			if(ex.error && ex.error.data && ex.error.data.originalError && ex.error.data.originalError.message) {
				return 'Error: ' + ex.error.data.originalError.message;
			} else if(ex.error && ex.error.message) {
				return 'Error: ' + ex.error.message;
			} else if(ex.data && ex.data.message) {
				return 'Error: ' + ex.data.message;
			} else if(ex.message) {
				return 'Error: ' + ex.message;
			}
			return 'Something went wrong. Please reload the page and try again.';
		})(ex);
		error(msg);
	}
}

const ParentId = 'a2987562a405648a6c5622ed6c205fca6169faa8afeb96a994b48010bd186a66';
async function getOwner(slpId) {
	let query = {
		"v": 3,
		"q": {
			"db": ["c", "u"],
			"aggregate":[
				{
					"$match":{
						"slp.detail.tokenIdHex": slpId
					}
				},
				{
					"$lookup": {
						"from": "tokens",
						"localField": "slp.detail.tokenIdHex",
						"foreignField": "tokenDetails.tokenIdHex",
						"as": "token"
					}
				}
			],
			"limit": 1
		},
		"r": {
			"f": "[.[] | { outputs:.slp.detail.outputs, tokens:.token } ]"
		}
	};
	query = btoa(JSON.stringify(query));
	
	let url = `https://slpdb.fountainhead.cash/q/${query}`;
	let buffer = await fetch(url);
	let response;
	
	try {
		response = await buffer.json();
	} catch (err) {
		error(`Fail to fetch data from SLPDB. Please try again in a few minute.`);
		return;
	}
	
	let tx = response.u[0] || response.c[0];
	if(!tx) {
		error(`SLP Token #${slpId} not found`);
		return;
	}
	if(!tx.tokens[0] || tx.tokens[0].nftParentId != ParentId) {
		error(`SLP Token #${slpId} is not a Waifu Token`);
		return;
	}
	
	let addr = null;
	for(let i=0;i<tx.outputs.length;++i) {
		if(tx.outputs[i].amount > 0) {
			addr = tx.outputs[i].address;
			break;
		}
	}
	
	if(!addr) {
		error(`Cannot get owner address`);
		return;
	}
	
	return addr;
}

function error(msg) {
	alert(msg);
}
