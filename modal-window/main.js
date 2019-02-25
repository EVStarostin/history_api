document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleDOMContentLoaded() {
    const modalNode = document.getElementById('modal');
    const modal = new Modal(modalNode);

    document.getElementById('showModalBtn').onclick = () => {
        modal.open();
    }
}

class Focus {
    constructor(elem) {
        this._elem = elem;
        this._isLocked = false;
        this._handleFocus = this._handleFocus.bind(this);
    }

    lockFocus() {
        if (this._isLocked) return;
        this._isLocked = true;
        document.addEventListener('focus', this._handleFocus, true);
    }

    unlockFocus() {
        if (!this._isLocked) return; 
        this._isLocked = false;
        document.removeEventListener('focus', this._handleFocus, true);
    }

    _handleFocus(e) {
        if (document !== e.target && this._elem !== e.target && !this._elem.contains(e.target)) {
            this._elem.focus();
        }
    }
}

class Modal extends Focus {
    constructor(modalNode) {
        super(modalNode);

        this._modal = modalNode;
        this._backdrop = document.createElement('div');
        this._backdrop.className = 'modal__backdrop';
        this._closeElements = this._modal.getElementsByClassName('modal__close');

        this._initCloseElements();
    }

    _initCloseElements() {
        const handleCloseElementsClick = () => {
            this.close();
        }

        const handleBackdropClick = (e) => {
            const modalDialog = document.querySelector('.modal__dialog');

            if (modalDialog.contains(e.target)) {
                return;
            } else {
                this.close();
            }
        }

        for (let i = 0; i < this._closeElements.length; i++) {
            const element = this._closeElements[i];
            element.addEventListener('click', handleCloseElementsClick);
        }

        this._modal.addEventListener('click', handleBackdropClick);
    }

    open() {
        const handleModalShowing = () => {
            this._modal.style.display = 'block';
            document.body.offsetHeight; // force repaint
            this._modal.focus();
            this._modal.classList.add('modal--show');
            this._backdrop.removeEventListener('transitionend', handleModalShowing);
        };

        this.lockFocus();
        document.body.classList.add('modal-open');
        
        document.body.appendChild(this._backdrop);
        document.body.offsetHeight; // force repaint
        this._backdrop.classList.add('modal__backdrop--open');
        this._backdrop.addEventListener('transitionend', handleModalShowing);
    }

    close() {
        const handleBackdropHiding = () => {
            document.body.removeChild(this._backdrop);
            document.body.classList.remove('modal-open');
            this._modal.style.display = 'none';
            this._backdrop.removeEventListener('transitionend', handleBackdropHiding);
        }

        const handleModalHiding = (e) => {
            if (e.target === this._modal) {
                this._backdrop.classList.remove('modal__backdrop--open');
                this._backdrop.addEventListener('transitionend', handleBackdropHiding);
                this._modal.removeEventListener('transitionend', handleModalHiding);
            }
        };

        this.unlockFocus();

        this._modal.classList.remove('modal--show');
        this._modal.addEventListener('transitionend', handleModalHiding);
    }
}