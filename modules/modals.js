let galleryTrigger;
const lightbox = document.getElementById('lightbox');
for (const trigger of document.querySelectorAll('.gal-item')) {
    trigger.addEventListener('click', () => {
        galleryTrigger = trigger;
        const image = trigger.querySelector('img');
        Object.assign(document.getElementById('lb-img'), {src:image.src, alt:image.alt, width:image.width, height:image.height});
        document.getElementById('lb-title').textContent = image.alt;
        lightbox.showModal();
    });
}
for (const popup of [lightbox, document.getElementById('modal-feedback')]) {
    popup.querySelector('button').addEventListener('click', () => popup.close());
    popup.addEventListener('click', event => { if (event.target === popup) popup.close(); });
}


// Cycle focus inside each dialog, including when its content changes.
for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const items = [...dialog.querySelectorAll('button, a[href], select, textarea')].filter(
            item => !item.disabled && item.getClientRects().length
        );
        if (!items.length) return;
        const boundary = event.shiftKey ? items[0] : items.at(-1);
        if (document.activeElement === boundary) {
            event.preventDefault();
            (event.shiftKey ? items.at(-1) : items[0]).focus();
        }
    });
}

lightbox.addEventListener('close', () => {
    if (document.activeElement === document.body && !document.querySelector('dialog[open]')) galleryTrigger?.focus();
});
