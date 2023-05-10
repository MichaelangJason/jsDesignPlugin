
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
})

// API authentication parameters
const AUTHENTICATION = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer hEBPHU9ZzUiwY5WuhHklAZyhOXodkGCPfRxzNOFZ02o=',
        //Credential: 'omit',
        Referer: 'https://js.design'
    }
}

// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/'

/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    fakeRetrieve(msg.val)
    
}

const post = (type: string, msg: any = {}) => jsDesign.ui.postMessage({pluginMessage: {type, ...msg}});

async function fakeRetrieve(arg: string) {
    const api = 'https://reqres.in/api/' + arg
    try {
    const result = await fetch(api);
    if(!result.ok) {
        console.log("not ok")
        post('failed', {})
    } else {
    const data = await result.json();
    console.log(data)
    post('success', {val: data})
    }
    } catch(err) {
        console.log(err);
        post("error", {error: err})
    }
    // console.log(data.data[0])
}

async function fetchWithDomainName(domainName: string) {
    const api = BRANDFETCH_API_PREFIX + 'brands' + domainName;
    
    try {
        const result = await fetch(api);
        const data = await result.json();
    } catch(error) {
        console.log(error);
    }
}

async function searchBrandDomain(brandName: string) {
    const api = BRANDFETCH_API_PREFIX + 'search' + brandName;

    try {
        const result = await fetch(api);
        const data = await result.json();
    } catch(error) {
        console.log(error);
    }
}
