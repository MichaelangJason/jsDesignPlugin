
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
})

// API authentication parameters
const authentication = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer hEBPHU9ZzUiwY5WuhHklAZyhOXodkGCPfRxzNOFZ02o=',
        //Credential: 'same-origin',
        Referer: 'https://js.design'
    }
}
enum Brandfetch_ERROR {
    BAD_REQUEST_BODY = 400,
    UNAUTHORIZED = 401,
    BAD_API_KEY = 403,
    NOT_FOUND = 404,
    REQUEST_TIMEOUT = 408,
    INVALID_DOMAIN = 422,
    LIMIT_EXCEEDED = 429,
}

// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/'

/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    // searchBrand(msg.val)
    if (msg.type === 'search') {
        searchBrand(msg.val);
    }

    if (msg.type === 'getDetails') {
        getDomainDetails(msg.val);
    }
    
}

const post = (type: string, msg: any = {}) => jsDesign.ui.postMessage({pluginMessage: {type, ...msg}});

async function getDomainDetails(domainName: string) {
    const api = BRANDFETCH_API_PREFIX + 'brands/' + domainName;
    console.log(domainName)
    try {
        const result = await fetch(api, authentication);
        console.log(result);

        if (!result.ok) {
            postRequestError(result.status);
            return
        }

        const data = await result.json();
        console.log(data);
        post('details', {val: data})
         
    } catch(error) {
        console.log(error);
    }
}

async function searchBrand(brandName: string) {
    const api = BRANDFETCH_API_PREFIX + 'search/' + brandName;
    
    try {
        const result = await fetch(api);
        console.log(result);

        if(!result.ok) {
            postRequestError(result.status);
            return
        }
        const data = await result.json();
        console.log(data);
        /**
         * there is two situation for the result.ok === true
         * either its empty or contains something
         */
        
        if(!data.length) {
            postRequestError(Brandfetch_ERROR.NOT_FOUND)
            return;
        }

        post('brands', {val: data})
               
    } catch(error) {
        console.log(error);
    }
}

function postRequestError(errorCode: number): number {
    switch(errorCode) {
        case Brandfetch_ERROR.NOT_FOUND:
            notify('Not Found')
            post('null');
            break;

        case Brandfetch_ERROR.REQUEST_TIMEOUT:
            notify('Request Timeout');
            post('failed');
            break;
        
        case Brandfetch_ERROR.UNAUTHORIZED:
            notify('Authentication Not Provided');
            post('failed');
            break;
        
        case Brandfetch_ERROR.BAD_API_KEY:
            notify('API key invalid');
            post('failed');
            break;

        case Brandfetch_ERROR.LIMIT_EXCEEDED:
            notify('API usage exceeded');
            post('failed');
            break;
        
        default:
            return 0;
    }

    return 1;
}

function notify(msg: string, timeout: number = 3000): void {
    // pop toast notification
    jsDesign.notify(msg, {timeout});
}

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