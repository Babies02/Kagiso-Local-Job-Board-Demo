let jobs = JSON.parse(localStorage.getItem('jobs')) || [];

function saveJobs() {
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

function renderJobs() {
  const jobsDiv = document.getElementById('jobs');
  if (!jobsDiv) return;
  jobsDiv.innerHTML = '';
  jobs.forEach((job, index) => {
    if (job.reports >= 3) return; // skip reported out jobs
    const card = document.createElement('div');
    card.className = 'job-card';
    let statusText = job.filled ? "<b>Status:</b> Filled" : "<b>Status:</b> Open";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <p><b>Contact:</b> <a href="${parseContact(job.contact)}">${job.contact}</a></p>
      <p><b>Category:</b> ${job.category} | <b>Area:</b> ${job.area}</p>
      <p><b>Posted:</b> ${new Date(job.timestamp).toLocaleDateString()}</p>
      <p>${statusText}</p>
      <button onclick="reportJob(${index})">Report as Filled</button>
    `;
    jobsDiv.appendChild(card);
  });
}

function parseContact(contact) {
  if (/^\d{10,}$/.test(contact.replace(/\D/g, ''))) {
    return `tel:${contact}`;
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return `mailto:${contact}`;
  }
  return '#';
}

document.getElementById('jobForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const job = {
    title: form.title.value,
    description: form.description.value,
    contact: form.contact.value,
    category: form.category.value,
    area: form.area.value,
    timestamp: Date.now(),
    reports: 0,
    filled: false
  };
  jobs.push(job);
  saveJobs();
  form.reset();
  renderJobs();
});

function reportJob(index) {
  jobs[index].reports++;
  saveJobs();
  renderJobs();
}

function renderAdminJobs() {
  const tbody = document.getElementById('adminJobsTable');
  if (!tbody) return;
  tbody.innerHTML = '';
  jobs.forEach((job, i) => {
    let row = `<tr>
      <td>${job.title}</td>
      <td>${job.description}</td>
      <td>${job.contact}</td>
      <td>${job.category}</td>
      <td>${job.area}</td>
      <td>${new Date(job.timestamp).toLocaleDateString()}</td>
      <td>${job.filled ? "Filled" : "Open"}</td>
      <td>${job.reports}</td>
      <td>
        <button onclick="toggleFilled(${i})">${job.filled ? "Reopen" : "Mark Filled"}</button>
        <button onclick="deleteJob(${i})">Delete</button>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function toggleFilled(index) {
  jobs[index].filled = !jobs[index].filled;
  saveJobs();
  renderJobs();
  renderAdminJobs();
}

function deleteJob(index) {
  if (confirm("Are you sure you want to delete this job?")) {
    jobs.splice(index, 1);
    saveJobs();
    renderJobs();
    renderAdminJobs();
  }
}

// Auto remove after 20 days
jobs = jobs.filter(job => (Date.now() - job.timestamp) < (20 * 24 * 60 * 60 * 1000));
saveJobs();

// Dark mode
document.getElementById('toggleDarkMode')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

renderJobs();
