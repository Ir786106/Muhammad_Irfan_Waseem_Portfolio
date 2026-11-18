export const profile = {
    linkedin: 'https://www.linkedin.com/in/muhammad-irfan-waseem-48226b297/',
    email: 'muhammadirfan.infosec@gmail.com'
};

for (const link of document.querySelectorAll('[data-profile]')) {
    link.href = link.dataset.profile === 'linkedin' ? profile.linkedin : 'mailto:' + profile.email;
}
