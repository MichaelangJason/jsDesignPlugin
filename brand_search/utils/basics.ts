export type ZeroStates = {
    default: {
        boxId: string,
        content: string,
    },
    null: {
        boxId: string,
        content: string,
    },
    unstable: {
        boxId: string,
        content: string,
    }

}

export const REQUEST_FREQUENCY = 300;

export const ZERO_STATES : ZeroStates = {
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
}

export function removeZeroState() {
    const pluginContainer = document.getElementById('box')
    const zeroStateBox = document.querySelectorAll(".zeroStateBox")

    if (pluginContainer === null || zeroStateBox.length === 0) return;


    zeroStateBox.forEach((element) => pluginContainer.removeChild(element))
}

// add zero state element with given `state`
export function addZeroState(state: string) {
    // create new zero state element
    const pluginContainer = document.getElementById('box')
    const zeroStateBox = document.createElement('div');
    if (pluginContainer === null || zeroStateBox === null) throw 'adding zero state error'

    zeroStateBox.className = 'zeroStateBox';
    zeroStateBox.id = ZERO_STATES[state as keyof ZeroStates].boxId;
    zeroStateBox.classList.add('flex-parent')
    zeroStateBox.innerHTML = ZERO_STATES[state as keyof ZeroStates].content;
    pluginContainer.appendChild(zeroStateBox);

    if (state === 'unstable') {
        const resetButton : HTMLElement | null = document.querySelector('#unstableButton')
        if (!resetButton) throw 'cannot find reset button'

        resetButton.onclick = () => {
            console.log("trying reset");
            if (!navigator.onLine) return;
            const currInput = document
            .querySelector('input')
            ?.value
            
            sendRequest('search', {val: currInput})
        }
    }
}

export const post = (type: string, msg: {val: any}) => parent.postMessage({pluginMessage: {type, ...msg}}, "*");

export function debounce(callback: any, delay: number) {
    let timeoutId: number;
    // use closure that saves the timeoutId
    return function(...args: any) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => callback(...args), delay)
    }
}

export const sendRequest = debounce(post, REQUEST_FREQUENCY)

export function addDragEvent(img: HTMLElement) {
    img.draggable = true;
    img.ondragstart = (event) => droptStart(event)
    img.ondragend = (event) => dropEnd(event) 
}

function droptStart(event: DragEvent) {
    
}

export function dropEnd(event : DragEvent) {
    const {clientX, clientY, view} = event;
    if (view && view.length === 0) return;

    const filter = /([a-zA-z])+$/i
    const curr : HTMLElement | EventTarget | null = event.currentTarget
    if (!curr) throw 'not dragging anything'

    const imgType = filter.exec(curr.src)[0]
    
    
    const dropMessage = {
        clientX: clientX,
        clientY: clientY,
        
        items: [{type: imgType, data: event.currentTarget.src}],
        dropMetadata: {
            width: parseInt(event.currentTarget.dataset.width),
            height: parseInt(event.currentTarget.dataset.height),
            name: event.currentTarget.dataset.name
        }
    }

    parent.postMessage({pluginDrop: dropMessage}, '*')
}

