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

        if (!$menu_mobile_submenu.is(e.target) && $menu_mobile_submenu.has(e.target).length === 0
            && !$menu_mobile_icon.is(e.target) && $menu_mobile_icon.has(e.target).length === 0) {
            if ($menu_mobile_submenu.is(':visible'))
                $menu_mobile_submenu.addClass('ds_none');
        }
    });

    const baseUrl = "https://portifolio-api.herokuapp.com/api";
    let portifolioList = [];

    $.get({ url: baseUrl + '/projects' }, function (data) {
        portifolioList = data;
        portifolioList.forEach(item => {
            addCardPortifolio(item);
        });
    }).fail(function () {
        $(".main_portifolio_content_list").html('<p>Erro ao carregar projetos.</p>');
    }).always(function () {
        $(".load_projects").addClass("ds_none");
    });

    function addCardPortifolio(item) {

        const image = item.image || 'assets/images/default.png';
        const title = item.title;
        const description = item.description;
        const skills = item.skills.split(',').map(skill => { return `<li>${skill}</li>` }).join('');
        const url_run = item.url_to_run;
        const url_src = item.url_src;
        const created_at = new Date(item.created_at);

        $(".main_portifolio_content_list").append(
            `<article class="main_portifolio_content_list_item" id="project-${item.id}" style="display:none;">
            <div class="main_portifolio_content_list_item_img">
              <a href="#">
                <img src="${image}" alt="Imagem do projeto">
              </a>
            </div>
            <div class="main_portifolio_content_list_item_body">
              <h2><a href="#">${title}</a></h2>
              <p>${description}</p>
              <small>Criado em: ${created_at.getDate()}/${created_at.getMonth() + 1}/${created_at.getFullYear()}</small>
              <ul>
                ${skills}
              </ul>
            </div>
            <div class="main_portifolio_content_list_item_footer">
              <a class="btn_run" href="${url_run}" target="_blank"><i class="far fa-play-circle"></i>&nbsp;Executar</a>
              <a class="btn_src" href="${url_src}" target="_blank"><i class="fas fa-code"></i>&nbsp;Código-fonte</a>
            </div>
          </article>`
        );

        $("#project-"+item.id).fadeIn("slow");
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
});