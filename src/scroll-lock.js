import {
	eachNode,
	argumentAsArray,
	isElement,
	throwError,
	arrayAsSelector,
	findParentBySelector,
	elementScrollTopOnStart,
	elementScrollTopOnEnd,
	elementScrollLeftOnStart,
	elementScrollLeftOnEnd,
	elementIsScrollableField,
	elementHasSelector
} from './tools';

const FILL_GAP_AVAILABLE_METHODS = ['padding', 'margin', 'width', 'max-width', 'none'];
const TOUCH_DIRECTION_DETECT_OFFSET = 3;

const state = {
	scroll: true,
	queue: 0,
	scrollableSelectors: ['[data-scroll-lock-scrollable]'],
	fillGapSelectors: ['body', '[data-scroll-lock-fill-gap]'],
	fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
	//
	startTouchY: 0,
	startTouchX: 0
};

export const disablePageScroll = (target) => {
	if (state.queue <= 0) {
		fillGaps();
		document.body.style.overflow = 'hidden';
		state.scroll = false;
	}

	addScrollableTarget(target);
	state.queue++;
};
export const enablePageScroll = (target) => {
	state.queue--;
	if (state.queue <= 0) {
		document.body.style.overflow = '';
		unfillGaps();
		state.scroll = true;
	}

	removeScrollableTarget(target);
};
export const getScrollState = () => {
	return state.scroll;
};
export const clearQueueScrollLocks = () => {
	state.queue = 0;
};
export const getPageScrollBarWidth = () => {
	const overflowCurrentProperty = document.body.style.overflow;
	document.body.style.overflow = 'scroll';
	const width = getCurrentPageScrollBarWidth();
	document.body.style.overflow = overflowCurrentProperty;

	return width;
};
export const getCurrentPageScrollBarWidth = () => {
	const documentWidth = document.documentElement.clientWidth;
	const windowWidth = window.innerWidth;
	const currentWidth = windowWidth - documentWidth;

	return currentWidth;
};
export const addScrollableTarget = (target) => {
	if (target) {
		const targets = argumentAsArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					$target.dataset.scrollLockScrollable = '';
				} else {
					throwError(`"${$target}" is not a Node object.`);
				}
			});
		});
	}
};
export const removeScrollableTarget = (target) => {
	if (target) {
		const targets = argumentAsArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					delete $target.dataset.scrollLockScrollable;
				} else {
					throwError(`"${$target}" is not a Node object.`);
				}
			});
		});
	}
};
export const addScrollableSelector = (selector) => {
	if (selector) {
		const selectors = argumentAsArray(selector);
		selectors.map((selector) => {
			state.scrollableSelectors.push(selector);
		});
	}
};
export const removeScrollableSelector = (selector) => {
	if (selector) {
		const selectors = argumentAsArray(selector);
		selectors.map((selector) => {
			state.scrollableSelectors = state.scrollableSelectors.filter((sSelector) => sSelector !== selector);
		});
	}
};
export const setFillGapMethod = (method) => {
	if (method) {
		if (FILL_GAP_AVAILABLE_METHODS.indexOf(method) !== -1) {
			state.fillGapMethod = method;
			refillGaps();
		} else {
			const methods = FILL_GAP_AVAILABLE_METHODS.join(', ');
			throwError(`"${method}" method is not available!\nAvailable fill gap methods: ${methods}.`);
		}
	}
};
export const addFillGapTarget = (target) => {
	if (target) {
		const targets = argumentAsArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					$target.dataset.scrollLockFillGap = '';
					if (!state.scroll) {
						fillGapTarget($target);
					}
				} else {
					throwError(`"${$target}" is not a Node object.`);
				}
			});
		});
	}
};
export const removeFillGapTarget = (target) => {
	if (target) {
		const targets = argumentAsArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					delete $target.dataset.scrollLockFillGap;
					if (!state.scroll) {
						unfillGapTarget($target);
					}
				} else {
					throwError(`"${$target}" is not a Node object.`);
				}
			});
		});
	}
};
export const addFillGapSelector = (selector) => {
	if (selector) {
		const selectors = argumentAsArray(selector);
		selectors.map((selector) => {
			state.fillGapSelectors.push(selector);
			if (!state.scroll) {
				fillGapSelector(selector);
			}
		});
	}
};
export const removeFillGapSelector = (selector) => {
	if (selector) {
		const selectors = argumentAsArray(selector);
		selectors.map((selector) => {
			state.fillGapSelectors = fillGapSelectors.scrollableSelectors.filter((fSelector) => fSelector !== selector);
			if (!state.scroll) {
				unfillGapSelector(selector);
			}
		});
	}
};

export const refillGaps = () => {
	if (!state.scroll) {
		fillGaps();
	}
};

