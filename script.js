document.getElementById('universityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const countryInput = document.getElementById('country').value.trim();
    const resultDiv = document.getElementById('result');
    const paginationNav = document.getElementById('paginationNav');
    resultDiv.innerHTML = '';
    paginationNav.style.display = 'none';

    fetch(`http://universities.hipolabs.com/search?country=${countryInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayUniversities(data, 1);
                setupPagination(data);
            } else {
                resultDiv.innerHTML = `<div class="alert alert-danger">No university found for the country "${countryInput}"</div>`;
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<div class="alert alert-danger">An error occurred: ${error.message}</div>`;
        });
});

function displayUniversities(data, page) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const universitiesToShow = data.slice(startIndex, endIndex);

    universitiesToShow.forEach(university => {
        resultDiv.innerHTML += `
            <div class="university-info mb-3">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">${university.name}</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Country:</strong> ${university.country}</p>
                        ${university['state-province'] ? `<p><strong>State/Province:</strong> ${university['state-province']}</p>` : ''}
                        <p><strong>Web Pages:</strong> ${university.web_pages.map(page => `<a href="${page}" target="_blank" class="badge badge-primary">${page}</a>`).join(' ')}</p>
                        <p><strong>Domains:</strong> ${university.domains.map(domain => `<span class="badge badge-secondary">${domain}</span>`).join(' ')}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

function setupPagination(data) {
    const paginationNav = document.getElementById('paginationNav');
    paginationNav.style.display = 'block';
    const paginationUl = document.querySelector('.pagination');
    paginationUl.innerHTML = '';
    const itemsPerPage = 10;
    const pageCount = Math.ceil(data.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', function(event) {
            event.preventDefault();
            displayUniversities(data, i);
            document.querySelector('.page-item.active')?.classList.remove('active');
            li.classList.add('active');
        });
        paginationUl.appendChild(li);
    }
    paginationUl.firstChild.classList.add('active');
}
