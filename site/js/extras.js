export function initExtras() {
  const command = document.querySelector('#commands');
  const search = command.querySelector('input');
  const shortcuts = [...command.querySelectorAll('li')];
  const trigger = document.querySelector('#command-open');
  function openCommands() {
    if (command.open || document.querySelector('dialog[open]')) return;
    search.value = '';
    shortcuts.forEach(item => item.hidden = false);
    command.showModal();
    search.focus();
  }
  trigger.onclick = openCommands;
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommands();
    }
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    shortcuts.forEach(item => item.hidden = !item.textContent.toLowerCase().includes(query));
  });
  command.addEventListener('click', event => {
    if (event.target.closest('a,.close')) command.close();
  });
  search.addEventListener('keydown', event => {
    if (event.key === 'Enter') shortcuts.find(item => !item.hidden)?.querySelector('a').click();
  });
}
