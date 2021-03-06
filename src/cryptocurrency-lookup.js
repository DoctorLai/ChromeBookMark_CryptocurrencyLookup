javascript:
(function() {
	/* read as text */
	function __readResponseAsText(response) {
	    return response.text();
	}

	/* read as json */
	function __readResponseAsJSON(response) { 
	    return response.json(); 
	} 

	/* check if valid response */
	function __validateResponse(response) { 
	    if (!response.ok) { 
	        throw Error(response.statusText); 
	    } 
	    return response; 
	}

	function __isNumeric(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/* getting conversion from cryptocompare */
	function CoinToools_GetPriceCC(a, b) {
	    a = a.toUpperCase();
	    if (a == 'SBD') {
	        a = 'SBD*';
	    }
	    b = b.toUpperCase();
	    if (b == 'SBD') {
	        b = 'SBD*';
	    }
	    if (a == 'SP') {
	    	a = 'STEEM';
	    }
	    if (b == 'SP') {
	    	b = 'STEEM';
	    }
	    let api = "https://min-api.cryptocompare.com/data/price?fsym=" + a + "&tsyms=" + b;
	    return new Promise((resolve, reject) => {
	        fetch(api, {mode: 'cors'})
	        .then(__validateResponse)
	        .then(__readResponseAsJSON)
	        .then(function(result) {
	            if (result[b]) {
	                resolve(result[b]);
	            } else {
	                reject("Error: " + a + ", " + b);
	            }
	        }).catch(function(error) {
	            reject(error);
	        });
	    });    
	}

	let query = localStorage.getItem("CryptocurrencyLookupQuery");
	if (!query) {
		query = "";
	}
	let s = prompt("(Cryptocompare) e.g. BTC STEEM, 10 BTC SBD, BTC 10 SBD", query);
	if (s != null) {
		s = s.trim();
		localStorage.setItem("CryptocurrencyLookupQuery", s);
		let arr = s.split(' ');
		if (arr.length == 2) { /* BTC SBD */
			CoinToools_GetPriceCC(arr[0], arr[1]).then((x) => {
				alert("1 " + arr[0].toUpperCase() + " = " + x + " " + arr[1].toUpperCase());
			}).catch((error) => {
				alert(error);
			});
		} else if (arr.length == 3) { /* 2 BTC STEEM */
			if (__isNumeric(arr[0])) {
				CoinToools_GetPriceCC(arr[1], arr[2]).then((x) => {
					alert(arr[0] + " " + arr[1].toUpperCase() + " = " + (x * arr[0]) + " " + arr[2].toUpperCase());
				}).catch((error) => {
					alert(error);
				});	    				
			} else if (__isNumeric(arr[1])) { /* SBD 3 STEEM */
				CoinToools_GetPriceCC(arr[2], arr[0]).then((x) => {
					alert((arr[1] * x) + " " + arr[0].toUpperCase() + " = " + arr[1] + " " + arr[2].toUpperCase());
				}).catch((error) => {
					alert(error);
				});	 
			}
		}
	}
})();
