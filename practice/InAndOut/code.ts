// practice#1
/**
 * a white page that only contains a single <input> box
 * it accepts only inputs of string and integer
 * - integer input --> display its square above
 * - string input --> returns its inverse
 */

// open GUI in "ui.html"
jsDesign.showUI(__html__, {
    width: 200,
    height: 200,
})

// actual function
jsDesign.ui.onmessage = (msg) => {
    /**
     * the "main" function receives a structured input from parent.postMessage located in ui.html
     */
    if (msg.type === "exit") {
        jsDesign.closePlugin();
    }
    if (msg.type === "string") {
        const text = jsDesign.createText();
        text.characters = msg.val;
        createBox(text, blackBox);
    }
    if (msg.type === "number") {
        const text = jsDesign.createText();
        text.characters = (msg.val ** 2).toString();
        createBox(text, whiteBox);
    }
}

type BoxColor = (arg: TextNode) => void;

function createBox(arg: TextNode, colorBox: BoxColor) {
    const newBox = colorBox(arg);
}

// both whiteBox and blackBox creates a FrameNode as parent node

function whiteBox(arg: TextNode) {
    // create a FrameNode
    const boxParent = jsDesign.createFrame();
    // create a rectangle box
    const box = jsDesign.createRectangle();
    // set position
    box.x = 50;
    box.y = 50;
    // set TextNode position, same as box
    arg.x = 50;
    arg.y = 50;

    // set weight and height
    box.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];

    boxParent.appendChild(box);
    boxParent.appendChild(arg);
    
    // center the created box
    jsDesign.viewport.scrollAndZoomIntoView([box]);
} 

function blackBox(arg: TextNode) {
    // create a FrameNode
    const boxParent = jsDesign.createFrame();
    // create a Ellipse/round box
    const box = jsDesign.createEllipse();
    // set position
    box.x = 50;
    box.y = 50;
    // set weight and height
    box.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
    // set starting, ending angle, and inner radius
    box.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0 };

    // set TextNode position, same as box
    arg.x = 50;
    arg.y = 50;

    // arg locates above box since appendChild always
    // adds new child at the front of the children array
    boxParent.appendChild(box);
    boxParent.appendChild(arg);

    // center the created box
    jsDesign.viewport.scrollAndZoomIntoView([box]);
}