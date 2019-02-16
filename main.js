document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleDOMContentLoaded() {
    const modal = new Modal();

    document.getElementById('showModalBtn').onclick = () => {
        modal.open();
    }
}

class Modal {
    constructor() {
        this.node = document.getElementById('modal');
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal__backdrop';
        this.closeElements = this.node.getElementsByClassName('modal__close');

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

        for (let i = 0; i < this.closeElements.length; i++) {
            const element = this.closeElements[i];
            element.addEventListener('click', handleCloseElementsClick);
        }

        this.node.addEventListener('click', handleBackdropClick);
    }

    open() {
        const handleModalShowing = () => {
            this.node.style.display = 'block';
            document.body.offsetHeight; // force repaint
            this.node.classList.add('modal--show');
            this.backdrop.removeEventListener('transitionend', handleModalShowing);
        };

        document.body.classList.add('modal-open');
        
        document.body.appendChild(this.backdrop);
        document.body.offsetHeight; // force repaint
        this.backdrop.classList.add('modal__backdrop--open');
        this.backdrop.addEventListener('transitionend', handleModalShowing);
    }

    close() {
        const handleBackdropHiding = () => {
            document.body.removeChild(this.backdrop);
            document.body.classList.remove('modal-open');
            this.node.style.display = 'none';
            this.backdrop.removeEventListener('transitionend', handleBackdropHiding);
        }

        const handleModalHiding = (e) => {
            if (e.target === this.node) {
                this.backdrop.classList.remove('modal__backdrop--open');
                this.backdrop.addEventListener('transitionend', handleBackdropHiding);
                this.node.removeEventListener('transitionend', handleModalHiding);
            }
        };

        this.node.classList.remove('modal--show');
        this.node.addEventListener('transitionend', handleModalHiding);
    }
}