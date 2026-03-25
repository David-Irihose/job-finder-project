var allJobs = [];

// ================= NAVIGATION =================
function showPage(pageId) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active-page');
  }

  var navLinks = document.querySelectorAll('.nav-item');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('active');
  }

  document.getElementById('page-' + pageId).classList.add('active-page');

  for (var i = 0; i < navLinks.length; i++) {
    if (navLinks[i].dataset.page === pageId) {
      navLinks[i].classList.add('active');
    }
  }

  window.scrollTo(0, 0);
}

var navItems = document.querySelectorAll('.nav-item');
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', function (e) {
    e.preventDefault();
    showPage(this.dataset.page);
  });
}
// ================= HERO SEARCH =================
function goToJobsFromHero() {
  var query = document.getElementById('heroSearch').value;
  if (query !== '') {
    document.getElementById('searchInput').value = query;
  }
  showPage('jobs');
  if (query !== '') {
    searchJobs();
  }
}