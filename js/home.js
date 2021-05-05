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

document.querySelector('.btn_close_modal').addEventListener('click', function () {
  document.querySelector('.modal_overlay').classList.add('ds_none');
});

document.querySelector('.btn_open_send_message_modal').addEventListener('click', function () {
  document.querySelector('.modal_overlay').classList.remove('ds_none');
  document.querySelector('.send_message_modal').classList.remove('ds_none');
});

