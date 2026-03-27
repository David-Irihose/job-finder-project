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
// Main function: fetches jobs from API and displays them
async function searchJobs() {
  var query = document.getElementById('searchInput').value;
  var resultsDiv = document.getElementById('results');

  if (query === '') {
    resultsDiv.innerHTML =
      '<p style="text-align:center;color:#f59e0b;">Please enter a job title.</p>';
    return;
  }

  resultsDiv.innerHTML =
    '<p style="text-align:center;color:#6b7280;">Searching jobs...</p>';

  try {
    var url =
      'https://remotive.com/api/remote-jobs?search=' +
      encodeURIComponent(query);

    var response = await fetch(url);

    // Handle API response errors (e.g., 404, 500)
    if (!response.ok) {
      throw new Error('API Error: ' + response.status);
    }

    var data = await response.json();
    allJobs = data.jobs || [];

    if (allJobs.length === 0) {
      resultsDiv.innerHTML =
        '<p style="text-align:center;color:#f59e0b;">No jobs found for "' +
        query + '". Try a different keyword.</p>';
      return;
    }

    fillCompanyDropdown(allJobs);
    showJobs();

  } catch (error) {
    var message = '';
    if (error.message.includes('Failed to fetch')) {
      message = 'No internet connection. Please check your network and try again.';
    } else if (error.message.includes('API Error')) {
      message = 'The job server is having trouble right now. Please try again later.';
    } else {
      message = 'Something went wrong. Please try again later.';
    }
    resultsDiv.innerHTML =
      '<p style="text-align:center;color:red;">' + message + '</p>';
  }
}

function searchByCategory(category) {
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = category;
    showPage('jobs');
    searchJobs();
  }
}

// ================= COMPANY FILTER =================
function fillCompanyDropdown(jobs) {
  var companySelect = document.getElementById('companyFilter');
  var companies = [];

  for (var i = 0; i < jobs.length; i++) {
    var name = jobs[i].company_name || '';

    if (name && companies.indexOf(name) === -1) {
      companies.push(name);
    }
  }

  companies.sort();

  companySelect.innerHTML = '<option value="">All Companies</option>';

  for (var i = 0; i < companies.length; i++) {
    var option = document.createElement('option');
    option.value = companies[i];
    option.textContent = companies[i];
    companySelect.appendChild(option);
  }
}
// ================= FILTER + SORT =================
document.getElementById('companyFilter').addEventListener('change', showJobs);
document.getElementById('sortFilter').addEventListener('change', showJobs);

function showJobs() {
  var resultsDiv = document.getElementById('results');
  var companyFilter = document.getElementById('companyFilter').value;
  var sortFilter = document.getElementById('sortFilter').value;

  resultsDiv.innerHTML = '';

  if (allJobs.length === 0) {
    resultsDiv.innerHTML =
      '<p style="text-align:center;color:#6b7280;">No jobs found. Try a different keyword.</p>';
    return;
  }

  
  var filtered = [];

  for (var i = 0; i < allJobs.length; i++) {
    var job = allJobs[i];

    var companyName = job.company_name || 'Unknown';

    var companyOk =
      companyFilter === '' || companyName === companyFilter;

    if (companyOk) {
      filtered.push(job);
    }
  }

  // SORTING
  if (sortFilter === 'title') {
    filtered.sort(function (a, b) {
      return (a.title || '').localeCompare(b.title || '');
    });
  } else if (sortFilter === 'company') {
    filtered.sort(function (a, b) {
      return (a.company_name || '').localeCompare(b.company_name || '');
    });
  }

  if (filtered.length === 0) {
    resultsDiv.innerHTML =
      '<p style="text-align:center;color:#6b7280;">No matching jobs found. Try different filters or keywords.</p>';
    return;
  }

  // Display the number of results found
  var resultCount = document.createElement('div');
  resultCount.style.textAlign = 'center';
  resultCount.style.padding = '10px';
  resultCount.style.marginBottom = '15px';
  resultCount.style.fontWeight = '700';
  resultCount.style.color = '#172e68';
  resultCount.innerHTML = filtered.length + ' ' + (filtered.length === 1 ? 'job' : 'jobs') + ' found';
  resultsDiv.appendChild(resultCount);

  // DISPLAY JOBS
  for (var i = 0; i < filtered.length; i++) {
    var job = filtered[i];

    var card = document.createElement('div');
    card.classList.add('job-card');

    card.innerHTML =
      '<h3>' + job.title + '</h3>' +
      '<p><b>Company:</b> ' + (job.company_name || 'Unknown') + '</p>' +
      '<p><b>Location:</b> ' + (job.candidate_required_location || 'Remote') + '</p>' +
      '<a href="' + job.url + '" target="_blank">Apply Now</a>';

    resultsDiv.appendChild(card);
  }
}

// ================= CONTACT =================
function submitContact(e) {
  e.preventDefault();
  document.querySelector('.contact-form').style.display = 'none';
  document.getElementById('contactConfirm').style.display = 'block';
}