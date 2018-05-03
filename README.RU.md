# scroll-lock
Javascript библиотека для работы с нативной полосой прокрутки. Так же отключает скроллинг на iOS и других тач устройствах.

## Установка
**Через npm** `npm install scroll-lock --save`

``` js
import scrollLock from 'scroll-lock';
//или
var scrollLock = require('scroll-lock');
```

**Через script тег**
``` html
<script src="/путь/до/node_modules/scroll-lock/dist/scroll-lock.min.js"></script>
```
``` js
window.scrollLock;
```

## Подводный камень #1 (Отключение скроллинга)
Когда вызывается метод `scrollLock.hide()`, так же скроллинг отключается в iOS и других тач устройствах ([суть проблемы](https://toster.ru/q/461836)). Если рассматривать конкретнее, то **scroll-lock** отлавливает touch эвенты и обрабатывает их, в случае чего вызывает preventDefault(). Поэтому если вызвать `scrollLock.hide()` и указать какому либо элементу `overflow-y` со значением `scroll`, то этот элемент скроллится не будет (речь идёт только о тач устройствах).
<br>
Если надо сделать какой-либо элемент "скроллабельным", укажи этому элементу `sl--scrollable` класс (он же должен иметь `overflow-y` свойство, `scroll` или `auto`) или используйте `scrollLock.setScrollableTargets(targets)` метод или укажите его первым аргументов в методе `scrollLock.hide(targets)`.
```html
<div class="modal-scroll sl--scrollable"></div>
```
```css
.modal-scroll {
	overflow: auto;
	-webkit-overflow-scrolling: touch; /* не забывай про это свойство, скроллинг в iOS будет более плавным */
}
```
```js
var $scrollableTarget = document.getElementById('scrollable');

scrollLock.setScrollableTargets($scrollableTarget);
//или
scrollLock.hide($scrollableTarget);
```

Лайв пример: https://fl3nkey.github.io/scroll-lock/demos/index.html
<br>
Исходники примера: https://codepen.io/FL3NKEY/pen/YaQPrg

## Подводный камень #2 (Ширина полосы прокрутки и прыгскоки)
О чем речь? Когда `body` имеет `overflow` свойство в значении `hidden`, то ширина контейнера увеличивается на ширину полосы прокрутки, поэтому появляется непреятный "мерцающий" эффект. Объяснение: например ширина контейнера *1200px*, а ширина окна *1217px* (ширина контейнера + ширина полосы прокрутки), то после `scrollLock.hide()` ширина контейнера примет ширину окна.
<br>
Но чтобы предотвратить это, **scroll-bock** высчитывает ширину полосы прокрутки перед отключением скроллинга и "заполняет пробел".
<br>
Но это не работает для элементов у которых `position` свойство в значении `fixed`. В таких случаях надо указать элементу `sl--fillgap` класс.
```html
<div class="fixed-element sl--fillgap"></div>
```

После вызова метода `scrollLock.hide()`:
```html
<body style="overflow: hidden; padding-right: ${scroll-width};">
	<div class="fixed-element sl-fillgap" style="padding-right: ${scroll-width};">...</div>
</body>
```
Так же можно изменить "[метод заполнения пробела](#setfillgapmethodmethod)", "[селекторы](#setfillgapselectorsselectors)" и "[элементы](#setfillgaptargetstargets)"!

Лайв пример: https://fl3nkey.github.io/scroll-lock/demos/fill_gap.html
<br>
Исходники примера: https://codepen.io/FL3NKEY/pen/JLeJqY

## Очередь
Вызов методов `scrollLock.hide()` и `scrollLock.show()` создает очередь вызовов. Что я хочу донести, если вы вызовите метод `scrollLock.hide()` **два раза подряд**, а потом `scrollLock.show()`, скроллбар не активируется, т.к. метод `scrollLock.show()` нужно будет **вызвать второй раз**.
<br>
Если вам по каким то причинам надо активировать скролбар вне очереди, используйте метод `scrollLock.clearQueue()`:
``` js
scrollLock.clearQueue().show();
```

## Методы
### hide(targets)
Скрытие полосы прокрутки и отключение скроллинга.
<br>
**Тип:** Element или Array
``` js
scrollLock.hide($scrollableElement);
```

### show()
Раскрытие полосы прокрутки и включение скроллинга.
``` js
scrollLock.show();
```

### toggle()
Переключение между `hide()` и `show()` методом.
``` js
scrollLock.toggle();
```

### getState()
Получение состояние скролла.
``` js
scrollLock.getState(); //true
scrollLock.hide();
scrollLock.getState(); //false
```

### getWidth()
Получение ширины полосы прокрутки.
``` js
scrollLock.getWidth();
```

### getCurrentWidth()
Получение ширины полосы прокрутки в конкретный момент.
``` js
scrollLock.getCurrentWidth();
```

### setScrollableTargets(targets)
Указывает элементы, которые должны скроллится.
<br>
**Тип:** Element или Array
``` js
scrollLock.setScrollableTargets($scrollableElement);
```

### setFillGapMethod(method)
Изменяет метод "заполнение пробела".
<br>
**Тип:** String
<br>
**Доступные значения:**
- `padding`: `padding-right: ${scroll-width};`
- `margin`: `margin-right: ${scroll-width};`
- `width`: `width: calc(100% - ${scroll-width});`

**Значение по умолчанию:** `padding` 
``` js
scrollLock.setFillGapMethod('width');
```

### setFillGapSelectors(selectors)
Изменение селекторов, которым будет "заполняться пробел".
<br>
**Тип:** Array
<br>
**Доступные значение:** Массив селекторов.
<br>
**Значение по умолчанию** `['body']` 
``` js
scrollLock.setFillGapSelectors(['body', '.some-element', '#another-element']);
```

### setFillGapTargets(targets)
Указывает элементы, которым будет "заполняться пробел".
<br>
**Тип:** Element или Array
``` js
scrollLock.setFillGapTargets($someElement);
```


### clearQueue()
Очищает значение очереди.
``` js
scrollLock.clearQueue();
```