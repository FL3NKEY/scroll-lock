<h1 align="center">
  scroll-lock
</h1>
<p align="center">
  <img src="https://travis-ci.org/FL3NKEY/scroll-lock.svg?branch=master">
  <img src="https://img.shields.io/npm/v/scroll-lock.svg?style=flat">
  <img src="https://img.shields.io/npm/l/scroll-lock.svg?style=flat">
</p>
<h4 align="center">Кроссбраузерная JavaScript библиотека для отключения прокрутки страницы</h4>
<p align="center"><a href="https://fl3nkey.github.io/scroll-lock/demos/index.ru.html" rel="nofollow"><b>Лайв демо</b></a></p>

## Новые возможности 2.0
* Более придвинутый алгоритм обработки touch событий
* Поддержка горизонтальной прокрутки
* Поддержка вложенных прокручиваемых элементов
* Поддержка вложенных textarea и contenteditable
* Новый API

## Установка
### Через npm или yarn
```shell
npm install scroll-lock
# или
yarn add scroll-lock
```
```js
//es6 import
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

//или
import scrollLock from 'scroll-lock';
scrollLock.disablePageScroll();
//...

//require
const scrollLock = require('scroll-lock');
scrollLock.disablePageScroll();
//...
```

### Черз тег script
```html
<script src="path/to/scroll-lock.min.js"></script>
<script>
  scrollLock.disablePageScroll();
  //...
</script>
```
Дальше в примерах будет использован **es6 import**, но эти методы также будут доступны из объекта ```scrollLock```.
<br>

