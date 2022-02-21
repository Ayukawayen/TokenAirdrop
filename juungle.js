function onAdapterLoad() {
	document.querySelector('input[name="recipient"]').value = account;
	onRecipientChange();
}


async function onNext() {
	let data = getInputData();
	if(!data.slpId) return;

	let nft = await getNft(data.slpId);
	
	if(nft.priceSatoshis) {
		error(`Please cancel sale of the SLP Waifu on Juungle.`);
		return;
		//unlist check only on frontend. if you read this line you may disable that check by yourself.
	}

	let price = BigInt('0x8' + data.digest.slice(-9)).toString();
	price = price.slice(0,-8) + '.' + price.slice(-8);
	
	document.querySelector('input[name="price"]').value = price;
}

async function onSlpIdChange() {
	document.querySelector('input[name="price"]').value = '';
	
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
	
	return data.slpId;
}
function onRecipientChange() {
	document.querySelector('input[name="price"]').value = '';
	
	let data = getInputData();
	
	let regexp = /[0-9a-fA-F]{40}/i;
	if(!regexp.test(data.recipient)) {
		error('Invalid Address: ' + document.querySelector('input[name="recipient"]').value );
		return;
	}

	return data.recipient;
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
	
	let msg = 'For 2nd Smart Waifu Airdrop: ' + `{"slpId":"${slpId}","recipient":"0x${recipient}"}`;
	let digest = ethers.utils.keccak256(ethers.utils.toUtf8CodePoints(msg)).substr(2);
	
	return {
		slpId:slpId,
		recipient:recipient,
		digest:digest,
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
	
	let price = BigInt('0x8' + data.digest.slice(-9)).toString();
	
	let nft = await getNft(data.slpId);
	if(nft.priceSatoshis != price) {
		error(`Invalid price. Please cancel sale and set the correct price then try again.`);
		return;
	}

	let url = `https://us-central1-gifuwolf.cloudfunctions.net/function-6/?slpId=${data.slpId}&recipient=0x${data.recipient}`;
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
		gas = parseInt(gas.toString()) + 50000;
		
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
async function getNft(slpId) {
	let url = `https://www.juungle.net/api/v1/nfts?tokenId=${slpId}&sortBy=priceUpdatedTs&sortDir=desc&limit=1`;
	let buffer = await fetch(url);
	try {
		response = await buffer.json();
	} catch (err) {
		error(`Fail to fetch data from Juungle. Please try again in a few minute.`);
		return;
	}
	
	if(!response.nfts) {
		error(`Something error. Please try again.`);
		return;
	}
	
	let nft = response.nfts[0];
	if(!nft) {
		error(`SLP Token #${slpId} not found in Juungle`);
		return;
	}
	if(nft.groupTokenId != ParentId) {
		error(`SLP Token #${slpId} is not a Waifu Token`);
		return;
	}
	
	return nft;
}

function error(msg) {
	alert(msg);
}