const fillGaps = () => {
	const selector = arrayAsSelector(state.fillGapSelectors);
	fillGapSelector(selector);
};
const unfillGaps = () => {
	const selector = arrayAsSelector(state.fillGapSelectors);
	unfillGapSelector(selector);
};
const fillGapSelector = (selector) => {
	const $targets = document.querySelectorAll(selector);
	eachNode($targets, ($target) => {
		fillGapTarget($target);
	});
};
const fillGapTarget = ($target) => {
	const scrollBarWidth = getPageScrollBarWidth();

	if (isElement($target)) {
		if ($target.dataset.scrollLockFilledGap === 'true') {
			unfillGapTarget($target);
		}

		const computedStyle = window.getComputedStyle($target);
		$target.dataset.scrollLockFilledGap = 'true';
		$target.dataset.scrollLockCurrentFillGapMethod = state.fillGapMethod;

		if (state.fillGapMethod === 'margin') {
			const currentMargin = parseFloat(computedStyle.marginRight);
			$target.style.marginRight = `${currentMargin + scrollBarWidth}px`;
		} else if (state.fillGapMethod === 'width') {
			$target.style.width = `calc(100% - ${scrollBarWidth}px)`;
		} else if (state.fillGapMethod === 'max-width') {
			$target.style.maxWidth = `calc(100% - ${scrollBarWidth}px)`;
		} else if (state.fillGapMethod === 'padding') {
			const currentPadding = parseFloat(computedStyle.paddingRight);
			$target.style.paddingRight = `${currentPadding + scrollBarWidth}px`;
		}
	}
};
const unfillGapSelector = (selector) => {
	const $targets = document.querySelectorAll(selector);
	eachNode($targets, ($target) => {
		unfillGapTarget($target);
	});
};
const unfillGapTarget = ($target) => {
	if (isElement($target)) {
		if ($target.dataset.scrollLockFilledGap === 'true') {
			const currentFillGapMethod = $target.dataset.scrollLockCurrentFillGapMethod;
			delete $target.dataset.scrollLockFilledGap;
			delete $target.dataset.scrollLockCurrentFillGapMethod;

			if (currentFillGapMethod === 'margin') {
				$target.style.marginRight = ``;
			} else if (currentFillGapMethod === 'width') {
				$target.style.width = ``;
			} else if (currentFillGapMethod === 'max-width') {
				$target.style.maxWidth = ``;
			} else if (currentFillGapMethod === 'padding') {
				$target.style.paddingRight = ``;
			}
		}
	}
};

const onResize = (e) => {
	refillGaps();
};

const onTouchStart = (e) => {
	if (!state.scroll) {
		state.startTouchY = e.touches[0].clientY;
		state.startTouchX = e.touches[0].clientX;
	}
};
const onTouchMove = (e) => {
	if (!state.scroll) {
		const { startTouchY, startTouchX } = state;
		const currentClientY = e.touches[0].clientY;
		const currentClientX = e.touches[0].clientX;

		if (e.touches.length < 2) {
			const selector = arrayAsSelector(state.scrollableSelectors);
			const direction = {
				up: startTouchY < currentClientY,
				down: startTouchY > currentClientY,
				left: startTouchX < currentClientX,
				right: startTouchX > currentClientX
			};
			const directionWithOffset = {
				up: startTouchY + TOUCH_DIRECTION_DETECT_OFFSET < currentClientY,
				down: startTouchY - TOUCH_DIRECTION_DETECT_OFFSET > currentClientY,
				left: startTouchX + TOUCH_DIRECTION_DETECT_OFFSET < currentClientX,
				right: startTouchX - TOUCH_DIRECTION_DETECT_OFFSET > currentClientX
			};
			const handle = ($el, skip = false) => {
				if ($el) {
					const parentScrollableEl = findParentBySelector($el, selector, false);
					if (
						skip ||
						((elementIsScrollableField($el) && findParentBySelector($el, selector)) ||
							elementHasSelector($el, selector))
					) {
						let prevent = false;
						if (elementScrollLeftOnStart($el) && elementScrollLeftOnEnd($el)) {
							if (
								(direction.up && elementScrollTopOnStart($el)) ||
								(direction.down && elementScrollTopOnEnd($el))
							) {
								prevent = true;
							}
						} else if (elementScrollTopOnStart($el) && elementScrollTopOnEnd($el)) {
							if (
								(direction.left && elementScrollLeftOnStart($el)) ||
								(direction.right && elementScrollLeftOnEnd($el))
							) {
								prevent = true;
							}
						} else if (
							(directionWithOffset.up && elementScrollTopOnStart($el)) ||
							(directionWithOffset.down && elementScrollTopOnEnd($el)) ||
							(directionWithOffset.left && elementScrollLeftOnStart($el)) ||
							(directionWithOffset.right && elementScrollLeftOnEnd($el))
						) {
							prevent = true;
						}
						if (prevent) {
							if (parentScrollableEl) {
								handle(parentScrollableEl, true);
							} else {
								console.log('prevented');
								e.preventDefault();
							}
						}
					} else {
						handle(parentScrollableEl);
					}
				} else {
					e.preventDefault();
				}
			};

			handle(e.target);
		}
	}
};
const onTouchEnd = (e) => {
	if (!state.scroll) {
		state.startTouchY = 0;
		state.startTouchX = 0;
	}
};

window.addEventListener('resize', onResize);
document.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchmove', onTouchMove, {
	passive: false
});
document.addEventListener('touchend', onTouchEnd);

const scrollLock = {
	disablePageScroll,
	enablePageScroll,

	getScrollState,
	clearQueueScrollLocks,
	getPageScrollBarWidth,
	getCurrentPageScrollBarWidth,

	addScrollableSelector,
	removeScrollableSelector,

	addScrollableTarget,
	removeScrollableTarget,

	addFillGapSelector,
	removeFillGapSelector,

	addFillGapTarget,
	removeFillGapTarget,

	setFillGapMethod,
	refillGaps,

	_state: state
};

export default scrollLock;
