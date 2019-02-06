function FigureGallery({container = '#gallery', openSelector = '.open', currentSelector = '.current', buttonSelectors = {}, buttonContents = {}, cycle = true, overlaySelectors = {}, throwsOpenIndexError = false}) {
    // Type-checks
    if (typeof contaier === 'string') {
        container = document.querySelector(container);
    }

    if (!(container instanceof HTMLElement)) {
        throw new Error('Il contenitore della galleria deve essere un elemento valido.');
    }

    // Shorthand to easily reach `this`.
    const that = this;

    // Overlaps custom settings to default ones:
    buttonSelectors = Object.assign({ close: '.close', prev: '.prev', next: '.next' }, buttonSelectors);
    buttonContents = Object.assign({ close: '&times;', prev: '&lang;', next: '&rang;' }, buttonContents);

    overlaySelectors = Object.assign({ overlay: '.overlay', content: '.overlay-content' }, overlaySelectors);

    // Class mapping:
    const openClass = openSelector.substr(1);
    const currentClass = currentSelector.substr(1);

    const buttonClasses = {
        close: buttonSelectors.close.substr(1),
        prev: buttonSelectors.prev.substr(1),
        next: buttonSelectors.next.substr(1)
    };

    const overlayClasses = {
        overlay: overlaySelectors.overlay.substr(1),
        content: overlaySelectors.content.substr(1)
    }

    // Maps initial figures
    const figures = container.querySelectorAll('figure');

    // Sets default overlay
    let overlay = (() => {
        // Takes interval if already exists
        let dialog = container.querySelector('.overlay');

        if (!dialog) {
            // Initalizes overlay
            dialog = document.createElement((HTMLDialogElement) ? 'dialog' : 'div');
            dialog.classList.add(overlayClasses.overlay);

            dialog.content = document.createElement('div');
            dialog.content.classList.add(overlayClasses.content);

            dialog.appendChild(dialog.content);

            container.appendChild(dialog);
        }

        // Takes buttons or creates them
        dialog.buttons = {};

        for (const type in buttonSelectors) {
            let button = dialog.querySelector(buttonSelectors[type]);

            if (!button) {
                button = document.createElement('button');

                button.classList.add(buttonClasses[type]);
                button.innerHTML = buttonContents[type];

                dialog.appendChild(button);
            }

            dialog.buttons[type] = button;
        }

        // Utility to get the image of the current figure
        dialog.getImage = function () {
            return dialog.content.querySelector('img');
        }

        return dialog;
    })();

    // Takes the current image
    let current = (() => {
        for (const figure of figures) {
            if (figure.classList.contains(currentClass)) {
                return figure;
            }
        }
    })();

    function setImageSize(image) {
        console.log(image);

    // Private methods
    // Keeps `figures` index in bound.
    function keepInBound(index, cycleState = cycle) {
        return ((cycleState && index < 0) ? (figures.length + index) + figures.length : index) % figures.length;
    }

    // Sets the maximum image size.
    function setImageSize(image) {
        const ratio = Math.min(1, overlay.content.clientWidth / image.naturalWidth, overlay.content.clientHeight / image.naturalHeight);

        image.style.width = (image.naturalWidth * ratio) + 'px';
        image.style.height = (image.naturalHeight * ratio) + 'px';
    }

    // Gets the index of the given figure.
    function getFigureIndex(figure) {
        return Array.prototype.indexOf.call(figures, figure);
    }

    // Sets the current figure.
    function setCurrentFigure(figure) {
        if (current != null) {
            current.classList.remove(currentClass);
        }

        figure.classList.add(currentClass);
        current = figure;
    }

    // Event Listeners
    // Updates and opens the overlay.
    function updateOverlayFigure() {
        let figureClone = current.cloneNode(true);
        container.classList.add(openClass);

        if (HTMLDialogElement && overlay instanceof HTMLDialogElement) {
            overlay.setAttribute('open', true);
        }
        else {
            overlay.classList.add(openClass);
        }

        overlay.content.innerHTML = '';
        overlay.content.appendChild(figureClone);

        setImageSize(overlay.getImage());
    }

    function navigateOverlayFigure(dir = 1, cycleState = cycle) {
        setCurrentFigure(figures[keepInBound(getFigureIndex(current) + dir, cycleState)]);

        if (that.isOpen()) {
            updateOverlayFigure();
        }
    }

    const setListeners = (function setListenersFn(op) {
        if (op == null || typeof op !== 'boolean') {
            throw new Error('Il valore deve essere di tipo booleano.');
        }

        if (op) {
            if (openable) {
                // Click on the gallery
                container.addEventListener('click', eventCallbacks.containerClick, false);

                // Keyboard navigation
                document.addEventListener('keydown', eventCallbacks.keyboardNavigation);

                window.addEventListener('resize', eventCallbacks.resize);
            }
        }
        else {
            container.removeEventListener('click', eventCallbacks.containerClick, false);

            document.removeEventListener('keydown', eventCallbacks.keyboardNavigation);

            window.removeEventListener('resize', eventCallbacks.resize);
        }

        return setListenersFn;
    })(openable);


    // Binds the overlay buttons to the public methods
    for (const type of Object.keys(overlay.buttons)) {
        overlay.buttons[type].addEventListener('click', (e) => {
            e.stopImmediatePropagation();

            that[type]();
        }, false);
    }

    // Public methods

    /**
     * Opens the overlay to show the image with the given index.
     *
     * @param   {?number}   [index=0]   Index of the element to be shown.
     *                                  If is null gets the current figure.
     *
     * @return  {this}
    */
    this.open = (index = 0) => {
        if (index == null) {
            index = getFigureIndex(current);
        }
        else {
            index = parseInt(index);

            if (throwsOpenIndexError) {
                if (index > figures.length - 1 || Math.abs(index) > figures.length - 1) {
                    throw new Error(`L'oggetto ${index} non è disponibile.`);
                }
            }
            else {
                index = keepInBound(index);
            }
        }

        if (!that.isOpen() || figures[index] !== current) {
            setCurrentFigure(figures[index]);
            updateOverlayFigure();
        }

        return this;
    };

    /**
     * Shows the previous image. If the ovelay is closed, opens it.
     *
     * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
     *
     * @return  {this}
    */
    this.prev = (cycleState = cycle) => {
        navigateOverlayFigure(-1, cycleState);

        return this;
    };

    /**
     * Shows the next image. If the ovelay is closed, opens it.
     *
     * @param   {boolean}   [cycleState]   Determines if the counter must cycle.
     *
     * @return  {this}
    */
    this.next = (cycleState = cycle) => {
        navigateOverlayFigure(1, cycleState);

        return this;
    };

    /**
     * Sets the current figure.
     *
     * @param   {number|HTMLElement}   figure   Index of the element or the
     *                                          element itself to bet setted as
     *                                          current.
     *
     * @return  {this}
    */
    this.set = (figure) => {
        if (!figure) {
            throw new Error(`L'elemento indicato non è un valore valido. Inserire un numero intero o un elemento DOM.`);
        }

        if (typeof figure === 'number') {
            if (throwsOpenIndexError) {
                if (figure > figures.length - 1 || Math.abs(figure) > figures.length - 1) {
                    throw new Error(`L'oggetto ${figure} non è disponibile.`);
                }
            }
            else {
                figure = keepInBound(figure);
            }

            figure = figures[figure];
        }
        else if (figure instanceof HTMLElement) {
            if (getFigureIndex(figure) < 0) {
                throw new Error(`L'elemento indicato non fa parte di questa galleria.`);
            }
        }
        else {
            throw new Error(`L'elemento indicato non è un valore valido. Inserire un numero intero o un elemento DOM.`);
        }

        setCurrentFigure(figure);

        if (that.isOpen()) {
            updateOverlayFigure();
        }

        return this;
    };

    /**
     * Closes the overlay.
     *
     * @return  {this}
    */
    this.close = () => {
        if (HTMLDialogElement && overlay instanceof HTMLDialogElement) {
            overlay.setAttribute('open', false);
        }
        else {
            overlay.classList.remove(openClass);
        }

        container.classList.remove(openClass);

        return this;
    };

    for (const type of Object.keys(overlay.buttons)) {
        overlay.buttons[type].addEventListener('click', (e) => {
            e.stopImmediatePropagation();

            that[type]();
        }, false);
    }

    /**
     * Tells if the the overlay is open or not.
     *
     * @return  {boolean}
    */
    this.isOpen = () => {
        return container.classList.contains(openClass);
    }
    /**
     * Returns the current figure element.
     *
     * @return  {HTMLElement}
    */
    this.getCurrentFigure = () => {
        return current;
    }
}
