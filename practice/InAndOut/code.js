"use strict";
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
});
// actual function
jsDesign.ui.onmessage = (msg) => {
    /**
     * the "main" function receives a structured input from parent.postMessage located in ui.html
     */
    // console.log(msg.type)
    // console.log(msg.val)
    // console.log(typeof msg.val == "string")
    if (msg.type === "exit") {
        jsDesign.closePlugin();
    }
    if (msg.type === "string") {
        const text = jsDesign.createText();
        text.characters = msg.val.toString();
        console.log(text.characters);
        createBox(text, blackBox);
    }
    if (msg.type === "number") {
        const text = jsDesign.createText();
        text.characters = (Math.pow(msg.val, 2)).toString();
        createBox(text, whiteBox);
    }
};
function createBox(arg, colorBox) {
    colorBox(arg);
}
// both whiteBox and blackBox creates a FrameNode as parent node
function whiteBox(arg) {
    // create a FrameNode
    const boxParent = jsDesign.createFrame();
    // create a rectangle box
    const box = jsDesign.createRectangle();
    // set position
    box.x = 0;
    box.y = 0;
    // set TextNode position, same as box
    arg.x = 50;
    arg.y = 50;
    // set weight and height
    box.fills = [{ type: 'SOLID', color: { b: 0.5019607843137255,
                g: 0.29411764705882354,
                r: 0.11372549019607843 }, opacity: 0.53 }];
    boxParent.appendChild(box);
    boxParent.appendChild(arg);
    // center the created box
    jsDesign.viewport.scrollAndZoomIntoView([box]);
}
function blackBox(arg) {
    // create a FrameNode
    const boxParent = jsDesign.createFrame();
    // create a Ellipse/round box
    const box = jsDesign.createEllipse();
    // set position
    box.x = 0;
    box.y = 0;
    // set weight and height
    box.fills = [{ type: 'SOLID', color: { r: 0.08627450980392157, g: 0.4, b: 0.3803921568627451 }, opacity: 0.53 }];
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
