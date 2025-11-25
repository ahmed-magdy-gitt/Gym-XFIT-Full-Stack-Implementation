$(function() {
    $('.footer .copyright')[0].innerText = `© ${new Date().getFullYear()} XFIT`

    $('.toggleMenu').click(function() {
        $(this).toggleClass('active');
        $('section.store ul.navigation').toggleClass('active');
    });

    $(window).scroll(function() {
        // Header
        if ($(this).scrollTop() > $('section.store header').height()) {
            $('section.store header').addClass('active');
        } else {
            $('section.store header').removeClass('active');
        }

        // Show/hide elements
        // check the location of each hideme element
        $('.hideme').each(function(i) {
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            // if element is visible, fade it in
            (bottom_of_window > bottom_of_object) ? $(this)[0].classList.add('show') : $(this)[0].classList.remove('show');
        });
    });

    // Audio
    $(function() {
        let audio = document.getElementById("backgroundMusic");
        audio.play();
        audio.volume = 0.1;
    });
    // Toggle audio button
    $('header button.audio-controller').click(function() {
        let audio = document.getElementById("backgroundMusic");

        if (audio.paused) {
            audio.play();
            $(this).find('svg.bi-volume-mute-fill')[0].style.display = 'none';
            $(this).find('svg.bi-volume-up-fill')[0].style.display = 'block';
        }else {
            audio.pause();
            $(this).find('svg.bi-volume-mute-fill')[0].style.display = 'block';
            $(this).find('svg.bi-volume-up-fill')[0].style.display = 'none';
        }
    });

    // Change theme
    $('header button.mode-controller').click(function() {
        console.log(document.body.style.backgroundColor);
        // change body background color [dark: rgb(19, 20, 22), light: rgb(245, 245, 245)]
        const dark = 'rgb(19, 20, 22)';
        const light = 'rgb(245, 245, 245)';
        let isDark = $('body')[0].style.backgroundColor === dark;

        if (isDark) {
            $('body')[0].style.backgroundColor = light;
            $(this).find('svg.bi-brightness-high-fill')[0].style.display = 'none';
            $(this).find('svg.bi-moon-fill')[0].style.display = 'block';
        }else {
            $('body')[0].style.backgroundColor = dark;
            $(this).find('svg.bi-brightness-high-fill')[0].style.display = 'block';
            $(this).find('svg.bi-moon-fill')[0].style.display = 'none';
        }
    });
});