
jsDesign.showUI(__html__, {
    width: 260,
    height: 393,
})



// API AUTHENTICATION parameters
const API_KEY = "UkCkPSuT/35PjQxi60b7YBzwzfBU12Eycn7zLtflSbM="
const AUTHENTICATION = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY,
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
    ENDPOINT_REQUEST_TIMEOUT = 504,
    INVALID_DOMAIN = 422,
    LIMIT_EXCEEDED = 429,
    INTERNAL_ERROR = 500,
}

// API prefix
const BRANDFETCH_API_PREFIX = 'https://api.brandfetch.io/v2/'

/**
 * this function only process API request based on user input
 * any webpage changes are made in GUI file
 */
jsDesign.ui.onmessage = (msg) => {
    // user input assume to have none empty string value
    processMsg(msg.type, msg.val);
}

jsDesign.on("drop", (e) => {
    if (e.items.length > 1) throw new Error('Cannot create using to imgs');

    const toPost : FillCreate = {
        name: e.dropMetadata.name,
        src: e.items[0].data,
        format: e.items[0].type,
        width: e.dropMetadata.width,
        height: e.dropMetadata.height,
        parent: e.node,
        dropX: e.x,
        dropY: e.y
    }

    fillOrCreate(toPost, 'drop')

    return true
})

const post = (type: string, msg: any = {}) => jsDesign.ui.postMessage({pluginMessage: {type, ...msg}});

