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
const AUTHENTICATION = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer hEBPHU9ZzUiwY5WuhHklAZyhOXodkGCPfRxzNOFZ02o=',
        //Credential: 'omit',
        Referer: 'https://js.design'
    }
};
// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/';
/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    fakeRetrieve(msg.val);
};
const post = (type, msg = {}) => jsDesign.ui.postMessage({ pluginMessage: Object.assign({ type }, msg) });
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
function fetchWithDomainName(domainName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'brands' + domainName;
        try {
            const result = yield fetch(api);
            if (!result.ok) {
            }
            else {
                const data = yield result.json();
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function searchBrandDomain(brandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'search' + brandName;
        try {
            const result = yield fetch(api);
            const data = yield result.json();
        }
        catch (error) {
            console.log(error);
        }
    });
}
