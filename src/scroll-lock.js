const FILLGUP_CLASSNAME = 'sl--fillgup';
const SCROLLABLE_CLASSNAME = 'sl--scrollable';
const PREVENT_SCROLL_DATASET = 'slPrevented';
const DELTA_DATASET = 'slDelta';

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

const generateSelector = (selectors) => {
	return selectors.join(', ');
};

const eachNode = (nodeList, callback) => {
	for (let i = 0; i < nodeList.length; i++) {
		callback(nodeList[i]);
	}
};

const throwError = (message) => {
	console.error(`[scroll-lock] ${message}`);
};

class ScrollLock {
	constructor() {
		this._state = true;
		this._fillGupAvailableMethods = ['padding', 'margin', 'width'];
		this._fillGupMethod = this._fillGupAvailableMethods[0];
		this._fillGupSelectors = ['body', `.${FILLGUP_CLASSNAME}`];

		bindEvents(this);
	}

	getState() {
		return this._state;
	}

	hide() {
		this._fillGups();
		document.body.style.overflow = 'hidden';
		this._state = false;

		return this;
	}

	show() {
		document.body.style.overflow = '';
		this._unfillGups();
		this._state = true;

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

	setFillGupMethod(method) {
		const parsedMethod = method.toLowerCase();
		if (this._fillGupAvailableMethods.includes(parsedMethod)) {
			this._fillGupMethod = parsedMethod;
		} else {
			throwError(`"${method}" method is not available!`);
		}

		return this;
	}

	setFillGupSelectors(selectors) {
		if (Array.isArray(selectors)) {
			selectors.push(`.${FILLGUP_CLASSNAME}`);
			this._fillGupSelectors = selectors;
		} else {
			throwError('setFillGupSelectors accepts only array!');
		}

		return this;
	}

	_fillGups() {
		const selector = generateSelector(this._fillGupSelectors);
		const currentWidth = this.getCurrentWidth();
		const elements = document.querySelectorAll(selector);

		eachNode(elements, (element) => {
			if (this._fillGupMethod === 'margin') {
				element.style.marginRight = `${currentWidth}px`;
			} else if (this._fillGupMethod === 'width') {
				element.style.width = `calc(100% - ${currentWidth}px)`;
			} else {
				element.style.paddingRight = `${currentWidth}px`;
			}
		});
	}

	_unfillGups() {
		const selector = generateSelector(this._fillGupSelectors);
		const elements = document.querySelectorAll(selector);

		eachNode(elements, (element) => {
			element.style.marginRight = '';
			element.style.width = '';
			element.style.paddingRight = '';
		});
	}
}

export const scrollLock = new ScrollLock();
