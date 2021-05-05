fetch('./js/projects.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const projects = document.querySelector('.container_main_projects ul');

    projects.innerHTML = data.reduce((html, project) => {
      return html += `
        <li class="container_main_projects_card">
          <img src="${project.image || 'assets/images/default.png'}" alt="${project.title}">
          <div class="container_main_projects_card_details">
            <div class="container_main_projects_card_details_title">
              <h3>${project.title}</h3>
              <span class="created_at">
                ${new Date(project.created_at).toLocaleString([], { year: 'numeric', month: 'long' })}
              </span>
            </div>
            <p>${project.description}</p>
            <ul>
              ${project.skills.split(',').map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
        </li>
      `;
    }, '');
  });

