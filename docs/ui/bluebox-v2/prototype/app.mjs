const tabs = document.querySelectorAll('.tab');
const views = {
  tonight: document.getElementById('view-tonight'),
  morning: document.getElementById('view-morning'),
  validation: document.getElementById('view-validation')
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    Object.values(views).forEach(v => v.classList.remove('is-active'));
    views[tab.dataset.tab].classList.add('is-active');
  });
});

const drawer = document.getElementById('zone-drawer');
const closeDrawer = document.getElementById('close-drawer');
document.querySelectorAll('.zone').forEach(zone => {
  zone.addEventListener('click', () => {
    document.getElementById('drawer-zone-title').textContent = zone.dataset.zone;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  });
});
closeDrawer.addEventListener('click', () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
});

document.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