## Отключение прокрутки страницы
Когда вы вызываете метод ```disablePageScroll```, также прокрутка отключается в iOS и других touch устройствах ([суть проблемы](https://toster.ru/q/461836)). Но прокрута на touch устройствах будет отключена на всех элементов, для этого надо явно указать, какой элемент будет прокручиваться на странице.
```javascript
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

//Получим элемент, который должен прокручиваться при отключеной прокрутки страницы
const $scrollableElement = document.querySelector('.my-scrollable-element');

//Передадим элемент аргументом и отключим прокрутку на странице
disablePageScroll($scrollableElement);

//Также передадим аргументом элемент и активируем прокрутку на странице
enablePageScroll($scrollableElement);
```
Или же вы можете указать атрибут ```data-scroll-lock-scrollable``` прокручиваемому элементу.
```html
<div class="my-scrollable-element" data-scroll-lock-scrollable></div>
```

#### Лайв демо: [https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-main](https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-main)

#### ```textarea``` и ```contenteditable```
Если в прокручиваемом элементе будут вложены ```textarea``` или ```contenteditable``` то не переживайте, они будут прокручиваться без явного указания.

#### Лайв демо: [https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-inputs](https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-inputs)

## Заполнение пробела
Когда вызывается метод ```disablePageScroll```, scroll-lock указывает ```overflow: hidden;``` для ```body```, тем самым скрывая полосу прокрутки. В некоторых ОС полоса прокрутки имеет свою физическую ширину на странице, тем самым мы получае эффект "смещения":
<br>
<br>
![](https://i.imgur.com/SQ3IRNr.gif)
<br>
<br>
Что бы предотвратить это, scroll-lock высчитывает ширину полосы прокрутки при вызове метода  ```disablePageScroll``` и заполняет пробел для элемента ```body```.
<br>
<br>
![](https://i.imgur.com/ReJEcN8.gif)
<br>
<br>
Но это не работает для элементов с позиционированием ```fixed```. Для этого надо явно указать, какому ещё элементу нужно заполнить пробел.
```javascript
import { addFillGapTarget, addFillGapSelector } from 'scroll-lock';

//селектор
addFillGapSelector('.my-fill-gap-selector');

//элемент
const $fillGapElement = document.querySelector('.my-fill-gap-element');
addFillGapTarget($fillGapElement);
```
Или же вы можете указать атрибут ```data-scroll-lock-fill-gap```.
```html
<div class="my-fill-gap-element" data-scroll-lock-fill-gap></div>
```

#### Лайв демо: [https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-fill-gap](https://fl3nkey.github.io/scroll-lock/demos/index.ru.html#ex-fill-gap)

## Очередь
Вызов метода ```disablePageScroll``` создает очередь вызовов. Если вы вызовите метод ```disablePageScroll``` два раза подряд, а потом ```enablePageScroll```, прокрутка страницы не активируется, т.к. метод ```enablePageScroll``` **нужно будет вызвать второй раз**.
<br>
Если вам по каким то причинам надо активировать прокрутку страницы вне очереди, используйте метод ```clearQueueScrollLocks```:
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
Скрывает полосу прокрутки и отключает прокрутку страницы.
* ```scrollableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) прокручиваемый элемент
```javascript
import { disablePageScroll } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
disablePageScroll($scrollableElement);
```

#### ```enablePageScroll(scrollableTarget)```
Показывает полосу прокрутки и активирует прокрутку страницы.
* ```scrollableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) прокручиваемый элемент
```javascript
import { enablePageScroll } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
enablePageScroll($scrollableElement);
```

#### ```getScrollState()```
Возвращает состояние полосы прокрутки страницы.
```javascript
import { disablePageScroll, getScrollState } from 'scroll-lock';

console.log(getScrollState()); //true
disablePageScroll();
console.log(getScrollState()); //false
```

#### ```clearQueueScrollLocks()```
Очищает значение очереди.
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
Возвращает ширину полосы прокрутки.
* ```onlyExists``` - (```Boolean```) если полоса прокрутки найдена
<br> **Стандартное значение:** ```false```
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
Возвращает ширину полосы прокрутки в данный момент.
```javascript
import { disablePageScroll, getCurrentPageScrollBarWidth } from 'scroll-lock';

console.log(getCurrentPageScrollBarWidth()); //Number
disablePageScroll();
console.log(getCurrentPageScrollBarWidth()); //0
```


#### ```addScrollableSelector(scrollableSelector)```
Делает элементы с этим селектором прокручиваемыми.
* ```scrollableSelector``` - (```String | String array```) селектор прокручиваемых элементов
<br> **Начальное значение:** ```['[data-scroll-lock-scrollable]']```
```javascript
import { disablePageScroll, addScrollableSelector } from 'scroll-lock';

addScrollableSelector('.my-scrollable-selector');
disablePageScroll();
```

#### ```removeScrollableSelector(scrollableSelector)```
Делает элементы с этим селектором не прокручиваемыми.
* ```scrollableSelector``` - (```String | String array```) селектор прокручиваемых элементов
```javascript
import { removeScrollableSelector } from 'scroll-lock';

removeScrollableSelector('.my-scrollable-selector');
```

#### ```addScrollableTarget(scrollableTarget)```
Делает элемент прокручиваемым.
* ```scrollableSelector``` - (```HTMLElement | NodeList | HTMLElement array```) прокручиваемый элемент
```javascript
import { disablePageScroll, addScrollableTarget } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
addScrollableTarget($scrollableElement);
disablePageScroll();
```

#### ```removeScrollableTarget(scrollableTarget)```
Делает элемент не прокручиваемым.
* ```scrollableSelector``` - (```HTMLElement | NodeList | HTMLElement array```) прокручиваемый элемент
```javascript
import { removeScrollableTarget } from 'scroll-lock';

const $scrollableElement = document.querySelector('.my-scrollable-element');
removeScrollableTarget($scrollableElement);
```



#### ```addLockableSelector(lockableSelector)```
Делает элементы с этим селектором не прокручиваемыми в любом случае.
* ```lockableSelector``` - (```String | String array```) селектор не прокручиваемых элементов
<br> **Initial value:** ```['[data-scroll-lock-lockable]']```
```javascript
import { disablePageScroll, addLockableSelector } from 'scroll-lock';

addLockableSelector('.my-lockable-selector');
disablePageScroll();
```

#### ```addLockableTarget(lockableTarget)```
Делает элемент не прокручиваемым в любом случае.
* ```lockableTarget``` - (```HTMLElement | NodeList | HTMLElement array```) не прокручиваемый элемент
```javascript
import { disablePageScroll, addLockableTarget } from 'scroll-lock';

const $lockableElement = document.querySelector('.my-lockable-element');
addLockableTarget($lockableElement);
disablePageScroll();
```



#### ```addFillGapSelector(fillGapSelector)```
Заполняет пробелы у элементов с этим селектором.
* ```fillGapSelector``` - (```String | String array```) селектор заполненения пробела
<br> **Начальное значение:** ```['body', '[data-scroll-lock-fill-gap]']```
```javascript
import { addFillGapSelector } from 'scroll-lock';

addFillGapSelector('.my-fill-gap-selector');
```

#### ```removeFillGapSelector(fillGapSelector)```
Возвращает пробелы у элементов с этим селектором.
* ```fillGapSelector``` - (```String | String array```) селектор заполненения пробела
```javascript
import { removeFillGapSelector } from 'scroll-lock';

removeFillGapSelector('.my-fill-gap-selector');
```

#### ```addFillGapTarget(fillGapTarget)```
Заполняет пробел у элемента.
* ```fillGapTarget``` - (```HTMLElement | NodeList | HTMLElement array```) элемент заполнения пробела
```javascript
import { addFillGapTarget } from 'scroll-lock';

const $fillGapElement = document.querySelector('.my-fill-gap-element');
addScrollableTarget($fillGapElement);
```

#### ```removeFillGapTarget(fillGapTarget)```
Возвращает пробел у элемента.
* ```fillGapTarget``` - (```HTMLElement | NodeList | HTMLElement array```) элемент заполнения пробела
```javascript
import { removeFillGapTarget } from 'scroll-lock';

const $fillGapElement = document.querySelector('.my-fill-gap-element');
removeFillGapTarget($fillGapElement);
```

#### ```setFillGapMethod(fillGapMethod)```
Изменяет метод заполнения пробела.
<br>
* ```fillGapMethod``` - (```String: 'padding', 'margin', 'width', 'max-width', 'none'```) метод заполнения пробела
<br> **Стандартное значение:** ```padding```
```javascript
import { setFillGapMethod } from 'scroll-lock';

setFillGapMethod('margin');
```

#### ```refillGaps()```
Пересчитывает значения заполненых пробелов.
```javascript
import { refillGaps } from 'scroll-lock';

refillGaps();
```

## Смотрите также
* [How to fight the body scroll от Anton Korzunov](https://medium.com/react-camp/how-to-fight-the-body-scroll-2b00267b37ac)
* [body-scroll-lock от willmcpo](https://github.com/willmcpo/body-scroll-lock)
