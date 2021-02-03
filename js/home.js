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

    const baseUrl = "https://api.github.com";
    let portifolioList = [];

    $.get({ url: baseUrl + '/users/wellysonvie/repos', cache: false }, function (repos) {
        repos.forEach(repo => {
            $.get(repo.url + '/contents/.portifolio/config.json', function (config) {
                $.get(config.download_url, function (data) {
                    data = JSON.parse(data);
                    const item = {
                        ...data,
                        url_src: repo.html_url,
                        updated_at: repo.updated_at
                    }
                    addCardPortifolio(item);
                    portifolioList.push(item);
                    localStorage.setItem('portifolioList', JSON.stringify(portifolioList));
                });
            });
        });
    }).fail(function () {
        portifolioList = JSON.parse(localStorage.getItem('portifolioList'));
        if (portifolioList) {
            portifolioList.forEach(item => {
                addCardPortifolio(item);
            });
        }else{
            $(".main_portifolio_content_list").html('<p>Nenhum projeto econtrado.</p>');
        }
    }).always(function(){
        $(".load_projects").addClass("ds_none");
    });

    function addCardPortifolio(item) {

        const image = item.image || 'assets/images/default.png';
        const title = item.title;
        const description = item.description;
        const skills = item.skills.map(skill => { return `<li>${skill}</li>` }).join('');
        const url_run = item.url_to_run;
        const url_src = item.url_src;
        const updated_at = new Date(item.updated_at);

        $(".main_portifolio_content_list").append(
            `<article class="main_portifolio_content_list_item">
            <div class="main_portifolio_content_list_item_img">
              <a href="#">
                <img src="${image}" alt="Imagem do projeto">
              </a>
            </div>
            <div class="main_portifolio_content_list_item_body">
              <h2><a href="#">${title}</a></h2>
              <p>${description}</p>
              <small>Última atualização: ${updated_at.getDate()}/${updated_at.getMonth() + 1}/${updated_at.getFullYear()}</small>
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
    }
});