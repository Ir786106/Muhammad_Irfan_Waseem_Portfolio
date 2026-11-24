export function initGitHub() {
  const section = document.querySelector('#github');
  const status = document.createElement('p');
  status.setAttribute('role','status');
  section.append(status);
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    status.textContent = 'Checking recent public repositories…';
    try {
      const response = await fetch('https://api.github.com/users/Ir786106/repos?type=owner&sort=pushed&per_page=6',{signal:AbortSignal.timeout(6000)});
      if (!response.ok) throw Error('GitHub unavailable');
      const repositories = await response.json();
      if (!Array.isArray(repositories) || !repositories.length) throw Error('No results');
      const list = document.createElement('ul');
      list.className = 'credential-links';
      for (const repo of repositories) {
        if (typeof repo.name !== 'string' || !/^[A-Za-z0-9_.-]+$/.test(repo.name)) continue;
        const entry = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = 'https://github.com/Ir786106/'+encodeURIComponent(repo.name);
        anchor.textContent = repo.name+(repo.language?' · '+repo.language:'')+' ↗';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        entry.append(anchor);
        if (repo.pushed_at && Number.isFinite(Date.parse(repo.pushed_at))) {
          const detail = document.createElement('small');
          detail.className = 'github-detail';
          detail.textContent = 'Updated '+new Date(repo.pushed_at).toLocaleDateString('en-GB');
          entry.append(detail);
        }
        list.append(entry);
      }
      if (!list.children.length) throw Error('No valid results');
      status.textContent = 'Recently updated public repositories · Checked '+new Date().toLocaleDateString('en-GB');
      status.after(list);
    } catch {
      status.textContent = 'Live GitHub activity unavailable. Use the profile link to browse repositories.';
    }
  },{rootMargin:'200px'});
  observer.observe(section);
}
