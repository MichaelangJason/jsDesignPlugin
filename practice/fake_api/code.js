"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
});
// API authentication parameters
const authentication = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer hEBPHU9ZzUiwY5WuhHklAZyhOXodkGCPfRxzNOFZ02o=',
        //Credential: 'same-origin',
        Referer: 'https://js.design'
    }
};
var Brandfetch_ERROR;
(function (Brandfetch_ERROR) {
    Brandfetch_ERROR[Brandfetch_ERROR["BAD_REQUEST_BODY"] = 400] = "BAD_REQUEST_BODY";
    Brandfetch_ERROR[Brandfetch_ERROR["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Brandfetch_ERROR[Brandfetch_ERROR["BAD_API_KEY"] = 403] = "BAD_API_KEY";
    Brandfetch_ERROR[Brandfetch_ERROR["NOT_FOUND"] = 404] = "NOT_FOUND";
    Brandfetch_ERROR[Brandfetch_ERROR["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    Brandfetch_ERROR[Brandfetch_ERROR["INVALID_DOMAIN"] = 422] = "INVALID_DOMAIN";
    Brandfetch_ERROR[Brandfetch_ERROR["LIMIT_EXCEEDED"] = 429] = "LIMIT_EXCEEDED";
})(Brandfetch_ERROR || (Brandfetch_ERROR = {}));
// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/';
/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    // searchBrand(msg.val)
    searchBrand(msg.val);
};
const post = (type, msg = {}) => jsDesign.ui.postMessage({ pluginMessage: Object.assign({ type }, msg) });
function fetchWithDomain(domainName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'brands/' + domainName;
        try {
            const result = yield fetch(api, authentication);
            console.log(result);
            if (!result.ok) {
                postRequestError(result.status);
                return;
            }
            const data = yield result.json();
            console.log(data);
            post('success', { val: data });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function searchBrand(brandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'search/' + brandName;
        try {
            const result = yield fetch(api);
            console.log(result);
            if (!result.ok) {
                postRequestError(result.status);
                return;
            }
            const data = yield result.json();
            console.log(data);
            /**
             * there is two situation for the result.ok === true
             * either its empty or contains something
             */
            if (!data.length) {
                postRequestError(Brandfetch_ERROR.NOT_FOUND);
                return;
            }
            post('search result', { val: data });
            // if the result has more than one element, it must have a domain name
            // fetchWithDomain(data[0].domain);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function postRequestError(errorCode) {
    switch (errorCode) {
        case Brandfetch_ERROR.NOT_FOUND:
            notify('Not Found');
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
function notify(msg, timeout = 3000) {
    // pop toast notification
    jsDesign.notify(msg, { timeout });
}
function fakeRetrieve(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = 'https://reqres.in/api/' + arg;
        try {
            const result = yield fetch(api);
            if (!result.ok) {
                console.log("not ok");
                post('failed', {});
            }
            else {
                const data = yield result.json();
                console.log(data);
                post('success', { val: data });
            }
        }
        catch (err) {
            console.log(err);
            post("error", { error: err });
        }
        // console.log(data.data[0])
    });
}
