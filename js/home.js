$(document).ready(function () {
    $('.menu_mobile_icon').on('click', function () {
        $('.menu_mobile_submenu').toggleClass('ds_none');
    });

    $('.menu_mobile_submenu').on('click', function () {
        $(this).addClass('ds_none');
    });

    $("body").mouseup(function (e) {
        const $menu_mobile_submenu = $(".menu_mobile_submenu");
        const $menu_mobile_icon = $(".menu_mobile_icon");
        const $project_modal = $(".project_modal");
        const $project_modal_content = $(".project_modal_content");

        if (!$menu_mobile_submenu.is(e.target) && $menu_mobile_submenu.has(e.target).length === 0
            && !$menu_mobile_icon.is(e.target) && $menu_mobile_icon.has(e.target).length === 0
            && !$project_modal_content.is(e.target) && $project_modal_content.has(e.target).length === 0) {
            if ($menu_mobile_submenu.is(':visible'))
                $menu_mobile_submenu.addClass('ds_none');
            if ($project_modal.is(':visible'))
                $project_modal.removeClass('active');
        }
    });

    const baseUrl = "https://portifolio-api.herokuapp.com/api";
    let portifolioList = [];

    $.get({ url: baseUrl + '/projects' }, function (data) {
        portifolioList = data;
        portifolioList.forEach((item, index) => {
            addCardPortifolio(getItemProject(index), index);
        });

        $(".show_modal").on('click', function () {
            showModal($(this));
        });
    }).fail(function () {
        $(".main_portifolio_content_list").html('<p>Erro ao carregar projetos.</p>');
    }).always(function () {
        $(".load_projects").addClass("ds_none");
    });


    function getItemProject(projectId) {
        let project = portifolioList[projectId];

        return {
            ...project,
            image: project.image || 'assets/images/default.png',
            skills: project.skills.split(',').map(skill => { return `<li>${skill}</li>` }).join(''),
            created_at: new Date(project.created_at).toLocaleString([], { year: 'numeric', month: 'long' })
        };
    }

    function addCardPortifolio(project, index) {

        $(".main_portifolio_content_list").append(
            `<article class="main_portifolio_content_list_item" id="project-${project.id}" style="display:none;">
            <div class="main_portifolio_content_list_item_img">
              <a class="show_modal" data-projectidx="${index}">
                <img src="${project.image}" alt="Imagem do projeto">
              </a>
            </div>
            <div class="main_portifolio_content_list_item_body">
              <h2><a class="show_modal" data-projectidx="${index}">${project.title}</a></h2>
              <p>${project.description}</p>
              <small>Criado em: ${project.created_at}</small>
              <ul>
                ${project.skills}
              </ul>
            </div>
            <div class="main_portifolio_content_list_item_footer">
              <a class="btn_run" href="${project.url_to_run}" target="_blank"
                ${project.url_to_run == "" ? "onclick='return false;' title='Indisponível' style='cursor: not-allowed;'" : ""}>
                <i class="far fa-play-circle"></i>&nbsp;Executar
              </a>
              <a class="btn_src" href="${project.url_src}" target="_blank" 
                ${project.url_src == "" ? "onclick='return false;' title='Indisponível' style='cursor: not-allowed;'" : ""}>
                <i class="fas fa-code"></i>&nbsp;Código-fonte
              </a>
            </div>
          </article>`
        );

        $("#project-" + project.id).fadeIn("slow");
    }

    $("#contactForm").submit(function (event) {
        event.preventDefault();
    });

    $(".btn_send").on('click', function (event) {

        $("#contactForm").submit();
        $(".sending_msg").text("Enviando...");
        $(".sending_msg").removeClass("ds_none success error");

        $.post(baseUrl + '/contact', $("#contactForm").serialize(), function (data) {
            $("#name").val("");
            $("#email").val("");
            $("#message").val("");
            $(".sending_msg").addClass("success");
            $(".sending_msg").text("Mensagem enviada com sucesso!");
        }).fail(function () {
            $(".sending_msg").addClass("error");
            $(".sending_msg").text("Ocorreu um erro ao enviar a mensagem!");
        });
    });

    $("img.close").on('click', function () {
        $(".project_modal").removeClass("active");
    });

    function showModal(element) {

        const projectIdx = element.data("projectidx");
        const project = getItemProject(projectIdx);

        $(".project_modal_content").html(
            `<div class="project_modal_content_img">
                <img src="${project.image}" alt="Imagem">
            </div>
            <div class="project_modal_content_description">
                <div class="project_modal_content_description_body">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <small>Criado em: ${project.created_at}</small>
                    <ul>
                        ${project.skills}
                    </ul>
                </div>
                <div class="project_modal_content_description_footer">
                    <a class="btn_run" href="${project.url_to_run}" target="_blank"
                        ${project.url_to_run == "" ? "onclick='return false;' title='Indisponível' style='cursor: not-allowed;'" : ""}>
                        <i class="far fa-play-circle"></i>&nbsp;Executar
                    </a>
                    <a class="btn_src" href="${project.url_src}" target="_blank" 
                        ${project.url_src == "" ? "onclick='return false;' title='Indisponível' style='cursor: not-allowed;'" : ""}>
                        <i class="fas fa-code"></i>&nbsp;Código-fonte
                    </a>
                </div>
            </div>`
        );

        $(".project_modal").addClass("active");
    }

});