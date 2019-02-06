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

        const ratio = Math.min(1, overlay.content.clientWidth / image.naturalWidth, overlay.content.clientHeight / image.naturalHeight);

        overlay.content.width = (image.naturalWidth * ratio) + 'px';
        overlay.content.height = (image.naturalHeight * ratio) + 'px';

        console.log(ratio);
    }

    function setItem(figure) {
        if (current) {
            current.classList.remove(currentClass);
        }

        figure.classList.add(currentClass);
        current = figure;

        let fig = current.cloneNode(true);
        let img = fig.querySelector('img');

        container.classList.add(openClass);

        if (HTMLDialogElement && overlay instanceof HTMLDialogElement) {
            overlay.setAttribute('open', true);
        }
        else {
            overlay.classList.add(openClass);
        }

        for (const child of overlay.content.children) {
            overlay.content.removeChild(child);
        }

        overlay.content.appendChild(fig);

        setImageSize(img);
    }

    function keepInBound(index, cycleState = cycle) {
        return ((cycleState && index < 0) ? (figures.length + index) + figures.length : index) % figures.length;
    }

    function getItemIndex(item) {
        return Array.prototype.indexOf.call(figures, item);
    }

    container.addEventListener('click', (e) => {
        if (!that.isOpen()) {
            that.open(null);
        }
    }, false);

    document.addEventListener('keydown', (e) => {
        if (that.isOpen()) {
            const key = e.which || e.keyCode || 0;

            switch (key) {
                case 27:
                    this.close();
                    break;
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                case 36:
                    this.open(0);
                    break;
                case 35:
                    this.open(-1);
                    break;
            }
        }
    });

    const setOverlayImageSize = (overlay) => {
        return () => {
            setImageSize(overlay.content.querySelector('img'));
        };
    }

    // Public methods
    overlay.content.addEventListener('resize', setOverlayImageSize(overlay));

    this.open = (item = 0) => {
        if (item == null) {
            item = getItemIndex(current);
        }
        else {
            if (throwsOpenIndexError) {
                if (item > figures.length - 1 || Math.abs(item) > figures.length - 1) {
                    throw new Error(`L'oggetto ${item} non è disponibile.`);
                }
            }
            else {
                item = keepInBound(item);
            }
        }

        if (!that.isOpen() || figures[item] !== current) {
            setItem(figures[item]);
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
        setItem(figures[keepInBound(getItemIndex(current) - 1, cycleState)]);

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
        setItem(figures[keepInBound(getItemIndex(current) + 1, cycleState)]);

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
        if (!figure || !(figure instanceof HTMLElement)) {
            throw new Error(`L'elemento indicato non è un elemeno DOM valido.`);
        }

        if (getItemIndex(figure) < 0) {
            throw new Error(`L'elemento indicato non fa parte di questa galleria.`);
        }

        setItem(figure);

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
}
