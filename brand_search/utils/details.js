"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const results_1 = require("./results");
const basics_1 = require("./basics");
let fontList;
function displayBrandDetails(brand) {
    console.log(brand);
    (0, results_1.resetResultContainer)();
    /**
    * brand data properties:
    * name: string/null
    * domain: string
    * claimed: true/false
    * description: string/null
    * links: string (brand links)
    * logos: array (brand logos)
    * colors: array (brand colors)
    * fonts: array (brand fonts)
    * images: array (brand images)
    */
    const box = document.getElementById('box');
    const container = document.getElementById('resultContainer');
    const name = (brand.name !== null) ? brand.name : brand.domain;
    if (box === null || container === null)
        return;
    // create header
    const header = createDetailHeader(brand);
    container.appendChild(header);
    addDivider();
    // create logo section
    const logos = createDetailLogo(brand.logos, name);
    if (logos === undefined)
        throw 'create detail Logo failed';
    container.appendChild(logos);
    addDivider();
    // create color style section
    const colors = createDetailColor(brand.colors);
    if (colors === undefined)
        throw 'create detail Colors failed';
    container.appendChild(colors);
    addDivider();
    // create font style section
    const fonts = createDetailFont(brand.fonts);
    if (fonts === undefined)
        throw 'create detail fonts failed';
    container.appendChild(fonts);
    addDivider();
    // create relted img section
    const imgs = createDetailImg(brand.images, name);
    if (imgs === undefined)
        throw 'create imgs font failed';
    container.appendChild(imgs);
    // create placeholder for bottom padding
    const bottomPad = document.createElement('hr');
    bottomPad.style.height = '4px';
    bottomPad.style.background = 'white';
    container.appendChild(bottomPad);
    box.appendChild(container);
}
function addDivider() {
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer === null)
        return;
    const divider = document.createElement('hr');
    resultContainer.appendChild(divider);
}
function createDetailHeader(brand) {
    // create container
    const container = document.createElement('div');
    container.id = 'detailHeader';
    container.classList.add('flex-parent');
    // create header img container
    const iconContainer = document.createElement('div');
    iconContainer.id = 'detailHeaderImg';
    iconContainer.classList.add('img-parent');
    // append icon if exists
    if (brand.logos.length !== 0) {
        const img = document.createElement('img');
        img.draggable = false;
        img.classList.add('img-child');
        img.src = brand.logos[0].formats[0].src;
        brand.logos.forEach((logo) => {
            if (logo.type === 'logo') {
                img.src = logo.formats[0].src;
            }
        });
        iconContainer.appendChild(img);
    }
    // create header info container
    const infoContainer = document.createElement('div');
    infoContainer.id = 'detailHeaderInfo';
    // create header title
    if (brand.name !== null) {
        const title = document.createElement('p');
        title.id = 'detailHeaderTitle';
        title.innerHTML = brand.name;
        infoContainer.appendChild(title);
    }
    // create header domain
    const domain = document.createElement('p');
    domain.id = 'detailHeaderDomain';
    domain.innerHTML = brand.domain;
    domain.onclick = (event) => {
        // to avoid that it opens within the plugin 
        event.preventDefault();
        window.open(brand.domain, '_blank');
    };
    infoContainer.appendChild(domain);
    // append icon, info to header container
    container.appendChild(iconContainer);
    container.appendChild(infoContainer);
    return container;
}
function createDetailsContainer(title) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    if (details === null || summary === null)
        return;
    summary.innerHTML = title;
    // const para = document.createElement('p')
    // para.innerHTML = 'test'
    // details.append(para)
    details.appendChild(summary);
    return details;
}
function createDetailLogo(logos, name) {
    // input is an array
    console.log('creating Logo');
    console.log(logos);
    const container = createDetailsContainer('LOGO');
    if (container === null || container === undefined)
        return;
    container.open = true;
    if (logos.length === 0)
        return container;
    /**
    * logos properties:
    * type: logo, icon, symbol, other
    * theme: dark, light, null
    * formats: array \--\> this will be used in tertiary page
    */
    const MAX_LOGO_PER_LINE = 2;
    let logoType = {
        icon: [],
        symbol: [],
        logo: [],
    };
    let processedLogos = [];
    // add to each type 
    logos.forEach((logo) => {
        const type = logo.type;
        // impossible to distinguish variant if everything else has type 'other'
        // so they will be processed directly
        if (type === 'other') {
            const logoBox = createLogoBox([logo], name);
            processedLogos.push(logoBox);
        }
        else {
            logoType[type].push(logo);
        }
    });
    // process 有名有姓的 type
    for (const type in logoType) {
        // do not process prototype
        if (!logoType.hasOwnProperty(type) || logoType[type].length === 0)
            continue;
        const logoBox = createLogoBox(logoType[type], name);
        processedLogos.unshift(logoBox);
    }
    const iteration = Math.ceil(processedLogos.length / MAX_LOGO_PER_LINE);
    // create actual containers based on the length of processedLogos
    for (let i = 0; i < iteration; i++) {
        const logosContainer = document.createElement('div');
        logosContainer.id = 'detailLogoContainer';
        // there will be at least one logo to be appended in each iteration
        for (let j = 0; j < MAX_LOGO_PER_LINE; j++) {
            if (processedLogos.length === 0)
                break;
            const curr = processedLogos.shift();
            if (curr === undefined)
                return;
            logosContainer.appendChild(curr);
        }
        container.appendChild(logosContainer);
    }
    return container;
    function createLogoBox(logo, brandname) {
        // takes an array as input
        // use onclick to store the needed information (closure?)
        const oneBox = document.createElement('div');
        oneBox.id = 'detailLogo';
        oneBox.classList.add('img-parent');
        const preview = document.createElement('img');
        preview.draggable = false;
        preview.classList.add('img-child');
        // always use the first entry as the preview
        preview.src = logo[0].formats[0].src;
        logo.forEach((variant) => {
            if (variant.theme === 'dark') {
                preview.src = variant.formats[0].src;
            }
        });
        oneBox.appendChild(preview);
        const hover = document.createElement('p');
        hover.id = 'detailLogoHover';
        hover.classList.add('text-style');
        hover.innerHTML = logo[0].type;
        oneBox.appendChild(hover);
        oneBox.onclick = () => {
            // use closure to store the data
            const variants = logo;
            const layerName = `${brandname}-${variants[0].type}`;
            console.log(variants);
            // display tertiary page
            displayTertiary(variants, layerName);
        };
        return oneBox;
    }
}
function createDetailColor(colors) {
    const container = createDetailsContainer('颜色样式');
    if (container === undefined)
        throw 'Container Unwanted';
    if (colors.length === 0)
        return container;
    /**
    * colors properties:
    * hex: string -> rgb
    * type: accent, dark, light, brand
    * britghtness: integer -> a (0-255)
    */
    const MAX_COLOR_PER_LINE = 5;
    let processedColor = [];
    // turn color into colorBox
    colors.forEach((color) => {
        const rgba = hex2rgb(color.hex);
        if (rgba === null)
            throw 'hex format incorrect';
        rgba.a = color.brightness.toString();
        const colorBox = createColorBox(rgba);
        processedColor.push(colorBox);
    });
    // create
    const iteration = Math.ceil(processedColor.length / MAX_COLOR_PER_LINE);
    for (let i = 0; i < iteration; i++) {
        const colorContainer = document.createElement('div');
        colorContainer.id = 'detailColorContainer';
        for (let j = 0; j < MAX_COLOR_PER_LINE; j++) {
            if (processedColor.length === 0)
                break;
            let oneColor = processedColor.shift();
            if (oneColor === undefined)
                throw 'color incorrect number';
            if (j === MAX_COLOR_PER_LINE - -1)
                oneColor.style.marginRight = '0px';
            colorContainer.appendChild(oneColor);
        }
        container.appendChild(colorContainer);
    }
    return container;
    function hex2rgb(hex) {
        const filter = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        const result = filter.exec(hex);
        return result ? {
            r: parseInt(result[1], 16).toString(),
            g: parseInt(result[2], 16).toString(),
            b: parseInt(result[3], 16).toString(),
            a: '0'
        } : null;
    }
    function createColorBox(color) {
        const colorBox = document.createElement('div');
        colorBox.id = 'detailColor';
        // parse color into rgba expression
        const rgb = `rgb(${color.r},${color.g},${color.b})`;
        colorBox.style.background = rgb;
        colorBox.onclick = () => {
            post('color', { val: [color] });
        };
        return colorBox;
    }
}
function createDetailFont(fonts) {
    const container = createDetailsContainer('字体样式');
    if (!container)
        throw 'failed to create detail font';
    const UNAVAILABLE_COLOR = 'rgb(183, 183, 183)';
    const filter = /^([a-zA-Z\s]+)(?:-(\w+))?$/i;
    if (fonts.length === 0)
        return container;
    /**
    * fonts properties
    * name: string
    * type: title, body
    * origin: google, custom, system, null
    * originId: string, null
    */
    fonts.forEach(font => {
        try {
            const fontBox = createFontBox(font);
            container.appendChild(fontBox);
        }
        catch (error) {
            console.log(error);
        }
    });
    return container;
    function createFontBox(oneFont) {
        // fontName format
        const fontStyle = filter.exec(oneFont.name);
        if (fontStyle === null)
            throw 'font name invalid';
        const fontName = {
            family: (fontStyle[1] !== undefined) ? fontStyle[1] : fontStyle[0],
            style: (fontStyle[2] !== undefined) ? fontStyle[2] : 'Regular'
        };
        // availability
        const available = fontAvailable(fontName);
        const fontBox = document.createElement('div');
        fontBox.id = 'resultBox';
        fontBox.style.marginBottom = '0px';
        fontBox.style.marginTop = '8px';
        const preview = document.createElement('div');
        preview.id = 'resultImg';
        // create preview
        const previewText = document.createElement('p');
        previewText.classList.add('text-style');
        previewText.innerHTML = 'Aa';
        previewText.style.fontFamily = oneFont.name;
        // create info container
        const fontInfo = document.createElement('div');
        fontInfo.id = 'resultInfo';
        // create font type title
        const fontType = document.createElement('div');
        fontType.id = 'resultTitle';
        fontType.innerHTML = oneFont.type;
        // create font family description
        const fontFamily = document.createElement('div');
        fontFamily.id = 'resultDomain';
        fontFamily.innerHTML = oneFont.name;
        fontFamily.style.color = 'rgba(32, 32, 32, 0.6)';
        if (available) {
            fontBox.onclick = () => post('font', { val: oneFont });
        }
        else {
            fontType.style.color = UNAVAILABLE_COLOR;
            fontFamily.style.color = UNAVAILABLE_COLOR;
            previewText.classList.add('strikethrough');
            previewText.style.color = UNAVAILABLE_COLOR;
            previewText.style.fontFamily = 'Inter';
            fontBox.onclick = () => {
                updateFontList();
                if (fontAvailable(fontName)) {
                    post('font', { val: oneFont });
                }
                post('notify', { val: 'font unavailable' });
            };
        }
        preview.appendChild(previewText);
        fontInfo.appendChild(fontType);
        fontInfo.appendChild(fontFamily);
        fontBox.appendChild(preview);
        fontBox.appendChild(fontInfo);
        return fontBox;
    }
}
function createDetailImg(imgs, name) {
    const container = createDetailsContainer('相关图片');
    if (!container)
        throw 'error creating detail img';
    if (imgs.length === 0)
        return container;
    /**
    * imgs properties:
    * type: banner, other
    * formats: array
    * formats.src: string: png, svg, jpeg
    * formats.(style: height, width, size, background)
    */
    const MAX_IMG_PER_LINE = 2;
    let processedImgs = [];
    imgs.forEach((img) => {
        const imgBox = createImgBox(img, name);
        processedImgs.push(imgBox);
    });
    const iteration = Math.ceil(processedImgs.length / MAX_IMG_PER_LINE);
    // create actual containers based on the length of processedImgs
    for (let i = 0; i < iteration; i++) {
        const imgContainer = document.createElement('div');
        imgContainer.id = 'detailLogoContainer';
        for (let j = 0; j < MAX_IMG_PER_LINE; j++) {
            if (processedImgs.length === 0)
                break;
            const curr = processedImgs.shift();
            if (!curr)
                throw 'failed creating img';
            imgContainer.appendChild(curr);
        }
        container.appendChild(imgContainer);
    }
    return container;
    function createImgBox(img, brandname) {
        const oneBox = document.createElement('div');
        oneBox.id = 'detailLogo';
        oneBox.classList.add('img-parent');
        const layerName = `${brandname}-${img.type}-${img.formats[0].format}`;
        const preview = document.createElement('img');
        preview.classList.add('img-child');
        preview.src = img.formats[0].src;
        preview.dataset.width = img.formats[0].width;
        preview.dataset.height = img.formats[0].height;
        preview.dataset.name = layerName;
        (0, basics_1.addDragEvent)(preview);
        oneBox.appendChild(preview);
        const hover = document.createElement('p');
        hover.id = 'detailLogoHover';
        hover.classList.add('text-style');
        hover.innerHTML = img.type;
        oneBox.appendChild(hover);
        oneBox.onclick = () => {
            const variant = img.formats;
            console.log(img);
            /**
            * variant is an array that contains diff formats
            * formats properties:
            * format: format
            * src: string
            * width: integer
            * height: integer
            */
            const toPost = {
                name: layerName,
                format: variant[0].format,
                src: variant[0].src,
                width: variant[0].width,
                height: variant[0].height,
            };
            console.log(variant);
            post('img', { val: [toPost] });
        };
        return oneBox;
    }
}
// tertiary page
function displayTertiary(variants, name) {
    // store the previous page and reset the container
    const result = document.getElementById('resultContainer');
    const box = document.getElementById('box');
    (0, results_1.resetResultContainer)();
    const container = document.getElementById('resultContainer');
    if (!result || !box || !container)
        throw 'failed to display tertiary page';
    /**
    * create return bar
    *
    *
    */
    const returnBar = document.createElement('div');
    returnBar.id = 'returnBar';
    returnBar.className = 'flex-parent';
    // create return arrow
    const returnIcon = document.createElement('img');
    returnIcon.id = 'returnIcon';
    returnIcon.src = 'assets/arrow.svg';
    // create return button
    const returnButton = document.createElement('p');
    returnButton.innerHTML = '返回';
    returnButton.id = 'returnButton';
    returnButton.className = 'text-style';
    returnBar.appendChild(returnIcon);
    returnBar.appendChild(returnButton);
    returnBar.onclick = () => {
        (0, results_1.removeResult)();
        box.appendChild(result);
    };
    container.appendChild(returnBar);
    addDivider();
    // create onclick
    let order = 0;
    variants.forEach((variant) => {
        const variantBox = createVariantBox(variant, order, name);
        container.appendChild(variantBox);
        order++;
    });
    const bottomPad = document.createElement('hr');
    bottomPad.style.height = '4px';
    bottomPad.style.background = 'white';
    container.appendChild(bottomPad);
    box.appendChild(container);
    /**
    * create boxes
    *
    *
    */
    function createVariantBox(logo, order, brandname) {
        /**
        * logo properties:
        * formats: array
        *   formats.src: string
        *   formats.format: svg,png,jpeg?
        *   size: number
        * theme: light, dark, null
        * type: string
        */
        const variantContainer = document.createElement('div');
        variantContainer.id = 'tertiaryBox';
        variantContainer.className = 'img-parent';
        const tertiaryOption = document.createElement('div');
        tertiaryOption.id = 'tertiaryOption';
        tertiaryOption.className = 'flex-parent';
        const option = document.createElement('p');
        option.className = 'text-style';
        option.innerHTML = logo.formats[0].format.toUpperCase();
        tertiaryOption.appendChild(option);
        const nameWithTheme = brandname + (logo.theme === null ? '' : `-${logo.theme}`);
        if (logo.formats.length > 1) {
            const arrow = document.createElement('img');
            arrow.src = 'assest/whitearrow.svg';
            tertiaryOption.appendChild(arrow);
            tertiaryOption.style.paddingRight = '4px';
            tertiaryOption.onclick = () => {
                var _a, _b, _c, _d;
                // create selection pannel
                const availableFormat = logo.formats;
                const formatSelect = createFormatSelect(availableFormat, order, nameWithTheme);
                const currVariant = document.querySelectorAll('#tertiaryBox')[order];
                const selectExist = currVariant.querySelector('#formatSelect');
                if (selectExist !== null) {
                    currVariant.removeChild(selectExist);
                    return;
                }
                // make the correct format checked
                const currFormat = (_b = (_a = currVariant === null || currVariant === void 0 ? void 0 : currVariant.querySelector('#tertiaryOption')) === null || _a === void 0 ? void 0 : _a.querySelector('p')) === null || _b === void 0 ? void 0 : _b.innerHTML;
                for (let i = 0; i < formatSelect.children.length; i++) {
                    if (((_d = (_c = formatSelect === null || formatSelect === void 0 ? void 0 : formatSelect.children[i]) === null || _c === void 0 ? void 0 : _c.querySelector('p')) === null || _d === void 0 ? void 0 : _d.innerHTML) === currFormat) {
                        formatSelect
                            .children[i]
                            .querySelector('img')
                            .style
                            .visibility = 'visible';
                    }
                }
                // append it to the correct tertiarybox
                currVariant.appendChild(formatSelect);
            };
        }
        variantContainer.appendChild(tertiaryOption);
        const preview = document.createElement('img');
        preview.src = logo.formats[0].src;
        preview.className = 'img-child';
        (0, basics_1.addDragEvent)(preview);
        // width and height are stored within one of the format
        let width = 100, height = 100;
        logo.formats.forEach((formats) => {
            if ('width' in formats && 'height' in formats) {
                width = formats.width;
                height = formats.height;
            }
        });
        preview.onclick = () => {
            formatsLen = logo.formats.length;
            const currVariant = document
                .querySelectorAll('#tertiaryBox')[order];
            const selection = currVariant
                .querySelector('#tertiaryOption')
                .querySelector('p')
                .innerHTML.toLowerCase();
            // still need to go through this since width and height are not defined in all formats
            logo.formats.forEach((formats) => {
                if (formats.format === selection) {
                    const toPost = {
                        name: `${nameWithTheme}-${selection}`,
                        src: formats.src,
                        format: formats.format,
                        width: width,
                        height: height
                    };
                    post('img', { val: [toPost] });
                }
            });
        };
        preview.dataset.width = width;
        preview.dataset.height = height;
        preview.dataset.name = `${nameWithTheme}-${logo.formats[0].format}`;
        variantContainer.appendChild(preview);
        // create hover effect
        preview.onmouseover = () => {
            variantContainer.style.background = 'rgb(242, 242, 242)';
        };
        preview.onmouseout = () => {
            variantContainer.style.background = 'rgb(247, 247, 247)';
        };
        return variantContainer;
    }
    function createFormatSelect(formats, order, prefix) {
        /**
        * formats: array
        *   formats.src: string (img url)
        *   formats.format: string (png, jpeg, svg...)
        */
        // create proper format select
        const formatSelect = document.createElement('div');
        formatSelect.id = 'formatSelect';
        formats.forEach((format) => {
            // create single option
            const formatOption = document.createElement('div');
            formatOption.id = 'formatOption';
            formatOption.className = 'flex-parent';
            // create option check
            const arrow = document.createElement('img');
            arrow.src = 'assets/check.svg';
            arrow.style.visibility = 'hidden';
            // create format name
            const formatName = document.createElement('p');
            formatName.innerHTML = format.format.toUpperCase();
            // append them to formatOption
            formatOption.appendChild(arrow);
            formatOption.appendChild(formatName);
            // create onclick
            formatOption.onclick = () => {
                // change the format text and the src within one tertiary option
                const toOption = format.format;
                const toSrc = format.src;
                // get the correct variant
                const parentVariant = document.querySelectorAll('#tertiaryBox')[order];
                // modify the preview within the variant
                const currPreview = parentVariant.querySelector('img.img-child');
                if (!currPreview)
                    throw '';
                currPreview.dataset.name = `${prefix}-${toOption}`;
                currPreview.src = toSrc;
                // get the optionbox within the variant
                const parentOption = parentVariant.querySelector('#tertiaryOption');
                // modifiy the actual format
                const currOption = parentOption === null || parentOption === void 0 ? void 0 : parentOption.querySelector('p');
                if (!currOption)
                    throw 'currOption DNE';
                currOption.className = 'text-style';
                currOption.innerHTML = toOption.toUpperCase();
                const toDestroy = parentVariant.querySelector('#formatSelect');
                if (!toDestroy)
                    throw 'no selection exists';
                parentVariant === null || parentVariant === void 0 ? void 0 : parentVariant.removeChild(toDestroy);
            };
            // append it to formatSelect
            formatSelect.appendChild(formatOption);
        });
        return formatSelect;
    }
}
function updateFontList() {
    post('listfont');
}
// check if font available
function fontAvailable(fontName) {
    /*
    * fontName properties:
    * family: string
    * style: string
    */
    const formattedFontName = {
        family: `${fontName.family}_family`,
        style: `${fontName.family}-${fontName.style}`
    };
    for (let i = 0; i < fontList.length; i++) {
        if (fontList[i].fontName.family === formattedFontName.family && fontList[i].fontName.style === formattedFontName.style) {
            console.log(fontList[i]);
            return true;
        }
    }
    return false;
}
// remove zero state element (all of them if there exists more than one)
