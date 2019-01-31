import {
	eachNode,
	argumentToArray,
	isElement,
	throwError,
	arrayToSelector,
	findParentBySelector,
	elementScrollTopOnStart,
	elementScrollTopOnEnd,
	elementScrollLeftOnStart,
	elementScrollLeftOnEnd,
	elementIsScrollableField,
	elementHasSelector
} from './tools';

const FILL_GAP_AVAILABLE_METHODS = ['padding', 'margin', 'width', 'max-width'];
const TOUCH_DIRECTION_DETECT_OFFSET = 3;

const state = {
	scrollBar: true,
	queue: 0,
	scrollableSelectors: ['[data-scroll-lock-scrollable]'],
	fillGapSelectors: ['body', '[data-scroll-lock-fill-gap]'],
	fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
	//
	startTouchY: 0,
	startTouchX: 0,
	touchMoveProcessed: false
};

export const disableScrollBar = (target) => {
	if (state.queue <= 0) {
		fillGaps();
		document.body.style.overflow = 'hidden';
		state.scrollBar = false;
	}

	addScrollableTarget(target);
	state.queue++;
};
export const enableScrollBar = (target) => {
	state.queue--;
	if (state.queue <= 0) {
		document.body.style.overflow = '';
		unfillGaps();
		state.scrollBar = true;
	}

	removeScrollableTarget(target);
};
export const getScrollBarState = () => {
	return state.scrollBar;
};
export const clearQueueLocks = () => {
	state.queue = 0;
};
export const getScrollBarWidth = () => {
	const overflowCurrentProperty = document.body.style.overflow;
	document.body.style.overflow = 'scroll';
	const width = getCurrentScrollBarWidth();
	document.body.style.overflow = overflowCurrentProperty;

	return width;
};
export const getCurrentScrollBarWidth = () => {
	const documentWidth = document.documentElement.clientWidth;
	const windowWidth = window.innerWidth;
	const currentWidth = windowWidth - documentWidth;

	return currentWidth;
};
export const addScrollableTarget = (target) => {
	if (target) {
		const targets = argumentToArray(target);
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
		const targets = argumentToArray(target);
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
		const selectors = argumentToArray(selector);
		selectors.map((selector) => {
			state.scrollableSelectors.push(selector);
		});
	}
};
export const removeScrollableSelector = (selector) => {
	if (selector) {
		const selectors = argumentToArray(selector);
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
		const targets = argumentToArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					$target.dataset.scrollLockFillGap = '';
					if (!state.scrollBar) {
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
		const targets = argumentToArray(target);
		targets.map(($targets) => {
			eachNode($targets, ($target) => {
				if (isElement($target)) {
					delete $target.dataset.scrollLockFillGap;
					if (!state.scrollBar) {
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
		const selectors = argumentToArray(selector);
		selectors.map((selector) => {
			state.fillGapSelectors.push(selector);
			if (!state.scrollBar) {
				fillGapSelector(selector);
			}
		});
	}
};
export const removeFillGapSelector = (selector) => {
	if (selector) {
		const selectors = argumentToArray(selector);
		selectors.map((selector) => {
			state.fillGapSelectors = fillGapSelectors.scrollableSelectors.filter((fSelector) => fSelector !== selector);
			if (!state.scrollBar) {
				unfillGapSelector(selector);
			}
		});
	}
};
export const refillGaps = () => {
	if (!state.scrollBar) {
		fillGaps();
	}
};

const fillGaps = () => {
	const selector = arrayToSelector(state.fillGapSelectors);
	fillGapSelector(selector);
};
const unfillGaps = () => {
	const selector = arrayToSelector(state.fillGapSelectors);
	unfillGapSelector(selector);
};
const fillGapSelector = (selector) => {
	const $targets = document.querySelectorAll(selector);
	eachNode($targets, ($target) => {
		fillGapTarget($target);
	});
};
const fillGapTarget = ($target) => {
	const scrollBarWidth = getScrollBarWidth();

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
		} else {
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
			} else {
				$target.style.paddingRight = ``;
			}
		}
	}
};

const onResize = (e) => {
	if (!state.scrollBar) {
		fillGaps();
	}
};
const onTouchStart = (e) => {
	if (!state.scrollBar) {
		state.startTouchY = e.touches[0].clientY;
		state.startTouchX = e.touches[0].clientX;
		state.touchMoveProcessed = false;
	}
};
const onTouchMove = (e) => {
	if (!state.scrollBar && !state.touchMoveProcessed) {
		const startTouchY = state.startTouchY;
		const startTouchX = state.startTouchX;
		const currentClientY = e.touches[0].clientY;
		const currentClientX = e.touches[0].clientX;

		if (e.touches.length < 2) {
			const selector = arrayToSelector(state.scrollableSelectors);
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
			state.touchMoveProcessed = true;
		}
	}
};
const onTouchEnd = (e) => {
	if (!state.scrollBar) {
		state.startTouchY = 0;
		state.startTouchX = 0;
		state.touchMoveProcessed = false;
	}
};

window.addEventListener('resize', onResize);
document.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchmove', onTouchMove, {
	passive: false
});
document.addEventListener('touchend', onTouchEnd);

const scrollLock = {
	disableScrollBar,
	enableScrollBar,
	getScrollBarState,
	clearQueueLocks,
	getScrollBarWidth,
	getCurrentScrollBarWidth,
	addScrollableSelector,
	removeScrollableSelector,
	setFillGapMethod,
	addFillGapTarget,
	removeFillGapTarget,
	addFillGapSelector,
	removeFillGapSelector,
	refillGaps,
	_state: state
};

export default scrollLock;
