const scrollLock = require('../dist/scroll-lock');

test('add scrollable selector', () => {
	const initialScrollableSelectors = JSON.parse(JSON.stringify(scrollLock._state.scrollableSelectors));
	scrollLock.addScrollableSelector('.scrollable-selector');
	initialScrollableSelectors.push('.scrollable-selector');
	expect(scrollLock._state.scrollableSelectors).toEqual(initialScrollableSelectors);

	scrollLock.addScrollableSelector(['.scrollable-selector-1', '.scrollable-selector-2']);
	initialScrollableSelectors.push('.scrollable-selector-1');
	initialScrollableSelectors.push('.scrollable-selector-2');
	expect(scrollLock._state.scrollableSelectors).toEqual(initialScrollableSelectors);
});

test('remove scrollable selector', () => {
	let initialScrollableSelectors = JSON.parse(JSON.stringify(scrollLock._state.scrollableSelectors));
	scrollLock.removeScrollableSelector('.scrollable-selector');
	initialScrollableSelectors = initialScrollableSelectors.filter((s) => s !== '.scrollable-selector');
	expect(scrollLock._state.scrollableSelectors).toEqual(initialScrollableSelectors);

	scrollLock.removeScrollableSelector(['.scrollable-selector-1', '.scrollable-selector-2']);
	initialScrollableSelectors = initialScrollableSelectors.filter((s) => s !== '.scrollable-selector-1');
	initialScrollableSelectors = initialScrollableSelectors.filter((s) => s !== '.scrollable-selector-2');
	expect(scrollLock._state.scrollableSelectors).toEqual(initialScrollableSelectors);
});

test('add scrollable target', () => {
	document.body.innerHTML = `
		<div id="scrollable-target"></div>
		
		<div class="scrollable-target"></div>
		<div class="scrollable-target"></div>
		<div class="scrollable-target"></div>
	`;

	const $scrollableTarget = document.querySelector('#scrollable-target');
	expect($scrollableTarget.dataset.scrollLockScrollable).toBe(undefined);
	scrollLock.addScrollableTarget($scrollableTarget);
	expect($scrollableTarget.dataset.scrollLockScrollable).toBe('');

	const $scrollableTargets = document.querySelectorAll('.scrollable-target');
	for (let i = 0; i < $scrollableTargets.length; i++) {
		expect($scrollableTargets[i].dataset.scrollLockScrollable).toBe(undefined);
	}
	scrollLock.addScrollableTarget($scrollableTargets);
	for (let i = 0; i < $scrollableTargets.length; i++) {
		expect($scrollableTargets[i].dataset.scrollLockScrollable).toBe('');
	}
});

test('remove scrollable target', () => {
	const $scrollableTarget = document.querySelector('#scrollable-target');
	expect($scrollableTarget.dataset.scrollLockScrollable).toBe('');
	scrollLock.removeScrollableTarget($scrollableTarget);
	expect($scrollableTarget.dataset.scrollLockScrollable).toBe(undefined);

	const $scrollableTargets = document.querySelectorAll('.scrollable-target');
	for (let i = 0; i < $scrollableTargets.length; i++) {
		expect($scrollableTargets[i].dataset.scrollLockScrollable).toBe('');
	}
	scrollLock.removeScrollableTarget($scrollableTargets);
	for (let i = 0; i < $scrollableTargets.length; i++) {
		expect($scrollableTargets[i].dataset.scrollLockScrollable).toBe(undefined);
	}
});
