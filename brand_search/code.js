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
// API AUTHENTICATION parameters
const API_KEY = "UkCkPSuT/35PjQxi60b7YBzwzfBU12Eycn7zLtflSbM=";
const AUTHENTICATION = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY,
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
    Brandfetch_ERROR[Brandfetch_ERROR["ENDPOINT_REQUEST_TIMEOUT"] = 504] = "ENDPOINT_REQUEST_TIMEOUT";
    Brandfetch_ERROR[Brandfetch_ERROR["INVALID_DOMAIN"] = 422] = "INVALID_DOMAIN";
    Brandfetch_ERROR[Brandfetch_ERROR["LIMIT_EXCEEDED"] = 429] = "LIMIT_EXCEEDED";
    Brandfetch_ERROR[Brandfetch_ERROR["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(Brandfetch_ERROR || (Brandfetch_ERROR = {}));
// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/';
/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    processMsg(msg.type, msg.val);
};
jsDesign.on("drop", (e) => {
    if (e.items.length > 1)
        throw new Error('Cannot create using to imgs');
    const toPost = {
        name: e.dropMetadata.name,
        src: e.items[0].data,
        format: e.items[0].type,
        width: e.dropMetadata.width,
        height: e.dropMetadata.height,
        parent: e.node,
        dropX: e.x,
        dropY: e.y
    };
    fillOrCreate(toPost, 'drop');
    return true;
});
const post = (type, msg = {}) => jsDesign.ui.postMessage({ pluginMessage: Object.assign({ type }, msg) });
function processMsg(type, data) {
    switch (type) {
        case 'search':
            try {
                searchBrand(data);
            }
            catch (error) {
                console.log('searchBrand error: ');
                console.log(error);
            }
            break;
        case 'getDetails':
            try {
                getDomainDetails(data);
            }
            catch (error) {
                console.log('getDetails error: ');
                console.log(error);
            }
            break;
        case 'img':
            try {
                fillOrCreate(data, 'img');
            }
            catch (error) {
                console.log('fillOrCreate img error: ');
                console.log(error);
            }
            break;
        case 'color':
            try {
                fillOrCreate(data, 'color');
            }
            catch (error) {
                console.log('fill color error: ');
                console.log(error);
            }
            break;
        case 'font':
            console.log(data);
            try {
                applyFont(data);
            }
            catch (error) {
                console.log('applyFont error: ');
                console.log(error);
            }
            break;
        case 'listfont':
            try {
                listFont();
            }
            catch (error) {
                console.log('listFont error: ');
                console.log(error);
            }
            break;
        case 'notify':
            notify(data);
            break;
        default:
            return 0;
    }
    return 1;
}
// postRequestError
function postRequestError(errorCode) {
    switch (errorCode) {
        case Brandfetch_ERROR.NOT_FOUND:
            notify('Not Found');
            post('null');
            break;
        case Brandfetch_ERROR.ENDPOINT_REQUEST_TIMEOUT:
        case Brandfetch_ERROR.REQUEST_TIMEOUT:
            notify('Request Timeout');
            post('failed');
            break;
        case Brandfetch_ERROR.UNAUTHORIZED:
            notify('AUTHENTICATION Not Provided');
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
        case Brandfetch_ERROR.INTERNAL_ERROR:
            notify('500 Internal Server Error');
            post('failed');
            break;
        default:
            return 0;
    }
    return 1;
}
// search section
function getDomainDetails(domainName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'brands/' + domainName;
        try {
            const result = yield fetch(api, AUTHENTICATION);
            if (!result.ok) {
                postRequestError(result.status);
                return;
            }
            const data = yield result.json();
            post('details', { val: data });
        }
        catch (error) {
            console.log('Error! ' + error);
            postRequestError(Brandfetch_ERROR.REQUEST_TIMEOUT);
        }
    });
}
function searchBrand(brandName) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = BRANDFETCH_API_PREFIX + 'search/' + brandName;
        try {
            const result = yield fetch(api);
            if (!result.ok) {
                postRequestError(result.status);
                return;
            }
            const data = yield result.json();
            /**
             * there is two situation for the result.ok === true
             * either its empty or contains something
             */
            if (!data.length) {
                postRequestError(Brandfetch_ERROR.NOT_FOUND);
                return;
            }
            post('brands', { val: data });
        }
        catch (error) {
            console.log('searchBrand error: ');
            console.log(error);
        }
    });
}
function fillOrCreate(data, type) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if any node selected
        const selection = jsDesign.currentPage.selection;
        // set width and height of image to create
        const APPENDABLE = ['PAGE', 'FRAME', 'GROUP'];
        if (type === 'color') {
            if (selection.length === 0) {
                notify('you must select a node');
                return;
            }
            if (!('r' in data) || !('g' in data) || !('b' in data))
                throw new Error('Not Filling in a color');
            const fill = {
                type: 'SOLID',
                color: {
                    r: data.r / 255,
                    g: data.g / 255,
                    b: data.b / 255
                }
            };
            selection.forEach((node) => {
                // case where the node does not support fills
                if (!('fills' in node))
                    return;
                // deep copy their fills property
                let fills = clone(node.fills);
                // create new fills option
                fills.push(fill);
                // update to nodes fills
                try {
                    node.fills = fills;
                }
                catch (error) {
                    console.log('fill image error');
                    console.log(error);
                }
            });
            notify('Color Filled');
            return;
        }
        try {
            if ('r' in data || 'g' in data || 'b' in data)
                throw new Error('Color cannot be created');
            const { dropX: dropX = jsDesign.viewport.center.x, dropY: dropY = jsDesign.viewport.center.y } = data;
            const src = data.src;
            /**
             * svg file cannot be filled into any node
             * it must be added as a frameNode
             */
            if (data.format === 'svg') {
                fetch(src)
                    .then(result => result.text())
                    .then(svg => {
                    const svgNode = jsDesign.createNodeFromSvg(svg);
                    svgNode.name = data.name;
                    // set position
                    svgNode.x = (type !== 'drop') ? jsDesign.viewport.center.x - Math.floor(svgNode.width / 2) : dropX - svgNode.width;
                    svgNode.y = (type !== 'drop') ? jsDesign.viewport.center.y - Math.floor(svgNode.height / 2) : dropY;
                    // case if dropped onto some appendable nodes
                    if ('parent' in data && APPENDABLE.includes(data.parent.type))
                        data.parent.appendChild(svgNode);
                    //jsDesign.viewport.zoom = 1;
                    jsDesign.currentPage.selection = [svgNode];
                    //jsDesign.viewport.scrollAndZoomIntoView([svgNode])
                })
                    .catch(error => console.log("svg:" + error));
                if (selection.length > 0)
                    notify('Svg cannot be filled into any node');
                return;
            }
            /**
             * case creating/filling img with format != svg
             */
            jsDesign.createImageAsync(src)
                .then((image) => __awaiter(this, void 0, void 0, function* () {
                const fill = {
                    type: 'IMAGE',
                    scaleMode: 'FILL',
                    imageHash: image.hash,
                };
                if (selection.length === 0 || type === 'drop') {
                    // create node
                    const node = jsDesign.createFrame();
                    // resize the node to match the image's width and height
                    node.resize(data.width, data.height);
                    node.name = data.name;
                    // set the fill property in the node object
                    try {
                        node.fills = [fill];
                    }
                    catch (error) {
                        console.log('fill image error');
                        console.log(error);
                        notify(error.msg);
                        return;
                    }
                    // put the created image at the center of viewport
                    node.x = (type !== 'drop') ? jsDesign.viewport.center.x - (Math.floor(data.width / 2)) : dropX - data.width;
                    node.y = (type !== 'drop') ? jsDesign.viewport.center.y - (Math.floor(data.height / 2)) : dropY;
                    if (type === 'drop' && APPENDABLE.includes(data.parent.type))
                        data.parent.appendChild(node);
                    // select the created node and move to it
                    jsDesign.currentPage.selection = [node];
                    notify('Image Created');
                    return;
                }
                // case filling in node selected
                selection.forEach((node) => {
                    // case where the node does not support fills
                    if (!('fills' in node) || node.type === 'TEXT')
                        return;
                    // deep copy their fills property
                    let fills = clone(node.fills);
                    // create new fills option
                    fills.push(fill);
                    try {
                        node.fills = fills;
                    }
                    catch (error) {
                        console.log('clone error: ');
                        console.log(error);
                    }
                });
                notify('Image Filled');
            }))
                .catch((error) => {
                console.log('createImgAsync error: ');
                console.log(error);
            });
        }
        catch (error) {
            console.log('creating Image error: ');
            console.log(error);
        }
        // create case
    });
}
function applyFont(fontName) {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = jsDesign.currentPage.selection;
        console.log(fontName);
        if (jsDesign.hasMissingFont) {
            notify('There is missing font');
            throw new Error('There is missing font');
        }
        if (selection.length === 0) {
            notify('No node selected');
            return;
        }
        ;
        const jsDesignFontName = {
            family: `${fontName.family}_family`,
            style: `${fontName.family}-${fontName.style}`
        };
        const formattedFontName = {
            family: fontName.family.replace(/\s/g, ''),
            style: fontName.style.replace(/\s/g, '')
        };
        // load font before it 
        const fontList = () => __awaiter(this, void 0, void 0, function* () { return jsDesign.listAvailableFontsAsync(); });
        const loadFont = () => __awaiter(this, void 0, void 0, function* () { return jsDesign.loadFontAsync(fontName); });
        loadFont()
            .then(() => {
            // first need to check if the font is properly loaded into jsDesign
            fontList()
                .then(list => {
                let available = false;
                let noSpace = false;
                // check if font actually available
                for (const font of list) {
                    // font can be found in format of jsDesign official fonts
                    if (font.fontName.family === jsDesignFontName.family && font.fontName.style === jsDesignFontName.style) {
                        available = true;
                        break;
                    }
                    // font can be found in other format, with space between
                    if (font.fontName.family === fontName.family && font.fontName.style === fontName.style) {
                        available = true;
                        break;
                    }
                    // font can be found in other format, without space between
                    if (font.fontName.family === formattedFontName.family && font.fontName.style === formattedFontName.style) {
                        available = true;
                        noSpace = true;
                        break;
                    }
                }
                if (!available) {
                    notify('Font not Available');
                    throw new Error('Font not Available');
                }
                selection.forEach((node) => {
                    if (!(node.type == 'TEXT'))
                        return;
                    // replace fontName of whole textNode
                    node.fontName = noSpace ? formattedFontName : fontName;
                    if (node.hasMissingFont)
                        throw new Error(`${fontName} is missing`);
                });
                console.log('loaded');
                notify(`${fontName.family}-${fontName.style} loaded`);
            })
                .catch(error => console.log(error));
        })
            .catch((error) => console.log(error));
    });
}
// return the current available font in jsDesign
function listFont() {
    return __awaiter(this, void 0, void 0, function* () {
        const fonts = yield jsDesign.listAvailableFontsAsync;
        fonts()
            .then(font => {
            post('list', { val: font });
        })
            .catch(error => {
            console.log(error);
        });
    });
}
// toast notification some msg
function notify(msg = '', timeout = 3000) {
    if (msg === '')
        return;
    // pop toast notification
    jsDesign.notify(msg, { timeout });
}
// utility functino section 
function clone(val) {
    // function retrieved from figma
    // return the deep copy of any val pass in
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw new Error('unknown');
}
function debounce(callback, delay) {
    let timeoutId;
    // use closure that saves the timeoutId
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}
