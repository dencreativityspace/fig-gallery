"use strict";

/**
 * Gallery that permits to see images or videos at the maximum of their sizes
 * or, at least the maximum that fits in the window respecting ratio.
 * Removes the controls and caches the overlay.
 *
 * @constructor
 *
 * @param {object} param
 * @param {string|HTMLElement} [param.container='#gallery'] Container of the gallery.
 * @param {string} [param.gallerySelector='.gallery'] Gallery selector.
 * @param {string} [param.openSelector='.open'] Selector for the open gallery.
 * @param {string} [param.currentSelector='.current'] Selector of the current element.
 * @param {string|null} [param.buttonContainerSelector=null] Selector of the container of the buttons. Must be a static element in the overlay or the overaly itself (rapresented by the value `null`).
 * @param {object} [param.buttonSelectors={}] Selectors for the overlay buttons.
 * @param {string} [param.buttonSelectors.close='.close'] Selector for the 'close' button.
 * @param {string} [param.buttonSelectors.prev='.prev'] Selector for the 'previous' button.
 * @param {string} [param.buttonSelectors.next='.next'] Selector for the 'next' button.
 * @param {object} [param.buttonContents={}] Contents for the overlay buttons.
 * @param {string} [param.buttonContents.close='&times;'] Content for the 'close' button.
 * @param {string} [param.buttonContents.prev='&lang;'] Content for the 'previous' button.
 * @param {string} [param.buttonContents.next='&rang;'] Content for the 'next' button.
 * @param {array} [param.buttonsOrder=['prev', 'next', 'close']] Orders of the buttons.
 * @param {object} [param.overlaySelectors={}] Selectors for the overlay elements.
 * @param {string} [param.overlaySelectors.overlay='.overlay'] Selector for the overlay element.
 * @param {string} [param.overlaySelectors.content='.overlay-content'] Selector content of the overlay element.
 * @param {boolean} [param.cycle=true] Determines if the gallery can cycle when reaches the end-points.
 * @param {boolean} [param.swipe=false] Determines if the gallery can be navigated with swipes.
 * @param {boolean} [param.openable=true] Determines if the gallery can be opened or not. If openable, shows the overlay.
 * @param {boolean} [param.throwsOpenIndexError=false] Determines if the gallery has to throw an error when the users tries to navigate beyond the elements.
 * @param {string} [resizePolicy='CONTENT'] Determines which element must be resized. Can be `'CONTAINER'` or `'CONTENT'`.
 * @param {string} [buttonPlacementPolicy='ALL'] If `buttonContainerSelector` isn't `null`, permits to choose which button should be moved inside of it. Can be `'ALL'`, `'NAVIGATORS_ONLY'` or `'CLOSE_ONLY'`.
 * @param {string} [buttonContainerPlacementPolicy='OUTSIDE_CONTENT'] If `buttonContainerSelector` isn't `null`, permits to choose where button container must be placed. Can be `'OUTSIDE_CONTENT'` or `'INSIDE_CONTENT'`.
 *
 * @throws Will throw an error if the container argument isn't an HTMLElement.
 * @throws Will throw an error if the `buttonContainerPlacementPolicy` is invalid.
 * @throws Will throw an error if the `buttonPlacementPolicy` is invalid.
 * @throws Will throw an error if the `resizePolicy` is invalid.
 * @throws Will throw an error if the `buttonsOrder` doesn't include all the buttons.
 *
 * @version 1.7.6
 *
 * @author Gennaro Landolfi <gennarolandolfi@codedwork.it>
 */
