const form = document.getElementById('contactForm');
const status = document.getElementById('contact-status');
let nextAttempt = 0;
let sending = false;

form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || form.elements._gotcha.value) return;
    if (Date.now() < nextAttempt) {
        status.textContent = 'Please wait 30 seconds before sending another message.';
        return;
    }
    const values = Object.fromEntries(new FormData(form));
    if (!values.name.trim() || !values.message.trim() || !form.reportValidity()) {
        status.textContent = 'Enter your name, a valid email address and a message.';
        return;
    }
    sending = true;
    nextAttempt = Date.now() + 30000;
    form.querySelector('[type=submit]').disabled = true;
    status.textContent = 'Sending…';
    try {
        const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!response.ok) throw new Error('Delivery failed');
        form.reset();
        status.textContent = 'Message sent. Thank you for getting in touch.';
    } catch {
        status.textContent = 'Delivery failed. Your message is still here. Try again in 30 seconds or use the email link.';
    } finally {
        sending = false;
        form.querySelector('[type=submit]').disabled = false;
    }
});
