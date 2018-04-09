const SCROLLABLE_CLASSNAME = 'sl--scrollable';
const FILLGAP_CLASSNAME = 'sl--fillgap';
const PREVENT_SCROLL_DATASET = 'slPrevented';
const DELTA_DATASET = 'slDelta';
const FILLGAP_AVAILABLE_METHODS = ['padding', 'margin', 'width'];

let _state = true;
let _fillGapMethod = FILLGAP_AVAILABLE_METHODS[0];
let _fillGapSelectors = ['body', `.${FILLGAP_CLASSNAME}`];

const generateSelector = (selectors) => {
	return selectors.join(', ');
};

const eachNode = (nodeList, callback) => {
	for (let i = 0; i < nodeList.length; i++) {
		callback(nodeList[i]);
	}
};

const findTarget = (e) => {
	let target = e.target;
	while (target !== null) {
		if (target.classList && target.classList.contains(SCROLLABLE_CLASSNAME)) {
			break;
		}
		target = target.parentNode;
	}
	return target;
};

const throwError = (message) => {
	console.error(`[scroll-lock] ${message}`);
};

const touchstartEventHandler = (e, scrollLock) => {
	const target = findTarget(e);
	if (target) {
		const scrollTop = target.scrollTop;
		const totalScroll = target.scrollHeight;
		const height = target.clientHeight;
		target.dataset[DELTA_DATASET] = e.touches[0].clientY;

		if (height === totalScroll) {
			target.dataset[PREVENT_SCROLL_DATASET] = 'true';
		}
	}
};

const touchmoveEventHandler = (e, scrollLock) => {
	if (!scrollLock.getState()) {
		const target = findTarget(e);
		if (target) {
			if (target.dataset[PREVENT_SCROLL_DATASET] === 'true') {
				e.preventDefault();
			} else {
				const scrollTop = target.scrollTop;
				const totalScroll = target.scrollHeight;
				const currentScroll = scrollTop + target.offsetHeight;
				const delta = parseFloat(target.dataset[DELTA_DATASET]);
				const currentDelta = e.touches[0].clientY;

				if (scrollTop <= 0) {
					if (delta < currentDelta) {
						e.preventDefault();
					}
				} else if (currentScroll >= totalScroll) {
					if (delta > currentDelta) {
						e.preventDefault();
					}
				}
			}
		} else {
			e.preventDefault();
		}
	}
};

const touchendEventHandler = (e, scrollLock) => {
	const target = findTarget(e);
	if (target) {
		target.dataset[PREVENT_SCROLL_DATASET] = 'false';
	}
};

const bindEvents = (scrollLock) => {
	document.addEventListener('touchstart', (e) => touchstartEventHandler(e, scrollLock));
	document.addEventListener('touchmove', (e) => touchmoveEventHandler(e, scrollLock));
	document.addEventListener('touchend', (e) => touchendEventHandler(e, scrollLock));
};

class ScrollLock {
	constructor() {
		bindEvents(this);
	}

	getState() {
		return _state;
	}

	hide() {
		this._fillGaps();
		document.body.style.overflow = 'hidden';
		_state = false;

		return this;
	}

	show() {
		document.body.style.overflow = '';
		this._unfillGaps();
		_state = true;

		return this;
	}

	toggle() {
		if (this.getState()) {
			this.hide();
		} else {
			this.show();
		}

		return this;
	}

	getWidth() {
		const overflowCurrentProperty = document.body.style.overflow;
		let width = 0;
		document.body.style.overflow = 'scroll';
		width = this.getCurrentWidth();
		document.body.style.overflow = overflowCurrentProperty;
		return width;
	}

	getCurrentWidth() {
		const documentWidth = document.documentElement.clientWidth;
		const windowWidth = window.innerWidth;
		const currentWidth = windowWidth - documentWidth;
		return currentWidth;
	}

	setFillGapMethod(method) {
		const parsedMethod = method.toLowerCase();
		if (FILLGAP_AVAILABLE_METHODS.includes(parsedMethod)) {
			_fillGapMethod = parsedMethod;
		} else {
			throwError(`"${method}" method is not available!`);
		}

		return this;
	}

	setFillGapSelectors(selectors) {
		if (Array.isArray(selectors)) {
			selectors.push(`.${FILLGAP_CLASSNAME}`);
			_fillGapSelectors = selectors;
		} else {
			throwError('setFillGapSelectors accepts only array!');
		}

		return this;
	}

	_fillGaps() {
		const selector = generateSelector(_fillGapSelectors);
		const currentWidth = this.getCurrentWidth();
		const elements = document.querySelectorAll(selector);

		eachNode(elements, (element) => {
			if (_fillGapMethod === 'margin') {
				element.style.marginRight = `${currentWidth}px`;
			} else if (_fillGapMethod === 'width') {
				element.style.width = `calc(100% - ${currentWidth}px)`;
			} else {
				element.style.paddingRight = `${currentWidth}px`;
			}
		});
	}

	_unfillGaps() {
		const selector = generateSelector(_fillGapSelectors);
		const elements = document.querySelectorAll(selector);

		eachNode(elements, (element) => {
			element.style.marginRight = '';
			element.style.width = '';
			element.style.paddingRight = '';
		});
	}
}

export const scrollLock = new ScrollLock();
