import { removeZeroState, addZeroState, post, sendRequest, debounce } from "./basics";

const input = document.querySelector('input')

export function displaySearchResults(results: any[]) {
    // check if input empty ()
    if (input && input.value === '') {return}

    // reset the result container
    removeZeroState();
    resetResultContainer();
    
    const container = document.getElementById('resultContainer')
    if (!container) throw 'display result error'

    let number = 1;
    results.forEach((brand) => {
        console.log(brand)
        const newBox = createResultBox(brand);
        newBox.onclick = () => {
            if (!navigator.onLine) {
                post('notify', {val: 'Internet not connected'})
                return;
            }
            post('getDetails', {val: brand.domain})
        }
        if (number === 5) newBox.style.marginBottom = '0px'
        container.appendChild(newBox)
        number++
    })

}

type Result = {
    name: string | null,
    domain: string,
    claimed: boolean,
    icon: string | null
}

export function createResultBox(result: Result) {
    /**
     * results properties:
     * 
     * name: string/null
     * domain: string
     * claimed: boolean(true/false)
     * icon: array(on the api doc), string/null
     */

    // create result box div
    const newBox = document.createElement('div')
    newBox.id = 'resultBox'

    // image with icon
    const iconBox = document.createElement('div')
    iconBox.id = 'resultImg'
    iconBox.classList.add('img-parent')
    const icon = document.createElement('img')
    icon.draggable = false;
    icon.classList.add('img-child')
    if (result.icon !== null) icon.src = result.icon;
    iconBox.appendChild(icon)

    // create info box
    const infoBox = document.createElement('div')
    infoBox.id = 'resultInfo'

    // set brand title
    if (result.name !== null) {
    const title = document.createElement('p')
    title.id = 'resultTitle'
    title.classList.add('text-style')
    
    title.style.width = '162px'

    title.innerHTML = result.name;
    infoBox.appendChild(title)
    }

    // set brand domain
    const domain = document.createElement('p')
    domain.id = 'resultDomain'
    domain.classList.add('text-style')

    domain.style.width = '162px'

    domain.innerHTML = result.domain;
    infoBox.appendChild(domain)
    
    // append them to newBox
    newBox.appendChild(iconBox);
    newBox.appendChild(infoBox);

    return newBox
}

export function resetResultContainer() {
    const box = document.getElementById('box')
    removeResult()
    if (!box) throw 'failed to reset Result Container'

    const container = document.createElement('div')
    container.id = 'resultContainer'
    container.classList.add('flex-parent')
    box.appendChild(container)
}

export function removeResult() {
    const box = document.getElementById('box')
    const container = document.getElementById('resultContainer')
    if (!box || !container) throw 'failed to remove Result Container'

    if (container !== null) box.removeChild(container);
}
