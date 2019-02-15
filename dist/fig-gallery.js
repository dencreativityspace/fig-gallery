"use strict";

/**
 * Gallery that permits to see images or videos at the maximum of their sizes
 * or, at least the maximum that fits in the window respecting ratio.
 *
 * @constructor
 *
 * @param {object} param
 * @param {string|HTMLElement} [param.container='#gallery'] Container of the gallery.
 * @param {string} [param.gallerySelector='.gallery'] Gallery selector.
 * @param {string} [param.openSelector='.open'] Selector for the open gallery.
 * @param {string} [param.currentSelector='.current'] Selector of the current element.
 * @param {object} [param.buttonSelectors={}] Selectors for the overlay buttons.
 * @param {string} [param.buttonSelectors.close='.close'] Selector for the 'close' button.
 * @param {string} [param.buttonSelectors.prev='.prev'] Selector for the 'previous' button.
 * @param {string} [param.buttonSelectors.next='.next'] Selector for the 'next' button.
 * @param {object} [param.buttonContents={}] Contents for the overlay buttons.
 * @param {string} [param.buttonContents.close='&times;'] Content for the 'close' button.
 * @param {string} [param.buttonContents.prev='&lang;'] Content for the 'previous' button.
 * @param {string} [param.buttonContents.next='&rang;'] Content for the 'next' button.
 * @param {object} [param.overlaySelectors={}] Selectors for the overlay elements.
 * @param {string} [param.overlaySelectors.overlay='.overlay'] Selector for the overlay element.
 * @param {string} [param.overlaySelectors.content='.overlay-content'] Selector content of the overlay element.
 * @param {boolean} [param.cycle=true] Determines if the gallery can cycle when reaches the end-points.
 * @param {boolean} [param.openable=true] Determines if the gallery can be opened or not. If openable, shows the overlay.
 * @param {boolean} [param.throwsOpenIndexError=false] Determines if the gallery has to throw an error when the users tries to navigate beyond the elements.
 *
 * @throws Will throw an error if the container argument isn't an HTMLElement.
 *
 * @version 1.2.0
 *
 * @author Gennaro Landolfi <gennarolandolfi@codedwork.it>
 */
