"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropEnd = exports.addDragEvent = exports.sendRequest = exports.debounce = exports.post = exports.addZeroState = exports.removeZeroState = exports.ZERO_STATES = exports.REQUEST_FREQUENCY = void 0;
exports.REQUEST_FREQUENCY = 300;
exports.ZERO_STATES = {
    default: {
        boxId: 'zeroStateDefaultBox',
        content: '<img src="assets/default.svg" id="defaultImg" alt=""><p id="defaultText" class="text-style">输入品牌名称或网址链接</p>'
    },
    null: {
        boxId: 'zeroStateNullBox',
        content: '<img src="assets/null.svg" id="nullImg" alt=""><p id="nullText1" class="text-style">暂无结果</p><p id="nullText2" class="text-style" style="vertical-align: center">输入网址链接试试</p>'
    },
    unstable: {
        boxId: 'zeroStateUnstableBox',
        content: '<img src="assets/unstable.svg" id="unstableImg" alt=""><p id="unstableText" class="text-style">网络连接不稳定，请重试</p><p id="unstableButton" class="text-style">刷新</p>'
    }
};
function removeZeroState() {
    const pluginContainer = document.getElementById('box');
    const zeroStateBox = document.querySelectorAll(".zeroStateBox");
    if (pluginContainer === null || zeroStateBox.length === 0)
        return;
    zeroStateBox.forEach((element) => pluginContainer.removeChild(element));
}
exports.removeZeroState = removeZeroState;
// add zero state element with given `state`
function addZeroState(state) {
    // create new zero state element
    const pluginContainer = document.getElementById('box');
    const zeroStateBox = document.createElement('div');
    if (pluginContainer === null || zeroStateBox === null)
        throw 'adding zero state error';
    zeroStateBox.className = 'zeroStateBox';
    zeroStateBox.id = exports.ZERO_STATES[state].boxId;
    zeroStateBox.classList.add('flex-parent');
    zeroStateBox.innerHTML = exports.ZERO_STATES[state].content;
    pluginContainer.appendChild(zeroStateBox);
    if (state === 'unstable') {
        const resetButton = document.querySelector('#unstableButton');
        if (!resetButton)
            throw 'cannot find reset button';
        resetButton.onclick = () => {
            var _a;
            console.log("trying reset");
            if (!navigator.onLine)
                return;
            const currInput = (_a = document
                .querySelector('input')) === null || _a === void 0 ? void 0 : _a.value;
            (0, exports.sendRequest)('search', { val: currInput });
        };
    }
}
exports.addZeroState = addZeroState;
const post = (type, msg) => parent.postMessage({ pluginMessage: Object.assign({ type }, msg) }, "*");
exports.post = post;
function debounce(callback, delay) {
    let timeoutId;
    // use closure that saves the timeoutId
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}
exports.debounce = debounce;
exports.sendRequest = debounce(exports.post, exports.REQUEST_FREQUENCY);
function addDragEvent(img) {
    img.draggable = true;
    img.ondragstart = (event) => droptStart(event);
    img.ondragend = (event) => dropEnd(event);
}
exports.addDragEvent = addDragEvent;
function droptStart(event) {
}
function dropEnd(event) {
    const { clientX, clientY, view } = event;
    if (view && view.length === 0)
        return;
    const filter = /([a-zA-z])+$/i;
    const curr = event.currentTarget;
    if (!curr)
        throw 'not dragging anything';
    const imgType = filter.exec(curr.src)[0];
    const dropMessage = {
        clientX: clientX,
        clientY: clientY,
        items: [{ type: imgType, data: event.currentTarget.src }],
        dropMetadata: {
            width: parseInt(event.currentTarget.dataset.width),
            height: parseInt(event.currentTarget.dataset.height),
            name: event.currentTarget.dataset.name
        }
    };
    parent.postMessage({ pluginDrop: dropMessage }, '*');
}
exports.dropEnd = dropEnd;
