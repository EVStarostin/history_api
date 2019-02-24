document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleDOMContentLoaded() {
    const modal = new Modal();

    document.getElementById('showModalBtn').onclick = () => {
        modal.open();
    }
}

class Modal {
    constructor() {
        this._element = document.getElementById('modal');
        this._backdrop = document.createElement('div');
        this._backdrop.className = 'modal__backdrop';
        this._closeElements = this._element.getElementsByClassName('modal__close');

        this._handleFocusLock = this._handleFocusLock.bind(this);

        this.init();
    }

    init() {
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

        this._element.addEventListener('click', handleBackdropClick);
    }

    open() {
        const handleModalShowing = () => {
            this._element.style.display = 'block';
            document.body.offsetHeight; // force repaint
            this._element.focus();
            this._element.classList.add('modal--show');
            this._backdrop.removeEventListener('transitionend', handleModalShowing);
        };

        document.addEventListener('focus', this._handleFocusLock, true);
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
            this._element.style.display = 'none';
            this._backdrop.removeEventListener('transitionend', handleBackdropHiding);
        }

        const handleModalHiding = (e) => {
            if (e.target === this._element) {
                this._backdrop.classList.remove('modal__backdrop--open');
                this._backdrop.addEventListener('transitionend', handleBackdropHiding);
                this._element.removeEventListener('transitionend', handleModalHiding);
            }
        };

        document.removeEventListener('focus', this._handleFocusLock, true);

        this._element.classList.remove('modal--show');
        this._element.addEventListener('transitionend', handleModalHiding);
    }

    _handleFocusLock(e) {
        if (document !== e.target && this._element !== e.target && !this._element.contains(e.target)) {
            this._element.focus();
        }
    }
}