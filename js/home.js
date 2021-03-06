let projects = [];

function closeModal() {
  document.querySelector('.modal_overlay').classList.add('ds_none');
  document.querySelector('.send_message_modal').classList.add('ds_none');
  document.querySelector('.project_modal').classList.add('ds_none');
}

function renderProjectInModal(projectIndex) {
  const project = projects[projectIndex];

  document.querySelector('.project_modal').innerHTML = `
    <div class="project_modal_img">
      <img src="${project.image}" alt="${project.title}">
    </div>
    <div class="project_modal_details">
      <div class="project_modal_details_title">
        <h3>${project.title}</h3>
        <span class="created_at">
          ${project.created_at}
        </span>
      </div>
      <div class="project_modal_details_content">
        <p>${project.description}</p>
        <ul>
          ${project.skills}
        </ul>
      </div>
      <div class="project_modal_details_footer">
        <a 
          class="btn_run" 
          target="_blank" 
          href="${project.url_to_run}"
          ${project.url_to_run == "" ? "onclick='return false;' title='Indisponível' disabled='true'" : ""}
        >
          <i class="far fa-play-circle"></i>&nbsp;Executar
        </a>
        <a 
          class="btn_src" 
          target="_blank" 
          href="${project.url_src}"
          ${project.url_src == "" ? "onclick='return false;' title='Indisponível' disabled='true'" : ""}
        >
          <i class="fas fa-code"></i>&nbsp;Código-fonte
        </a>
      </div>
    </div>
    
      <span 
        class="btn_previous_project" 
        ${projectIndex > 0 ? `onclick="renderProjectInModal(${projectIndex - 1})"` : 'disabled="true"'}>
        <i class="fas fa-chevron-left"></i>
      </span>
    
      <span
        class="btn_next_project"
        ${projectIndex < projects.length - 1 ? `onclick="renderProjectInModal(${projectIndex + 1})"` : 'disabled="true"'}>
        <i class="fas fa-chevron-right"></i>
      </span>
  `;
}

fetch('./js/projects.json')
  .then(response => response.json())
  .then(data => {
    projects = data.map(project => ({
      ...project,
      image: project.image || 'assets/images/default.webp',
      created_at: new Date(project.created_at).toLocaleString([], { year: 'numeric', month: 'long' }),
      skills: project.skills.split(',').map(skill => `<li>${skill}</li>`).join('')
    }));

    const projectsHTML = document.querySelector('.container_main_projects ul');

    projectsHTML.innerHTML = projects.reduce((html, project) => {
      return html += `
        <li class="container_main_projects_card" data-id="${project.id}">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <div class="container_main_projects_card_details">
            <div class="container_main_projects_card_details_title">
              <h3>${project.title}</h3>
              <span class="created_at">
                ${project.created_at}
              </span>
            </div>
            <p>${project.description}</p>
            <ul>
              ${project.skills}
            </ul>
          </div>
        </li>
      `;
    }, '');

    document.querySelectorAll('.container_main_projects_card').forEach(card => {
      card.addEventListener('click', function () {
        const projectId = this.getAttribute('data-id');
        let projectIndex = projects.findIndex(project => project.id == projectId);

        renderProjectInModal(projectIndex);
        document.querySelector('.modal_overlay').classList.remove('ds_none');
        document.querySelector('.project_modal').classList.remove('ds_none');
      })
    });
  });

document.querySelector('.btn_close_modal').addEventListener('click', closeModal);

document.querySelector('.modal_overlay').addEventListener('click', function (event) {
  if (event.target.className === 'modal_overlay') {
    closeModal();
  }
});

document.querySelector('.btn_open_send_message_modal').addEventListener('click', function () {
  document.querySelector('.modal_overlay').classList.remove('ds_none');
  document.querySelector('.send_message_modal').classList.remove('ds_none');
});

document.querySelector('body').addEventListener('keydown', function (event) {
  if ((event.keyCode || event.which) == 27) {
    closeModal();
  }
  if ((event.keyCode || event.which) == 37) {
    document.querySelector('.btn_previous_project').click();
  }
  if ((event.keyCode || event.which) == 39) {
    document.querySelector('.btn_next_project').click();
  }
});

document.querySelector('.btn_send_message').addEventListener('click', function (event) {
  event.preventDefault();

  const status = {
    200: '<span class="success">Sua mensagem foi enviada com sucesso!</span>',
    400: '<span class="error">E-mail inválido ou nome e mensagem vazios!</span>',
    500: '<span class="error">Desculpe. Ocorreu um erro ao tentar enviar sua mensagem!</span>'
  };

  const messageStatus = document.querySelector('.message_status');

  messageStatus.innerText = 'Aguarde...';
  messageStatus.classList.remove('ds_none');

  const sendMessageForm = document.forms.sendMessageForm;

  fetch("https://wellysonvie-portfolio-api.herokuapp.com/api/contact", {
    method: "POST",
    body: new FormData(sendMessageForm)
  }).then(response => {
    messageStatus.innerHTML = status[response.status];
    if (response.status === 200) {
      sendMessageForm.name.value = '';
      sendMessageForm.email.value = '';
      sendMessageForm.message.value = '';
    }
  }).catch(error => {
    messageStatus.innerHTML = status[500];
  });
});