function processMsg(type: string, data: any) : number {

    switch(type) {
        case 'search':
            try {searchBrand(data)}
            catch(error) {
                console.log('searchBrand error: ')
                console.log(error)
            }
            break;
            
        case 'getDetails':
            try {getDomainDetails(data)}
            catch(error) {
                console.log('getDetails error: ')
                console.log(error)
            }
            break;

        case 'img':
            try {fillOrCreate(data, 'img')}
            catch(error) {
                console.log('fillOrCreate img error: ')
                console.log(error)
            }
            break;

        case 'color':
            try {fillOrCreate(data, 'color')}
            catch(error) {
                console.log('fill color error: ')
                console.log(error)
            }
            break;

        case 'font':
            console.log(data)
            try {applyFont(data)}
            catch(error) {
                console.log('applyFont error: ')
                console.log(error)
            }
            break;

        case 'listfont':
            try {listFont()}
            catch(error) {
                console.log('listFont error: ')
                console.log(error)
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
function postRequestError(errorCode: number): number {
    switch(errorCode) {
        case Brandfetch_ERROR.NOT_FOUND:
            notify('Not Found')
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
            notify('500 Internal Server Error')
            post('failed');
            break;
        default:
            return 0;
    }

    return 1;
}


// search section
async function getDomainDetails(domainName: string) {
    const api = BRANDFETCH_API_PREFIX + 'brands/' + domainName;
    
    try {
        const result = await fetch(api, AUTHENTICATION);

        if (!result.ok) {
            postRequestError(result.status);
            return
        }

        const data = await result.json();
        post('details', {val: data})
         
    } catch(error) {
        console.log('Error! '+ error);
        postRequestError(Brandfetch_ERROR.REQUEST_TIMEOUT)
    }
}

async function searchBrand(brandName: string) {
    const api = BRANDFETCH_API_PREFIX + 'search/' + brandName;
    
    try {
        const result = await fetch(api);

        if(!result.ok) {
            postRequestError(result.status);
            return
        }
        const data = await result.json();
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
        console.log('searchBrand error: ')
        console.log(error);
    }
}


// interaction section

type FillCreate = {
    name : string,
    src : string,
    format : string,
    width : number,
    height : number,
    parent ?: BaseNode | SceneNode,
    dropX ?: number,
    dropY ?: number,
}

async function fillOrCreate(data: FillCreate | RGB, type: string) {
    // check if any node selected
    const selection = jsDesign.currentPage.selection
    // set width and height of image to create
    const APPENDABLE = ['PAGE', 'FRAME', 'GROUP']

    if (type === 'color') {

        if (selection.length === 0) {
            notify('you must select a node')
            return
        }
        
        if (!('r' in data) || !('g' in data) || !('b' in data)) throw new Error('Not Filling in a color')

        const fill: Paint = {
            type: 'SOLID',
            color: {
                r: data.r/255,
                g: data.g/255,
                b: data.b/255
            }
        }

        selection.forEach((node: SceneNode) => {
            // case where the node does not support fills
            if (!('fills' in node)) return;

            // deep copy their fills property
            let fills : Paint[] = clone(node.fills)
            
            // create new fills option
            fills.push(fill)

            // update to nodes fills
            try {node.fills = fills}
            catch (error) {
                console.log('fill image error')
                console.log(error)
            }
        })

        notify('Color Filled')
        return;
    }

    try {
        if ('r' in data || 'g' in data || 'b' in data) throw new Error('Color cannot be created')
        const {dropX : dropX = jsDesign.viewport.center.x, dropY : dropY = jsDesign.viewport.center.y} = data
        const src = data.src

        /**
         * svg file cannot be filled into any node
         * it must be added as a frameNode
         */
        if (data.format === 'svg') {

            fetch(src)
            .then(result => result.text())
            .then(svg => {
            
                const svgNode = jsDesign.createNodeFromSvg(svg)
                svgNode.name = data.name

                // set position
                svgNode.x = (type !== 'drop') ? jsDesign.viewport.center.x - Math.floor(svgNode.width/2) : dropX - svgNode.width
                svgNode.y = (type !== 'drop') ? jsDesign.viewport.center.y - Math.floor(svgNode.height/2) : dropY

                // case if dropped onto some appendable nodes
                if ('parent' in data && APPENDABLE.includes(data.parent.type)) data.parent.appendChild(svgNode)
        
                //jsDesign.viewport.zoom = 1;
                jsDesign.currentPage.selection = [svgNode]
                //jsDesign.viewport.scrollAndZoomIntoView([svgNode])

            })
            .catch(error => console.log("svg:" + error))
            
            if (selection.length > 0) notify('Svg cannot be filled into any node')

            return;
        }


        /**
         * case creating/filling img with format != svg
         */

        jsDesign.createImageAsync(src)
        .then(async (image: Image) => {
            const fill: Paint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: image.hash,
            }

            if (selection.length === 0 || type === 'drop') {
                // create node
                const node = jsDesign.createFrame()
                // resize the node to match the image's width and height
                node.resize(data.width, data.height)

                node.name = data.name

                // set the fill property in the node object
                try {node.fills = [fill]}
                catch(error) {
                    console.log('fill image error')
                    console.log(error)
                    notify(error.msg)
                    return
                }
                

                // put the created image at the center of viewport
                node.x = (type !== 'drop') ? jsDesign.viewport.center.x - (Math.floor(data.width / 2)) : dropX - data.width
                node.y = (type !== 'drop') ? jsDesign.viewport.center.y - (Math.floor(data.height / 2)) : dropY

                if (type === 'drop' && APPENDABLE.includes(data.parent.type)) data.parent.appendChild(node)

                // select the created node and move to it
                jsDesign.currentPage.selection = [node]
                
                notify('Image Created')
                return;
            }

            // case filling in node selected
            selection.forEach((node) => {
                // case where the node does not support fills
                if (!('fills' in node) || node.type === 'TEXT') return;

                // deep copy their fills property
                let fills = clone(node.fills)
                
                // create new fills option
                fills.push(fill)
                try {node.fills = fills;}
                catch(error) {
                    console.log('clone error: ')
                    console.log(error)
                }
            })
            notify('Image Filled')
        })
        .catch((error) => {
            console.log('createImgAsync error: ')
            console.log(error)
        })
    }
    catch(error) {
        console.log('creating Image error: ')
        console.log(error)
    }
    // create case
}

async function applyFont(fontName: FontName) {
    const selection = jsDesign.currentPage.selection
    console.log(fontName)

    if (jsDesign.hasMissingFont) {
        notify('There is missing font')
        throw new Error('There is missing font')
    }

    if (selection.length === 0) {
        notify('No node selected')
        return
    };

    const jsDesignFontName : FontName = {
        family: `${fontName.family}_family`,
        style: `${fontName.family}-${fontName.style}`
    }

    const formattedFontName: FontName = {
        family: fontName.family.replace(/\s/g, ''),
        style: fontName.style.replace(/\s/g, '')
    }



    // load font before it 
    const fontList = async () => jsDesign.listAvailableFontsAsync()
    const loadFont = async () => jsDesign.loadFontAsync(fontName)

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
                notify('Font not Available')
                throw new Error('Font not Available')
            }

            selection.forEach((node: SceneNode) => {
                if (!(node.type == 'TEXT')) return;

                // replace fontName of whole textNode

                node.fontName = noSpace ? formattedFontName : fontName
    
                if (node.hasMissingFont) throw new Error(`${fontName} is missing`)
            })
            
            console.log('loaded')
            notify(`${fontName.family}-${fontName.style} loaded`)

        })
        .catch(error => console.log(error))

        
    })
    .catch((error) => console.log(error))

}

// return the current available font in jsDesign
async function listFont() {
    const fonts = await jsDesign.listAvailableFontsAsync

    fonts()
    .then(font => {
        post('list', {val: font})
    })
    .catch(error => {
        console.log(error)
    })

}

// toast notification some msg
function notify(msg: string = '', timeout: number = 3000): void {
    if (msg === '') return
    // pop toast notification
    jsDesign.notify(msg, {timeout});
}

// utility functino section 
function clone(val: any) : any {
   // function retrieved from figma
   // return the deep copy of any val pass in
   const type = typeof val
    if (val === null) {
        return null
    } else if (type === 'undefined' || type === 'number' ||
                type === 'string' || type === 'boolean') {
        return val
    } else if (type === 'object') {
        if (val instanceof Array) {
        return val.map(x => clone(x))
        } else if (val instanceof Uint8Array) {
        return new Uint8Array(val)
        } else {
        let o : any = {}
        for (const key in val) {
            o[key] = clone(val[key])
        }
        return o
        }
    }
    throw new Error('unknown')
}

function debounce(callback: any, delay: number) {
    let timeoutId: number;
    // use closure that saves the timeoutId
    return function(...args: any) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback(...args), delay)
    }
}