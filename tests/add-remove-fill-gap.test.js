const scrollLock = require('../dist/scroll-lock');

test('add fill gap selector', () => {
    document.body.innerHTML = `		
        <div class="fill-gap-selector"></div>
        <div class="fill-gap-selector-1"></div>
        <div class="fill-gap-selector-2"></div>
    `;

    scrollLock.disablePageScroll();

    const initialFillGapSelectors = JSON.parse(JSON.stringify(scrollLock._state.fillGapSelectors));
    const $fillGapSelector = document.querySelector('.fill-gap-selector');
    expect($fillGapSelector.dataset.scrollLockFilledGap).toEqual(undefined);
    scrollLock.addFillGapSelector('.fill-gap-selector');
    initialFillGapSelectors.push('.fill-gap-selector');
    expect(scrollLock._state.fillGapSelectors).toEqual(initialFillGapSelectors);
    expect($fillGapSelector.dataset.scrollLockFilledGap).toEqual('true');

    const $fillGapSelector1 = document.querySelector('.fill-gap-selector-1');
    const $fillGapSelector2 = document.querySelector('.fill-gap-selector-2');
    expect($fillGapSelector1.dataset.scrollLockFilledGap).toEqual(undefined);
    expect($fillGapSelector2.dataset.scrollLockFilledGap).toEqual(undefined);
    scrollLock.addFillGapSelector(['.fill-gap-selector-1', '.fill-gap-selector-2']);
    initialFillGapSelectors.push('.fill-gap-selector-1');
    initialFillGapSelectors.push('.fill-gap-selector-2');
    expect(scrollLock._state.fillGapSelectors).toEqual(initialFillGapSelectors);
    expect($fillGapSelector1.dataset.scrollLockFilledGap).toEqual('true');
    expect($fillGapSelector2.dataset.scrollLockFilledGap).toEqual('true');

    scrollLock.enablePageScroll();
    expect($fillGapSelector1.dataset.scrollLockFilledGap).toEqual(undefined);
    expect($fillGapSelector2.dataset.scrollLockFilledGap).toEqual(undefined);
});

test('remove fill gap selector', () => {
    scrollLock.disablePageScroll();

    let initialFillGapSelectors = JSON.parse(JSON.stringify(scrollLock._state.fillGapSelectors));
    const $fillGapSelector = document.querySelector('.fill-gap-selector');
    expect($fillGapSelector.dataset.scrollLockFilledGap).toEqual('true');
    scrollLock.removeFillGapSelector('.fill-gap-selector');
    initialFillGapSelectors = initialFillGapSelectors.filter((s) => s !== '.fill-gap-selector');
    expect(scrollLock._state.fillGapSelectors).toEqual(initialFillGapSelectors);
    expect($fillGapSelector.dataset.scrollLockFilledGap).toEqual(undefined);

    const $fillGapSelector1 = document.querySelector('.fill-gap-selector-1');
    const $fillGapSelector2 = document.querySelector('.fill-gap-selector-2');
    expect($fillGapSelector1.dataset.scrollLockFilledGap).toEqual('true');
    expect($fillGapSelector2.dataset.scrollLockFilledGap).toEqual('true');
    scrollLock.removeFillGapSelector(['.fill-gap-selector-1', '.fill-gap-selector-2']);
    initialFillGapSelectors = initialFillGapSelectors.filter((s) => s !== '.fill-gap-selector-1');
    initialFillGapSelectors = initialFillGapSelectors.filter((s) => s !== '.fill-gap-selector-2');
    expect(scrollLock._state.fillGapSelectors).toEqual(initialFillGapSelectors);
    expect($fillGapSelector1.dataset.scrollLockFilledGap).toEqual(undefined);
    expect($fillGapSelector2.dataset.scrollLockFilledGap).toEqual(undefined);

    scrollLock.enablePageScroll();
});

test('add fill gap target', () => {
    document.body.innerHTML = `
        <div id="fill-gap-target"></div>

        <div class="fill-gap-target"></div>
        <div class="fill-gap-target"></div>
        <div class="fill-gap-target"></div>
    `;

    const $fillGapTarget = document.querySelector('#fill-gap-target');
    expect($fillGapTarget.dataset.scrollLockFillGap).toBe(undefined);
    scrollLock.addFillGapTarget($fillGapTarget);
    expect($fillGapTarget.dataset.scrollLockFillGap).toBe('');
    expect($fillGapTarget.dataset.scrollLockFilledGap).toBe(undefined);
    scrollLock.disablePageScroll();
    expect($fillGapTarget.dataset.scrollLockFilledGap).toBe('true');
    scrollLock.enablePageScroll();
    expect($fillGapTarget.dataset.scrollLockFilledGap).toBe(undefined);

    const $fillGapTargets = document.querySelectorAll('.fill-gap-target');
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFillGap).toBe(undefined);
    }
    scrollLock.addFillGapTarget($fillGapTargets);
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFillGap).toBe('');
        expect($fillGapTargets[i].dataset.scrollLockFilledGap).toBe(undefined);
    }
    scrollLock.disablePageScroll();
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFilledGap).toBe('true');
    }
    scrollLock.enablePageScroll();
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFilledGap).toBe(undefined);
    }
});

test('remove fill gap target', () => {
    scrollLock.disablePageScroll();

    const $fillGapTarget = document.querySelector('#fill-gap-target');
    expect($fillGapTarget.dataset.scrollLockFillGap).toBe('');
    expect($fillGapTarget.dataset.scrollLockFilledGap).toBe('true');
    scrollLock.removeFillGapTarget($fillGapTarget);
    expect($fillGapTarget.dataset.scrollLockFillGap).toBe(undefined);
    expect($fillGapTarget.dataset.scrollLockFilledGap).toBe(undefined);

    const $fillGapTargets = document.querySelectorAll('.fill-gap-target');
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFillGap).toBe('');
        expect($fillGapTargets[i].dataset.scrollLockFilledGap).toBe('true');
    }
    scrollLock.removeFillGapTarget($fillGapTargets);
    for (let i = 0; i < $fillGapTargets.length; i++) {
        expect($fillGapTargets[i].dataset.scrollLockFillGap).toBe(undefined);
        expect($fillGapTargets[i].dataset.scrollLockFilledGap).toBe(undefined);
    }
});
