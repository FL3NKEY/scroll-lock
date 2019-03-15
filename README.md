<h1 align="center">
  scroll-lock
</h1>
<p align="center">
  <img src="https://travis-ci.org/FL3NKEY/scroll-lock.svg?branch=master">
  <img src="https://img.shields.io/npm/v/scroll-lock.svg?style=flat">
  <img src="https://img.shields.io/npm/l/scroll-lock.svg?style=flat">
</p>
<h4 align="center">Cross-browser JavaScript library to disable scrolling page</h4>
<p align="center"><a href="https://fl3nkey.github.io/scroll-lock/demos/index.html" rel="nofollow"><b>Live demo</b></a>&nbsp;|&nbsp;<a href="https://github.com/FL3NKEY/scroll-lock/blob/master/README.RU.md" rel="nofollow"><b>README на русском</b></a></p>

## New features 2.0
* More advanced touch event handling algorithm
* Horizontal scrolling support
* Support for nested scrollable elements
* Support for nested textarea and contenteditable
* New API

## Installation
### Via npm or yarn
```shell
npm install scroll-lock
# or
yarn add scroll-lock
```
```js
//es6 import
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

//or
import scrollLock from 'scroll-lock';
scrollLock.disablePageScroll();
//...

//require
const scrollLock = require('scroll-lock');
scrollLock.disablePageScroll();
//...
```

### Via script tag
```html
<script src="path/to/scroll-lock.min.js"></script>
<script>
  scrollLock.disablePageScroll();
  //...
</script>
```
The **es6 import** will be used further in the examples, but these methods will also be available from the ```scrollLock``` object.
<br>