function FigureGallery() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$container = _ref.container,
      container = _ref$container === void 0 ? '#gallery' : _ref$container,
      _ref$gallerySelector = _ref.gallerySelector,
      gallerySelector = _ref$gallerySelector === void 0 ? '.gallery' : _ref$gallerySelector,
      _ref$openSelector = _ref.openSelector,
      openSelector = _ref$openSelector === void 0 ? '.open' : _ref$openSelector,
      _ref$currentSelector = _ref.currentSelector,
      currentSelector = _ref$currentSelector === void 0 ? '.current' : _ref$currentSelector,
      _ref$buttonContainerS = _ref.buttonContainerSelector,
      buttonContainerSelector = _ref$buttonContainerS === void 0 ? null : _ref$buttonContainerS,
      _ref$buttonSelectors = _ref.buttonSelectors,
      buttonSelectors = _ref$buttonSelectors === void 0 ? {} : _ref$buttonSelectors,
      _ref$buttonContents = _ref.buttonContents,
      buttonContents = _ref$buttonContents === void 0 ? {} : _ref$buttonContents,
      _ref$buttonsOrder = _ref.buttonsOrder,
      buttonsOrder = _ref$buttonsOrder === void 0 ? ['prev', 'next', 'close'] : _ref$buttonsOrder,
      _ref$cycle = _ref.cycle,
      cycle = _ref$cycle === void 0 ? true : _ref$cycle,
      _ref$overlaySelectors = _ref.overlaySelectors,
      overlaySelectors = _ref$overlaySelectors === void 0 ? {} : _ref$overlaySelectors,
      _ref$swipe = _ref.swipe,
      swipe = _ref$swipe === void 0 ? false : _ref$swipe,
      _ref$openable = _ref.openable,
      openable = _ref$openable === void 0 ? true : _ref$openable,
      _ref$throwsOpenIndexE = _ref.throwsOpenIndexError,
      throwsOpenIndexError = _ref$throwsOpenIndexE === void 0 ? false : _ref$throwsOpenIndexE,
      _ref$resizePolicy = _ref.resizePolicy,
      resizePolicy = _ref$resizePolicy === void 0 ? RESIZE_POLICY.CONTENT : _ref$resizePolicy,
      _ref$buttonPlacementP = _ref.buttonPlacementPolicy,
      buttonPlacementPolicy = _ref$buttonPlacementP === void 0 ? BUTTON_PLACEMENT_POLICY.ALL : _ref$buttonPlacementP,
      _ref$buttonContainerP = _ref.buttonContainerPlacementPolicy,
      buttonContainerPlacementPolicy = _ref$buttonContainerP === void 0 ? BUTTON_CONTAINER_PLACEMENT_POLICY.OUTSIDE_CONTENT : _ref$buttonContainerP;

  // Type-checks
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  if (!(container instanceof HTMLElement)) {
    throw new Error('The gallery container must be a valid DOM element.');
  }

  if (buttonContainerSelector != null) {
    if (!BUTTON_PLACEMENT_POLICY[buttonPlacementPolicy]) {
      throw new Error('The specified button placement policy is not defined.');
    }

    if (!BUTTON_CONTAINER_PLACEMENT_POLICY[buttonContainerPlacementPolicy]) {
      throw new Error('The specified button container placement policy is not defined.');
    }
  }

  if (!RESIZE_POLICY[resizePolicy]) {
    throw new Error('The specified resize policy is not defined.');
  }

  if (buttonsOrder.length !== 3 || buttonsOrder.indexOf('prev') === -1 && buttonsOrder.indexOf('prev') === -1 && buttonsOrder.indexOf('close') === -1) {
    throw new Error("The given order doesn't include all the buttons.");
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
   * Object containing the CSS classes that get applied to the buttons of the overlay.
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
   * Object containing the CSS classes that get applied to the overlay.
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
   * @type {NodeList}
   *
   * @private
   */


  var figures = container.querySelectorAll('figure');
  /**
   * Caches the overlay when removed.
   *
   * @type {HTMLDialogElement|HTMLDivElement|null}
   *
   * @private
   */

  var dialogCache = null;
  /**
   * Contains the controls container.
   *
   * @type {HTMLElement|null}
   *
   * @private
   */

  var buttonContainer = null;
  /**
   * Represents the overlay element.
   *
   * @type {HTMLDialogElement|HTMLDivElement}
   *
   * @property {object} buttons - Contains the buttons contained in the overlay.
   * @property {HTMLElement} content - Contains the content container.
   * @method content.getContent() - Gets the content of overlay.content.
   *
   * @private
   *
   * @see createOverlay
   */

  var overlay = createOverlay();
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
    if (swipe && typeof SwipeEvent === 'function') {
      return new SwipeEvent({
        element: container,
        itemSelector: 'figure',
        activeSelector: currentSelector
      });
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
    containerClick: function containerClick() {
      if (!that.isOpen()) {
        that.open(null);
      }
    },
    figureClick: function figureClick(e) {
      e.stopImmediatePropagation();
      var figure = e.target;

      while (figure.tagName !== 'FIGURE') {
        figure = figure.parentNode;
      }

      that.set(figure).open(null);
    },
    dialogClick: function dialogClick(e) {
      e.stopImmediatePropagation();

      if (e.target.classList.contains(overlayClasses.overlay) && that.isOpen()) {
        that.close();
      }
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
    },
    buttons: createButtonsCallbacks()
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
    function updateImageSize() {
      var overlayContentStyle = overlay.content.currentStyle || window.getComputedStyle(overlay.content);
      var ratio = Math.min(1, (overlay.clientWidth - (parseFloat(overlayContentStyle.marginLeft) + parseFloat(overlayContentStyle.marginRight))) / image.naturalWidth, (overlay.clientHeight - (parseFloat(overlayContentStyle.marginTop) + parseFloat(overlayContentStyle.marginBottom))) / image.naturalHeight);

      if (resizePolicy.toUpperCase() === RESIZE_POLICY.CONTENT) {
        image.style.width = (image.naturalWidth || document.body.clientWidth) * ratio + 'px';
        image.style.height = (image.naturalHeight || document.body.clientHeight) * ratio + 'px';
      } else if (resizePolicy.toUpperCase() === RESIZE_POLICY.CONTAINER) {
        overlay.content.style.width = (image.naturalWidth || document.body.clientWidth) * ratio + 'px';
        overlay.content.style.height = (image.naturalHeight || document.body.clientHeight) * ratio + 'px';
      }
    }

    function resizeImage() {
      updateImageSize();
      image.removeEventListener('load', resizeImage);
    }

    if (overlay && image) {
      if (image.complete) {
        updateImageSize();
      } else {
        image.addEventListener('load', resizeImage);
      }
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

      if (resizePolicy.toUpperCase() === RESIZE_POLICY.CONTENT) {
        video.style.width = video.videoWidth * ratio + 'px';
        video.style.height = video.videoHeight * ratio + 'px';
      } else if (resizePolicy.toUpperCase() === RESIZE_POLICY.CONTAINER) {
        overlay.content.style.width = video.videoWidth * ratio + 'px';
        overlay.content.style.height = video.videoHeight * ratio + 'px';
      }
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

      if (resizePolicy.toUpperCase() === RESIZE_POLICY.CONTAINER) {
        overlay.content.style.width = embed.width * ratio + 'px';
        overlay.content.style.height = embed.height * ratio + 'px';
      }

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
   * Creates the overlay object or retrieves it from cache.
   * May return null if `openable` is `false`.
   *
   * @return {HTMLDialogElement|HTMLDivElement|null}
   *
   * @see dialogCache
   * @see overlay
   *
   * @private
   *
   * @throws Throws an error when the `buttonContainerSelector` is too complex.
   */


  function createOverlay() {
    if (openable) {
      if (dialogCache) {
        container.appendChild(dialogCache);
        return dialogCache;
      } // Takes interval if already exists


      var dialog = container.querySelector(overlaySelectors.overlay);

      if (!dialog) {
        // Initalizes overlay
        dialog = document.createElement('HTMLDialogElement' in window ? 'dialog' : 'div');
        dialog.classList.add(overlayClasses.overlay);
        dialog.content = document.createElement('div');
        dialog.content.classList.add(overlayClasses.content);
        dialog.appendChild(dialog.content);
      } // Takes buttons or creates them.


      dialog.buttons = {};

      buttonContainer = function () {
        if (buttonContainerSelector == null) {
          return null;
        }

        var tmp = dialog.querySelector(buttonContainerSelector);

        if (!tmp) {
          var selector = buttonContainerSelector.substr(1);
          tmp = document.createElement('div');

          if (buttonContainerSelector.charAt(0) === '#') {
            tmp.id = selector;
          } else if (buttonContainerSelector.charAt(0) === '.') {
            tmp.classList.add(selector);
          } else {
            throw new Error('buttonContainerSelector must be a class or an ID. Complex selector given.');
          }

          if (buttonContainerPlacementPolicy.toUpperCase() === BUTTON_CONTAINER_PLACEMENT_POLICY.OUTSIDE_CONTENT) {
            dialog.appendChild(tmp);
          } else if (buttonContainerPlacementPolicy.toUpperCase() === BUTTON_CONTAINER_PLACEMENT_POLICY.INSIDE_CONTENT) {
            dialog.content.appendChild(tmp);
          }
        }

        return tmp;
      }();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = buttonsOrder[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var type = _step2.value;
          var button = dialog.querySelector(buttonSelectors[type]);

          if (!button) {
            button = document.createElement('button');
            button.classList.add(buttonClasses[type]);
            button.innerHTML = buttonContents[type];

            if (buttonContainer === null) {
              dialog.appendChild(button);
            } else {
              if (buttonPlacementPolicy.toUpperCase() === BUTTON_PLACEMENT_POLICY.ALL) {
                buttonContainer.appendChild(button);
              } else {
                if (buttonPlacementPolicy.toUpperCase() === BUTTON_PLACEMENT_POLICY.NAVIGATORS_ONLY) {
                  if (type !== 'close') {
                    buttonContainer.appendChild(button);
                  } else {
                    dialog.appendChild(button);
                  }
                } else if (buttonPlacementPolicy.toUpperCase() === BUTTON_PLACEMENT_POLICY.CLOSE_ONLY) {
                  if (type === 'close') {
                    buttonContainer.appendChild(button);
                  } else {
                    dialog.appendChild(button);
                  }
                }
              }
            }
          }

          dialog.buttons[type] = button;
        } // Utility to get the content of the current figure.

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      dialog.getContent = function () {
        return dialog.content.querySelector('img, video, object, embed, iframe');
      };

      dialogCache = dialog;
      container.appendChild(dialogCache);
      return dialogCache;
    }

    return null;
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
   * @param {HTMLElement|Node} figure
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

      var currFigure = overlay.content.querySelector('figure');

      if (currFigure) {
        overlay.content.replaceChild(figureClone, currFigure);
      } else {
        if (overlay.content.firstChild) {
          overlay.content.insertBefore(figureClone, overlay.content.firstChild);
        } else {
          overlay.content.appendChild(figureClone);
        }
      }

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
   * @see getFigureIndex
   * @see KeepInBound
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
   * Creates the object that will containt the button callbacks.
   * Returns `null` if `overlay` doesn't exists.
   * Useful for caching.
   *
   * @return {object|null}
   *
   * @see overlay
   *
   * @private
   */


  function createButtonsCallbacks() {
    if (overlay) {
      var callbacks = {};

      var _arr = Object.keys(overlay.buttons);

      var _loop = function _loop() {
        var type = _arr[_i];

        callbacks[type] = function (e) {
          e.stopImmediatePropagation();
          that[type]();
        };
      };

      for (var _i = 0; _i < _arr.length; _i++) {
        _loop();
      }

      return callbacks;
    }

    return null;
  } // Event Listeners

  /**
   * Adds or removes all the event listeners to container.
   * Uses `createButtonsCallbacks()` to create the button callbacks and
   * appends them to `eventCallbacks`.
   *
   * @function
   *
   * @param {boolean} [forceFigures=false] Determines if the update must be forced.
   * Useful when MutationObserver isn't supported.
   *
   * @see createButtonsCallbacks
   * @see eventCallbacks
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
      }

      if (overlay) {
        overlay.addEventListener('click', eventCallbacks.dialogClick, false);
      } // Keyboard navigation


      document.addEventListener('keydown', eventCallbacks.keyboardNavigation); // Swipe navigation - since 1.1.0

      if (swipeHandler) {
        swipeHandler.attach();
        /**
         * @listens SwipeEvent#swipe
         * @see {@link https://github.com/dencreativityspace/swipe-event|SwipeEvent}
         */

        document.addEventListener('swipe', eventCallbacks.swipeNavigation);
      }

      window.addEventListener('resize', eventCallbacks.resize); // Binds the overlay buttons to the public methods

      if (overlay) {
        if (!eventCallbacks.buttons) {
          eventCallbacks.buttons = createButtonsCallbacks();
        }

        var _arr2 = Object.keys(overlay.buttons);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var type = _arr2[_i2];
          overlay.buttons[type].addEventListener('click', eventCallbacks.buttons[type], false);
        }
      }
    } else {
      container.removeEventListener('click', eventCallbacks.containerClick, false);

      if (overlay) {
        overlay.removeEventListener('click', eventCallbacks.dialogClick, false);
      }

      figures.forEach(function (figure) {
        figure.removeEventListener('click', eventCallbacks.figureClick, false);
      });
      document.removeEventListener('keydown', eventCallbacks.keyboardNavigation);

      if (swipeHandler) {
        swipeHandler.detach();
        document.removeEventListener('swipe', eventCallbacks.swipeNavigation);
      }

      window.removeEventListener('resize', eventCallbacks.resize);

      if (overlay) {
        var _arr3 = Object.keys(overlay.buttons);

        for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
          var _type = _arr3[_i3];

          overlay.buttons[_type].removeEventListener('click', eventCallbacks.buttons[_type], false);
        }
      }
    }

    return setListenersFn;
  }(true);
  /**
   * Will contain MutationObserver instance if supported.
   *
   * @constant
   * @type {MutationObserver|null}
   *
   * @private
   */


  var mutation = function () {
    if ('MutationObserver' in window) {
      var m = new MutationObserver(function (mutations) {
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
   * @emits FigureGallery#fig-gallery:opened
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
          throw new Error("The element #".concat(index, " cannot be found."));
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
      openedEvent = document.createEvent('fig-gallery:opened');
      openedEvent.initCustomEvent('fig-gallery:opened', false, false, {
        current: current,
        active: that.getActiveFigure()
      });
    } else {
      openedEvent = new CustomEvent('fig-gallery:opened', {
        detail: {
          current: current,
          active: that.getActiveFigure()
        }
      });
    }
    /**
     * Event triggered when the gallery gets opened.
     *
     * @event FigureGallery#fig-gallery:opened
     * @type {object}
     * @property {HTMLElement} current - Current active <figure> element in container.
     * @property {HTMLElement} active - Active <figure> element in overlay.
     */


    container.dispatchEvent(openedEvent);
    return _this;
  };
  /**
   * Shows the previous `<figure>`. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @emits FigureGallery#fig-gallery:prev
   *
   * @return  {this}
   */


  this.prev = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(-1, cycleState);
    var prevEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      prevEvent = document.createEvent('fig-gallery:prev');
      prevEvent.initCustomEvent('fig-gallery:prev', false, false, {
        current: current,
        next: oldCurrent,
        active: that.getActiveFigure()
      });
    } else {
      prevEvent = new CustomEvent('fig-gallery:prev', {
        detail: {
          current: current,
          next: oldCurrent,
          active: that.getActiveFigure()
        }
      });
    }
    /**
     * Event triggered when the gallery gets navigated to the previous element.
     *
     * @event FigureGallery#fig-gallery:prev
     * @type {object}
     * @property {HTMLElement} current - Current active <figure> element in container.
     * @property {HTMLElement} next - Old active <figure> element in container which succeeds the current.
     * @property {HTMLElement} active - Active <figure> element in overlay.
     */


    container.dispatchEvent(prevEvent);
    return _this;
  };
  /**
   * Shows the next `<figure>`. If the ovelay is closed, opens it.
   *
   * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
   *
   * @emits FigureGallery#fig-gallery:next
   *
   * @return  {this}
   */


  this.next = function () {
    var cycleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cycle;
    var oldCurrent = current;
    navigateOverlayFigure(1, cycleState);
    var nextEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      nextEvent = document.createEvent('fig-gallery:next');
      nextEvent.initCustomEvent('fig-gallery:next', false, false, {
        current: current,
        prev: oldCurrent,
        active: that.getActiveFigure()
      });
    } else {
      nextEvent = new CustomEvent('fig-gallery:next', {
        detail: {
          current: current,
          prev: oldCurrent,
          active: that.getActiveFigure()
        }
      });
    }
    /**
     * Event triggered when the gallery gets navigated to the next element.
     *
     * @event FigureGallery#fig-gallery:next
     * @type {object}
     * @property {HTMLElement} current - Current active <figure> element in container.
     * @property {HTMLElement} prev - Old active <figure> element in container which precedes the current.
     * @property {HTMLElement} active - Active <figure> element in overlay.
     */


    container.dispatchEvent(nextEvent);
    return _this;
  };
  /**
   * Sets the current `<figure>`.
   *
   * @param   {number|HTMLElement|Node}   figure   Index of the element or the
   *                                          element itself to bet setted as
   *                                          current.
   *
   * @emits FigureGallery#fig-gallery:setted
   *
   * @return  {this}
   *
   * @throws Will throw an error if the argument is null.
   * @throws Will throw an error if the argument isn't a child of the container.
   * @throws Will throw an error if `throwsOpenIndexError` is set to true and if the user tries to go beyond the end-points.
   * @throws Will throw an error if the argument isn't a valid element.
   */


  this.set = function (figure) {
    if (figure == null) {
      throw new Error('The given element is not a valid value. Please, insert an integer or a DOM element.');
    }

    if (typeof figure === 'number') {
      if (throwsOpenIndexError) {
        if (figure > figures.length - 1 || Math.abs(figure) > figures.length - 1) {
          throw new Error("The element #".concat(figure, " cannot be found."));
        }
      } else {
        figure = keepInBound(figure);
      }

      figure = figures[figure];
    } else if (figure instanceof HTMLElement) {
      if (getFigureIndex(figure) < 0) {
        throw new Error('The given element is not in this gallery.');
      }
    } else {
      throw new Error('The given element is not a valid value. Please, insert an integer or a DOM element.');
    }

    var oldCurrent = current;
    setCurrentFigure(figure);
    updateOverlayFigure();
    var settedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      settedEvent = document.createEvent('fig-gallery:setted');
      settedEvent.initCustomEvent('fig-gallery:setted', false, false, {
        current: current,
        old: oldCurrent,
        active: that.getActiveFigure()
      });
    } else {
      settedEvent = new CustomEvent('fig-gallery:setted', {
        detail: {
          current: current,
          old: oldCurrent,
          active: that.getActiveFigure()
        }
      });
    }
    /**
     * Event triggered when the gallery gets setted on a specific element.
     *
     * @event FigureGallery#fig-gallery:setted
     * @type {object}
     * @property {HTMLElement} current - Current active <figure> element in container.
     * @property {HTMLElement} old - Old active <figure> element in container.
     * @property {HTMLElement} active - Active <figure> element in overlay.
     */


    container.dispatchEvent(settedEvent);
    return _this;
  };
  /**
   * Closes the overlay.
   *
   * @emits FigureGallery#fig-gallery:closed
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

    container.classList.remove(openClass);
    var closedEvent = null;

    if (typeof window.CustomEvent !== 'function') {
      closedEvent = document.createEvent('fig-gallery:closed');
      closedEvent.initCustomEvent('fig-gallery:closed', false, false, {
        current: current
      });
    } else {
      closedEvent = new CustomEvent('fig-gallery:closed', {
        detail: {
          current: current
        }
      });
    }
    /**
     * Event triggered when the gallery gets closed.
     *
     * @event FigureGallery#fig-gallery:closed
     * @type {object}
     * @property {HTMLElement} current - Current active <figure> element in container.
     */


    container.dispatchEvent(closedEvent);
    return _this;
  };
  /**
   * Sets the gallery to be openable or not.
   *
   * @param   {boolean}   val
   *
   * @emits FigureGallery#fig-gallery:openablechange
   *
   * @return  {this}
   *
   * @throws Will throw an error if the argument is null or isn't a boolean.
   */


  this.setOpenable = function (val) {
    if (!val || typeof val !== 'boolean') {
      throw new Error('The value must be a boolean.');
    }

    if (val !== openable) {
      openable = val;

      if (val) {
        overlay = createOverlay();

        if (mutation) {
          mutation.observe(container, {
            childList: true
          });
        }
      } else {
        overlay = null;

        if (mutation) {
          mutation.disconnect();
        }

        if (overlay) {
          container.removeChild(overlay);
        }
      }

      setListeners();
      var openablechangeEvent = null;

      if (typeof window.CustomEvent !== 'function') {
        openablechangeEvent = document.createEvent('fig-gallery:openablechange');
        openablechangeEvent.initCustomEvent('fig-gallery:openablechange', false, false, {
          openable: val
        });
      } else {
        openablechangeEvent = new CustomEvent('fig-gallery:openablechange', {
          detail: {
            openable: val
          }
        });
      }
      /**
       * Event triggered when the gallery gets updated if openable or not.
       *
       * @event FigureGallery#fig-gallery:openablechange
       * @type {object}
       * @property {boolean} openable - Gets the current openable state.
       */


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
    figures = container.querySelectorAll('figure');

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
   * Returns the controls container element, if created.
   *
   * @return  {HTMLElement|null}
   */


  this.getControlsContainer = function () {
    return buttonContainer;
  };
  /**
   * Returns the current figure element outside of the overlay.
   *
   * @return  {HTMLElement|null}
   */


  this.getCurrentFigure = function () {
    return current;
  };
  /**
   * Returns the current figure element in the overlay.
   *
   * @return  {HTMLElement|null}
   */


  this.getActiveFigure = function () {
    if (overlay) {
      return overlay.content.querySelector('figure');
    }

    return null;
  };
  /**
   * Returns the content of the current figure element in the overlay.
   *
   * @return  {HTMLElement|null}
   */


  this.getActiveContent = function () {
    if (overlay) {
      return overlay.getContent();
    }

    return null;
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

window.BUTTON_CONTAINER_PLACEMENT_POLICY = {
  OUTSIDE_CONTENT: 'OUTSIDE_CONTENT',
  INSIDE_CONTENT: 'INSIDE_CONTENT'
};
Object.freeze(window.BUTTON_CONTAINER_PLACEMENT_POLICY);
window.BUTTON_PLACEMENT_POLICY = {
  ALL: 'ALL',
  NAVIGATORS_ONLY: 'NAVIGATORS_ONLY',
  CLOSE_ONLY: 'CLOSE_ONLY'
};
Object.freeze(window.BUTTON_PLACEMENT_POLICY);
window.RESIZE_POLICY = {
  CONTENT: 'CONTENT',
  CONTAINER: 'CONTAINER'
};
Object.freeze(window.RESIZE_POLICY);