(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 20,
        time: 2000
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Our Brands Start 2
// Vendor carousel
$('.vendor-carousel2').owlCarousel({ 
	loop: true, 
	margin: 29, 
	dots: true, 
	nav: false, 
	autoplay: true, 
	smartSpeed: 1000, 
	responsive: { 
		0:{ items:2 }, 
		576:{ items:3 }, 
		768:{ items:4 }, 
		992:{ items:5 }, 
		1200:{ items:6 } 
	} 
});
    // Our Brands End 2



    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
    });
	
	// skill-carousel
	$(document).ready(function(){
  		$(".skill-carousel").owlCarousel({
    		items: 1,           // show one image at a time
    		loop: true,
    		autoplay: true,
    		autoplayTimeout: 3000,
    		smartSpeed: 800,
    		dots: true,         // show navigation dots
    		nav: false,
    		center: true,
    		margin: 0
  		});
     });

    
    // Happening carousel
    $(document).ready(function() {
        // Small delay to ensure everything is loaded
        setTimeout(function() {
            $(".happening-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                margin: 15,
                loop: true,
                center: true,
                dots: true,
                nav: false, //show arrow btn change to true
                navText: [
                    '<i class="bi bi-chevron-left"></i>',
                    '<i class="bi bi-chevron-right"></i>'
                ],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    992: {
                        items: 3
                    }
                }
            });
        }, 100);
    });
    
    
})(jQuery);

