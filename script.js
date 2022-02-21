function onAdapterLoad() {
	contract.countAvailables(0).then((response)=>{
		document.querySelector('#ecash .available').textContent = response.toString();
	});
	
	contract.countAvailables(1).then((response)=>{
		document.querySelector('#juungle .available').textContent = response.toString();
	});
}