function FigureGallery(_ref) {
  var _this = this;

  var _ref$container = _ref.container,
      container = _ref$container === void 0 ? '#gallery' : _ref$container,
      _ref$gallerySelector = _ref.gallerySelector,
      gallerySelector = _ref$gallerySelector === void 0 ? '.gallery' : _ref$gallerySelector,
      _ref$openSelector = _ref.openSelector,
      openSelector = _ref$openSelector === void 0 ? '.open' : _ref$openSelector,
      _ref$currentSelector = _ref.currentSelector,
      currentSelector = _ref$currentSelector === void 0 ? '.current' : _ref$currentSelector,
      _ref$buttonSelectors = _ref.buttonSelectors,
      buttonSelectors = _ref$buttonSelectors === void 0 ? {} : _ref$buttonSelectors,
      _ref$buttonContents = _ref.buttonContents,
      buttonContents = _ref$buttonContents === void 0 ? {} : _ref$buttonContents,
      _ref$cycle = _ref.cycle,
      cycle = _ref$cycle === void 0 ? true : _ref$cycle,
      _ref$overlaySelectors = _ref.overlaySelectors,
      overlaySelectors = _ref$overlaySelectors === void 0 ? {} : _ref$overlaySelectors,
      _ref$openable = _ref.openable,
      openable = _ref$openable === void 0 ? true : _ref$openable,
      _ref$throwsOpenIndexE = _ref.throwsOpenIndexError,
      throwsOpenIndexError = _ref$throwsOpenIndexE === void 0 ? false : _ref$throwsOpenIndexE;

  // Type-checks
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  if (!(container instanceof HTMLElement)) {
    throw new Error('Il contenitore della galleria deve essere un elemento valido.');
  } // Shorthand to easily reach `this`.


  var that = this; // Overlaps custom settings to default ones:

  buttonSelectors = Object.assign({
    close: '.close',
    prev: '.prev',
    next: '.next'
  }, buttonSelectors);
  buttonContents = Object.assign({
    close: '&times;',
    prev: '&lang;',
    next: '&rang;'
  }, buttonContents);
  overlaySelectors = Object.assign({
    overlay: '.overlay',
    content: '.overlay-content'
  }, overlaySelectors); // Class mapping:

  /**
   * CSS class of the gallery. Applies to container.
   *
   * @constant
   * @type {string}
   *
   * @private
   */

  var galleryClass = gallerySelector.substr(1);
  /**
   * CSS class for the open state of the gallery. Applies to container.
   *
   * @constant
   * @type {string}
   *
   * @private
   */

  var openClass = openSelector.substr(1);
  /**
   * CSS class for the current figure. Applies to the original selected <figure>
   * and the chosen one. Can be applied only to one element at the time.
   *
   * @constant
   * @type {string}
   *
   * @private
   */

  var currentClass = currentSelector.substr(1);
  /**
   * Object containining the CSS classes that get applied to the buttons of the overlay.
   *
   * @constant
   * @enum {string}
   *
   * @private
   */

  var buttonClasses = {
    close: buttonSelectors.close.substr(1),
    prev: buttonSelectors.prev.substr(1),
    next: buttonSelectors.next.substr(1)
  };
  /**
   * Object containining the CSS classes that get applied to the overlay.
   *
   * @constant
   * @enum {string}
   *
   * @private
   */

  var overlayClasses = {
    overlay: overlaySelectors.overlay.substr(1),
    content: overlaySelectors.content.substr(1)
  }; // Sets the gallery class.

  if (!container.classList.contains(galleryClass)) {
    container.classList.add(galleryClass);
  }
  /**
   * Gets all the <figure> elements children of container.
   *
   * @type {HTMLElement[]}
   *
   * @private
   */


  var figures = container.querySelectorAll('figure');
  /**
  * Represents the overlay element.
  *
  * @type {HTMLDialogElement|HTMLDivElement}
  *
  * @private
  */

  var overlay = function () {
    /**
     * Refers to the .`overlay` element.
     *
     * @type {HTMLDialogElement|HTMLDivElement|null}
     *
     * @public
     */
    var dialog = container.querySelector(overlaySelectors.overlay);

    if (!dialog) {
      // Initalizes overlay
      dialog = document.createElement('HTMLDialogElement' in window ? 'dialog' : 'div');
      dialog.classList.add(overlayClasses.overlay);
      /**
       * Refers to the .`overlay-content` element.
       *
       * @type {HTMLDivElement}
       *
       * @public
       */

      dialog.content = document.createElement('div');
      dialog.content.classList.add(overlayClasses.content);
      dialog.appendChild(dialog.content);
      container.appendChild(dialog);
    }
    /**
     * Object containining the buttons in the overlay.
     *
     * @enum {HTMLButtonElement}
     *
     * @public
     */


    dialog.buttons = {};

    for (var type in buttonSelectors) {
      var button = dialog.querySelector(buttonSelectors[type]);

      if (!button) {
        button = document.createElement('button');
        button.classList.add(buttonClasses[type]);
        button.innerHTML = buttonContents[type];
        dialog.appendChild(button);
      }

      dialog.buttons[type] = button;
    }
    /**
     * Utility function to get the content of the current figure.
     *
     * @function
     *
     * @return {HTMLImageElement|HTMLVideoElement|HTMLObjectElement|HTMLEmbedElement|HTMLIFrameElement|null}
     */


    dialog.getContent = function () {
      return dialog.content.querySelector('img, video, object, embed, iframe');
    };

    return dialog;
  }();
  /**
  * Represents the current element in container.
  *
  * @type {HTMLElement}
  *
  * @private
  */


  var current = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = figures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var figure = _step.value;

        if (figure.classList.contains(currentClass)) {
          return figure;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return figures[0] || null;
  }();
  /**
  * Contains the swipe handler if SwipeEvent is present.
  *
  * @type {SwipeEvent|null}
  *
  * @private
  *
  * @see {@link https://github.com/dencreativityspace/swipe-event|swipe-event}
  */


  var swipeHandler = function () {
    if (typeof SwipeEvent === 'function') {
      var swipe = new SwipeEvent({
        element: container,
        itemSelector: 'figure',
        activeSelector: currentSelector
      });
      return swipe;
    }

    return null;
  }();
  /**
  * Stores the callbacks for the events.
  *
  * @type {object}
  *
  * @private
  */


  var eventCallbacks = {
    containerClick: function containerClick(e) {
      if (!that.isOpen()) {
        that.open(null);
      }
    },
    figureClick: function figureClick(e) {
      e.stopImmediatePropagation();
      that.set(e.target).open(null);
    },
    keyboardNavigation: function keyboardNavigation(e) {
      if (that.isOpen()) {
        var key = e.which || e.keyCode || 0;

        switch (key) {
          case 27:
            // Esc
            that.close();
            break;

          case 37:
            // Left arrow
            that.prev();
            break;

          case 39:
            // Right arrow
            that.next();
            break;

          case 36:
            // Home
            that.open(0);
            break;

          case 35:
            // End
            that.open(-1);
            break;
        }
      }
    },
    swipeNavigation: function swipeNavigation(e) {
      var direction = e.detail.direction || e.direction || null;

      if (direction === 'left') {
        that.prev();
      } else if (direction === 'right') {
        that.next();
      }
    },
    resize: function resize() {
      setContentSize();
    }
  }; // Private methods

  /**
   * Keeps `<figure>`s index in bound.
   *
   * @param {number} index Index to check if in bound.
   * @param {boolean} [cycleState=cycle] Determines if function have to keep
   * in bound considering the possibility to cycle through the elements.
   *
   * @return {number}
   * @private
   */

  function keepInBound(index) {
    var cycleState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cycle;
    return (cycleState && index < 0 ? figures.length + index + figures.length : index) % figures.length;
  }
  /**
   * Sets the maximum image size possible.
   *
   * @param {HTMLImageElement} image Image element to be resized.
   *
   * @private
   */


  function setImageSize(image) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);
      var ratio = Math.min(1, (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / image.naturalWidth, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / image.naturalHeight);
      image.style.width = image.naturalWidth * ratio + 'px';
      image.style.height = image.naturalHeight * ratio + 'px';
    }
  }
  /**
   * Sets the maximum video size possible.
   *
   * @param {HTMLVideoElement} video Video element to be resized.
   *
   * @private
   */


  function setVideoSize(video) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);
      var ratio = Math.min(1, (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / video.videoWidth, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / video.videoHeight);
      video.style.width = video.videoWidth * ratio + 'px';
      video.style.height = video.videoHeight * ratio + 'px';
    }
  }
  /**
   * Sets the maximum embed, object or iframe size possible.
   *
   * @param {HTMLEmbedElement|HTMLObjectElement|HTMLIFrameElement} embed Embed, object or iframe element to be resized.
   *
   * @private
   */


  function setEmbedSize(embed) {
    if (overlay) {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);

      if (!embed.hasAttribute('data-width') || !embed.hasAttribute('data-height') || embed.width > parseInt(embed.getAttribute('data-width')) || embed.height > parseInt(embed.getAttribute('data-height'))) {
        embed.setAttribute('data-width', embed.width);
        embed.setAttribute('data-height', embed.height);
      }

      embed.width = parseInt(embed.getAttribute('data-width'));
      embed.height = parseInt(embed.getAttribute('data-height'));
      var ratio = Math.min((overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / embed.width, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / embed.height);
      console.log(ratio);
      embed.width = parseInt(embed.width * ratio);
      embed.height = parseInt(embed.height * ratio);
    }
  }
  /**
   * Sets the maximum size possible for the current content of the overlay.
   * Routes by the type of the element.
   *
   * @see setImageSize
   * @see setVideoSize
   * @see setEmbedSize
   *
   * @private
   */


  function setContentSize() {
    if (overlay) {
      var content = overlay.getContent();

      if (content) {
        switch (content.tagName) {
          case 'IMG':
            setImageSize(content);
            break;

          case 'VIDEO':
            setVideoSize(content);
            break;

          case 'EMBED':
          case 'IFRAME':
          case 'OBJECT':
            setEmbedSize(content);
        }
      }
    }
  }
  /**
   * Gets the index of the given figure.
   *
   * @param {HTMLElement} figure
   *
   * @return {number}
   *
   * @private
   */


  function getFigureIndex(figure) {
    return Array.prototype.indexOf.call(figures, figure);
  }
  /**
   * Sets the given figure as current.
   *
   * @param {HTMLElement} figure
   *
   * @private
   */


  function setCurrentFigure(figure) {
    if (current != null) {
      current.classList.remove(currentClass);
    }

    figure.classList.add(currentClass);
    current = figure;
  }
  /**
   * Updates the content of the overlay by cloning the current figure and
   * opens the overlay.
   *
   * @see setContentSize
   *
   * @private
   */


  function updateOverlayFigure() {
    var figureClone = current.cloneNode(true);
    container.classList.add(openClass);

    if (overlay) {
      if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
        if (!overlay.open) {
          overlay.showModal();
        }
      } else {
        overlay.classList.add(openClass);
      }

      overlay.content.innerHTML = '';
      overlay.content.appendChild(figureClone);
      setContentSize();
    }
  }
  /**
   * Lets the user navigate through the gallery.
   *
   * @param {number} [dir=1] Number of elements next or before the current.
   * @param {boolean} [cycleState=cycle] Determines if the counter must cycle.
   *
   * @see setCurrentFigure
   * @see updateOverlayFigure
   *
   * @private
   */


  function navigateOverlayFigure() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var cycleState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cycle;
    setCurrentFigure(figures[keepInBound(getFigureIndex(current) + dir, cycleState)]);

    if (that.isOpen()) {
      updateOverlayFigure();
    }
  }
  /**
   * Adds or removes all the event listeners to container.
   *
   * @function
   *
   * @param {boolean} [forceFigures=false] Determines if the update must be forced.
   * Useful when MutationObserver isn't supported.
   *
   * @private
   */


  var setListeners = function setListenersFn() {
    var forceFigures = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (openable) {
      // Click on the gallery
      container.addEventListener('click', eventCallbacks.containerClick, false);

      if (forceFigures || !mutation) {
        figures.forEach(function (figure) {
          figure.addEventListener('click', eventCallbacks.figureClick, false);
        });
      } // Keyboard navigation


      document.addEventListener('keydown', eventCallbacks.keyboardNavigation); // Swipe navigation - since 1.1.0

      if (swipeHandler) {
        /**
         * @listens swipe-event#swipe
         * @see {@link https://github.com/dencreativityspace/swipe-event|swipe-event}
         */
        swipeHandler.attach();
        document.addEventListener('swipe', eventCallbacks.swipeNavigation);
      }

      window.addEventListener('resize', eventCallbacks.resize);
    } else {
      container.removeEventListener('click', eventCallbacks.containerClick, false);
      figures.forEach(function (figure) {
        figure.removeEventListener('click', eventCallbacks.figureClick, false);
      });
      document.removeEventListener('keydown', eventCallbacks.keyboardNavigation);

      if (swipeHandler) {
        swipeHandler.detach();
        document.removeEventListener('swipe', eventCallbacks.swipeNavigation);
      }

      window.removeEventListener('resize', eventCallbacks.resize);
    }

    return setListenersFn;
  }(true); // Binds the overlay buttons to the public methods


  var _arr = Object.keys(overlay.buttons);

  var _loop = function _loop() {
    var type = _arr[_i];
    overlay.buttons[type].addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      that[type]();
    }, false);
  };

  for (var _i = 0; _i < _arr.length; _i++) {
    _loop();
  }
  /**
   * Will contain MutationObserver instance if supported.
   *
   * @type {MutationObserver|null}
   *
   * @private
   */


  var mutation = function () {
    if ('MutationObserver' in window) {
      var m = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function (mut) {
          if (mut.type === 'childList') {
            figures = container.querySelectorAll('figure');

            if (mut.addedNodes && mut.addedNodes.length > 0) {
              mut.addedNodes.forEach(function (figure) {
                if (figure.tagName === 'FIGURE') {
                  figure.addEventListener('click', eventCallbacks.figureClick, false);
                }
              });
            }

            if (mut.removedNodes && current in mut.removedNodes.values()) {
              current = figures[0] || null;
            }
          }
        });
      });
      m.observe(container, {
        childList: true
      });
      return m;
    }

    return null;
  }(); // Public methods

  /**
   * Opens the overlay to show the `<figure>` with the given index or the current one.
   *
   * @param   {?number}   [index=0]   Index of the element to be shown.
   *                                  If is null gets the current figure.
   *
   * @emits FigureGallery#opened
   *
   * @return  {this}
   *
   * @throws Will throw an error if `throwsOpenIndexError` is set to `true`
   * and the given index is out of bound.
  */


  this.open = function () {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (index == null) {
      index = getFigureIndex(current);
    } else {
      index = parseInt(index);

      if (throwsOpenIndexError) {
        if (index > figures.length - 1 || Math.abs(index) > figures.length - 1) {
          throw new Error("L'oggetto ".concat(index, " non \xE8 disponibile."));
        }
      } else {
        index = keepInBound(index);
      }
    }

    if (!that.isOpen() || figures[index] !== current) {
      if (figures.length > 0 || index <= figures.length || current == null) {
        setCurrentFigure(figures[0]);
      }

      if (current != null) {
        updateOverlayFigure();
      }
    }

    var openedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      openedEvent = document.createEvent('opened');
      openedEvent.initCustomEvent('opened', false, false, {
        current: current
      });
    } else {
      openedEvent = new CustomEvent('opened', {
        detail: {
          current: current
        }
      });
    }

    container.dispatchEvent(openedEvent);
    return _this;
  };
  /**
   * Shows the previous `<figure>`. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @emits FigureGallery#prev
   *
   * @return  {this}
  */


  this.prev = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(-1, cycleState);
    var prevEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      prevEvent = document.createEvent('prev');
      prevEvent.initCustomEvent('prev', false, false, {
        current: current,
        next: oldCurrent
      });
    } else {
      prevEvent = new CustomEvent('prev', {
        detail: {
          current: current,
          next: oldCurrent
        }
      });
    }

    container.dispatchEvent(prevEvent);
    return _this;
  };
  /**
   * Shows the next `<figure>`. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @emits FigureGallery#next
   *
   * @return  {this}
  */


  this.next = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(1, cycleState);
    var nextEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      nextEvent = document.createEvent('next');
      nextEvent.initCustomEvent('next', false, false, {
        current: current,
        prev: oldCurrent
      });
    } else {
      nextEvent = new CustomEvent('next', {
        detail: {
          current: current,
          prev: oldCurrent
        }
      });
    }

    container.dispatchEvent(nextEvent);
    return _this;
  };
  /**
   * Sets the current `<figure>`.
   *
   * @param   {number|HTMLElement}   figure   Index of the element or the
   *                                          element itself to bet setted as
   *                                          current.
   *
   * @emits FigureGallery#setted
   *
   * @return  {this}
   *
   * @throws Will throw an error if the argument is null.
   * @throws Will throw an error if the argument isn't a child of the container.
   * @throws Will throw an error if `throwsOpenIndexError` is set to true and if the user tries to go beyond the end-points.
   * @throws Will throw an error if the argument isn't a valid element.
  */


  this.set = function (figure) {
    if (!figure) {
      throw new Error("L'elemento indicato non \xE8 un valore valido. Inserire un numero intero o un elemento DOM.");
    }

    if (typeof figure === 'number') {
      if (throwsOpenIndexError) {
        if (figure > figures.length - 1 || Math.abs(figure) > figures.length - 1) {
          throw new Error("L'oggetto ".concat(figure, " non \xE8 disponibile."));
        }
      } else {
        figure = keepInBound(figure);
      }

      figure = figures[figure];
    } else if (figure instanceof HTMLElement) {
      if (getFigureIndex(figure) < 0) {
        throw new Error("L'elemento indicato non fa parte di questa galleria.");
      }
    } else {
      throw new Error("L'elemento indicato non \xE8 un valore valido. Inserire un numero intero o un elemento DOM.");
    }

    var oldCurrent = current;
    setCurrentFigure(figure);
    updateOverlayFigure();
    var settedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      settedEvent = document.createEvent('setted');
      settedEvent.initCustomEvent('setted', false, false, {
        current: current,
        old: oldCurrent
      });
    } else {
      settedEvent = new CustomEvent('setted', {
        detail: {
          current: current,
          old: oldCurrent
        }
      });
    }

    container.dispatchEvent(settedEvent);
    return _this;
  };
  /**
   * Closes the overlay.
   *
   * @emits FigureGallery#closed
   *
   * @return  {this}
  */


  this.close = function () {
    if (overlay) {
      if ('HTMLDialogElement' in window && overlay instanceof HTMLDialogElement) {
        if (overlay.open) {
          overlay.close();
        }
      } else {
        overlay.classList.remove(openClass);
      }
    }

    var closedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      closedEvent = document.createEvent('closed');
      closedEvent.initCustomEvent('closed', false, false, {
        current: current
      });
    } else {
      closedEvent = new CustomEvent('closed', {
        detail: {
          current: current
        }
      });
    }

    container.dispatchEvent(closedEvent);
    return _this;
  };
  /**
   * Sets the gallery to be openable or not.
   *
   * @param   {boolean}   val
   *
   * @emits FigureGallery#openablechange
   *
   * @return  {this}
   *
   * @throws Will throw an error if the argument is null or isn't a boolean.
  */


  this.setOpenable = function (val) {
    if (typeof val !== 'boolean') {
      throw new Error('Il valore deve essere di tipo booleano');
    }

    if (val !== openable) {
      openable = val;

      if (mutation) {
        if (val) {
          mutation.observe(container, {
            childList: true
          });
        } else {
          mutation.disconnect();
        }
      }

      setListeners();
      var openablechangeEvent = null;

      if (typeof window.CustomEvent !== 'function') {
        openablechangeEvent = document.createEvent('openablechange');
        openablechangeEvent.initCustomEvent('openablechange', false, false, {
          openable: val
        });
      } else {
        openablechangeEvent = new CustomEvent('openablechange', {
          detail: {
            openable: val
          }
        });
      }

      container.dispatchEvent(openablechangeEvent);
    }

    return _this;
  };
  /**
   * Forces the update of the child list.
   * Useful when browser doesn't support MutationObserver.
   *
   * @param   {boolean}   [events=true]   Determines if the events should be
   *                                      updated too.
   *
   * @return  {this}
  */


  this.updateFigures = function () {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    figures = contaier.querySelctorAll('figure');

    if (!!events) {
      figures.forEach(function (figure) {
        figure.addEventListener('click', eventCallbacks.figureClick, false);
      });
    }

    if (!(current in figures)) {
      current = figures[0] || null;
    }

    return _this;
  };
  /**
   * Tells if the the overlay is open or not.
   *
   * @return  {boolean}
  */


  this.isOpen = function () {
    return container.classList.contains(openClass);
  };
  /**
   * Tells if the the overlay is able to be open or not.
   *
   * @return  {boolean}
  */


  this.isOpenable = function () {
    return openable;
  };
  /**
   * Returns the container element.
   *
   * @return  {HTMLElement}
  */


  this.getContainer = function () {
    return container;
  };
  /**
   * Returns the current figure element.
   *
   * @return  {HTMLElement}
  */


  this.getCurrentFigure = function () {
    return current;
  };
  /**
   * Returns the current figure element in the overlay.
   *
   * @return  {HTMLElement}
   */


  this.getActiveFigure = function () {
    return overlay.content;
  };
  /**
   * Returns the content of the current figure element in the overlay.
   *
   * @return  {HTMLElement}
   */


  this.getActiveContent = function () {
    return overlay.getContent();
  };
  /**
   * Returns the swipe handler instance, if exists.
   *
   * @return  {SwipeEvent|null}
   */


  this.getSwipeHandler = function () {
    return swipeHandler;
  };
}