## Disable page scrolling
When you call the ```disablePageScroll``` method, scrolling is also disabled in iOS and other touch devices ([essence of the problem](https://stackoverflow.com/questions/28790889/css-how-to-prevent-scrolling-on-ios-safari)). But scrolling on touch devices will be disabled on all elements. To do this, you must explicitly specify which element will scroll on the page.
```javascript
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

//Get the element that should scroll when page scrolling is disabled
const $scrollableElement = document.querySelector('.my-scrollable-element');

//Pass the element to the argument and disable scrolling on the page
disablePageScroll($scrollableElement);

// Also, pass the element to the argument and enable scrolling on the page
enablePageScroll($scrollableElement);
```
Alternatively, you can specify the ```data-scroll-lock-scrollable``` attribute of the scrollable element.
```html
<div class="my-scrollable-element" data-scroll-lock-scrollable></div>
```

#### Live demo: [https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-main](https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-main)

#### ```textarea``` and ```contenteditable```
If a ```textarea``` or ```contenteditable``` is nested in a scrollable element, then do not worry, they will scroll without explicit indication.

#### Live demo: [https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-inputs](https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-inputs)

## Filling the gap
When the ```disablePageScroll``` method is called, the scroll-lock indicates ```overflow: hidden;``` for ```body```, thereby hiding the scroll bar. In some operating systems, the scroll bar has its physical width on the page, thus we get the effect of "displacement":
<br>
<br>
![](https://i.imgur.com/SQ3IRNr.gif)
<br>
<br>
To prevent this, scroll-lock calculates the scroll bar width when calling the ```disablePageScroll``` method and fills in the space for the ```body``` element.
<br>
<br>
![](https://i.imgur.com/ReJEcN8.gif)
<br>
<br>
But this does not work for elements with ```fixed``` positioning. To do this, you must explicitly indicate which element needs to fill in the space.
```javascript
import { addFillGapTarget, addFillGapSelector } from 'scroll-lock';

//selector
addFillGapSelector('.my-fill-gap-selector');

//element
const $fillGapElement = document.querySelector('.my-fill-gap-element');
addFillGapTarget($fillGapElement);
```
Or you can specify the ```data-scroll-lock-fill-gap``` attribute.
```html
<div class="my-fill-gap-element" data-scroll-lock-fill-gap></div>
```

#### Live demo: [https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-fill-gap](https://fl3nkey.github.io/scroll-lock/demos/index.html#ex-fill-gap)

## Queue
A call to the ```disablePageScroll``` method creates a queue of calls. If you call the ```disablePageScroll``` method twice in a row, and then ```enablePageScroll```, the page scrolling is not activated, because the ```enablePageScroll``` method **will need to be called a second time**.
<br>
If for some reason you need to activate scrolling the page out of turn, use the ```clearQueueScrollLocks``` method:
```javascript
import { disablePageScroll, clearQueueScrollLocks } from 'scroll-lock';

disablePageScroll();
disablePageScroll();
disablePageScroll();
disablePageScroll();

enablePageScroll();
console.log(getScrollState()); //false

clearQueueScrollLocks();
enablePageScroll();
console.log(getScrollState()); //true
```

## API

#### ```disablePageScroll(scrollableTarget)```
Hides the scroll bar and disables page scrolling.
* ```scrollableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) scrollable element
```javascript
import { disablePageScroll } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
disablePageScroll($scrollableElement);
```

#### ```enablePageScroll(scrollableTarget)```
Shows the scroll bar and enables page scrolling.
* ```scrollableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) scrollable element
```javascript
import { enablePageScroll } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
enablePageScroll($scrollableElement);
```

#### ```getScrollState()```
Returns the state of the page scroll bar.
```javascript
import { disablePageScroll, getScrollState } from 'scroll-lock';

console.log(getScrollState()); //true
disablePageScroll();
console.log(getScrollState()); //false
```

#### ```clearQueueScrollLocks()```
Clears the queue value.
```javascript
import { disablePageScroll, enablePageScroll, clearQueueScrollLocks, getScrollState } from 'scroll-lock';

disablePageScroll();
disablePageScroll();
disablePageScroll();
disablePageScroll();

enablePageScroll();
console.log(getScrollState()); //false

clearQueueScrollLocks();
enablePageScroll();
console.log(getScrollState()); //true
```

#### ```getPageScrollBarWidth(onlyExists)```
Returns the width of the scroll bar.
* ```onlyExists``` - (```Boolean```) only if scroll bar is exists
<br> **Default value:** ```false```
```javascript
import { getPageScrollBarWidth } from 'scroll-lock';

document.body.style.overflow = 'scroll';
console.log(getPageScrollBarWidth()); //Number
disablePageScroll();
console.log(getPageScrollBarWidth(true)); //Number
document.body.style.overflow = 'hidden';
console.log(getPageScrollBarWidth()); //Number
console.log(getPageScrollBarWidth(true)); //0
```


#### ```getCurrentPageScrollBarWidth()```
Returns the width of the scroll bar to specific moment.
```javascript
import { disablePageScroll, getCurrentPageScrollBarWidth } from 'scroll-lock';

console.log(getCurrentPageScrollBarWidth()); //Number
disablePageScroll();
console.log(getCurrentPageScrollBarWidth()); //0
```


#### ```addScrollableSelector(scrollableSelector)```
Makes elements with this selector scrollable.
* ```scrollableSelector``` - (```String | String array```) scrollable selector
<br> **Initial value:** ```['[data-scroll-lock-scrollable]']```
```javascript
import { disablePageScroll, addScrollableSelector } from 'scroll-lock';

addScrollableSelector('.my-scrollable-selector');
disablePageScroll();
```

#### ```removeScrollableSelector(scrollableSelector)```
Makes elements with this selector not scrollable.
* ```scrollableSelector``` - (```String | String array```) scrollable selector
```javascript
import { removeScrollableSelector } from 'scroll-lock';

removeScrollableSelector('.my-scrollable-selector');
```

#### ```addScrollableTarget(scrollableTarget)```
Makes the element scrollable.
* ```scrollableSelector``` - (```HTMLElement | NodeList | HTMLElement array```) scrollable element
```javascript
import { disablePageScroll, addScrollableTarget } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
addScrollableTarget($scrollableElement);
disablePageScroll();
```

#### ```removeScrollableTarget(scrollableTarget)```
Makes the element not scrollable.
* ```scrollableSelector``` - (```HTMLElement | NodeList | HTMLElement array```) scrollable element
```javascript
import { removeScrollableTarget } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
removeScrollableTarget($scrollableElement);
```



#### ```addLockableSelector(lockableSelector)```
Makes elements with this selector lockable.
* ```lockableSelector``` - (```String | String array```) lockable selector
<br> **Initial value:** ```['[data-scroll-lock-lockable]']```
```javascript
import { disablePageScroll, addLockableSelector } from 'scroll-lock';

addLockableSelector('.my-lockable-selector');
disablePageScroll();
```

#### ```addLockableTarget(lockableTarget)```
Makes the element lockable.
* ```lockableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) lockable element
```javascript
import { disablePageScroll, addLockableTarget } from 'scroll-lock';

const $lockableElement = document.querySelector('.my-lockable-element');
addLockableTarget($lockableElement);
disablePageScroll();
```



#### ```addFillGapSelector(fillGapSelector)```
Fills the gap with elements with this selector.
* ```fillGapSelector``` - (```String | String array```) a fill gap selector
<br> **Initial value:** ```['body', '[data-scroll-lock-fill-gap]']```
```javascript
import { addFillGapSelector } from 'scroll-lock';

addFillGapSelector('.my-fill-gap-selector');
```

#### ```removeFillGapSelector(fillGapSelector)```
Returns the gap for elements with this selector.
* ```fillGapSelector``` - (```String | String array```) a fill gap selector
```javascript
import { removeFillGapSelector } from 'scroll-lock';

removeFillGapSelector('.my-fill-gap-selector');
```

#### ```addFillGapTarget(fillGapTarget)```
Fills the gap at the element.
* ```fillGapTarget``` - (```HTMLElement | NodeList | HTMLElement array```) a fill gap element
```javascript
import { addFillGapTarget } from 'scroll-lock';

const $fillGapElement = document.querySelector('.my-fill-gap-element');
addScrollableTarget($fillGapElement);
```

#### ```removeFillGapTarget(fillGapTarget)```
Returns the gap at the element.
* ```fillGapTarget``` - (```HTMLElement | NodeList | HTMLElement array```) a fill gap element
```javascript
import { removeFillGapTarget } from 'scroll-lock';

const $fillGapElement = document.querySelector('.my-fill-gap-element');
removeFillGapTarget($fillGapElement);
```

#### ```setFillGapMethod(fillGapMethod)```
Changes the method of filling the gap.
<br>
* ```fillGapMethod``` - (```String: 'padding', 'margin', 'width', 'max-width', 'none'```) gap-filling method
<br> **Default value:** ```padding```
```javascript
import { setFillGapMethod } from 'scroll-lock';

setFillGapMethod('margin');
```

#### ```refillGaps()```
Recalculates filled gaps.
```javascript
import { refillGaps } from 'scroll-lock';

refillGaps();
```

## See also
* [How to fight the body scroll by Anton Korzunov](https://medium.com/react-camp/how-to-fight-the-body-scroll-2b00267b37ac)
* [body-scroll-lock by willmcpo](https://github.com/willmcpo/body-scroll-lock)

---
🙌 🙌 I would like to thank “Armani” for the translation. 🙌 🙌 
