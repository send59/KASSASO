(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

})();

// My New Code

document.addEventListener("DOMContentLoaded", function () {
  const calendarButtons = document.querySelectorAll(".btn-calendar");

  calendarButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const eventCard = this.closest(".event-card");

      const title = eventCard.querySelector("h3")?.innerText || "Event";
      const description = eventCard.querySelector("p")?.innerText || "";
      const location = eventCard.querySelector(".bi-geo-alt + span")?.innerText || "";

      const day = eventCard.querySelector(".day")?.innerText;
      const month = eventCard.querySelector(".month")?.innerText;
      const year = eventCard.querySelector(".year")?.innerText;
      const time = eventCard.querySelector(".bi-clock + span")?.innerText;

      // month mapping
      const months = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
        JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
      };

      const [startTime, endTime] = time.split("-").map(t => t.trim());

      function formatDateTime(day, month, year, time) {
        const [hours, minutes] = time.replace(/(AM|PM)/i, "").trim().split(":");
        let hrs = parseInt(hours);
        if (/PM/i.test(time) && hrs < 12) hrs += 12;
        if (/AM/i.test(time) && hrs === 12) hrs = 0;
        return `${year}${months[month.toUpperCase()]}${day}T${String(hrs).padStart(2,"0")}${minutes}00`;
      }

      const startDateTime = formatDateTime(day, month, year, startTime);
      const endDateTime = formatDateTime(day, month, year, endTime);

      // ICS file content
      const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${startDateTime}
DTEND:${endDateTime}
END:VEVENT
END:VCALENDAR
      `.trim();

      // Google Calendar link
      const googleCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

      // device detection
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod|macintosh/.test(ua);
      const isAndroid = /android/.test(ua);

      if (isIOS) {
        // Download ICS (Apple Calendar handles it)
        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_")}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (isAndroid || !isIOS) {
        // Try Google Calendar
        window.open(googleCalUrl, "_blank");

        // Also trigger ICS fallback (for non-Google users)
        setTimeout(() => {
          const blob = new Blob([icsContent], { type: "text/calendar" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title.replace(/\s+/g, "_")}.ics`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1500);
      }
    });
  });
});

/**
 * Scroll-triggered animations with improved reverse effect
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.slide-up, .slide-left, .slide-right, .fade-in, .scale-in');
  let lastScrollY = window.scrollY;
  
  // Check if Intersection Observer is supported
  if (typeof IntersectionObserver !== 'undefined') {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;
        
        if (entry.isIntersecting) {
          // Add animated class when element enters viewport
          entry.target.classList.add('animated');
          entry.target.classList.remove('reverse');
        } else {
          // Check if we should reverse the animation
          const elementTop = entry.target.getBoundingClientRect().top;
          const viewportHeight = window.innerHeight;
          
          // Only reverse if element is well above viewport (not just slightly)
          if (elementTop < -viewportHeight * 0.4 && !isScrollingDown) {
            entry.target.classList.remove('animated');
            entry.target.classList.add('reverse');
          }
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    // Additional scroll listener for better reverse detection
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const viewportHeight = window.innerHeight;
      
      // Check elements that are partially in view
      animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isInViewport) {
          if (isScrollingDown) {
            element.classList.add('animated');
            element.classList.remove('reverse');
          } else if (rect.top > viewportHeight * 0.6) {
            // Only reverse if scrolling up and element is in top 60% of viewport
            element.classList.remove('animated');
            element.classList.add('reverse');
          }
        } else if (rect.top > viewportHeight) {
          // If element is below viewport and we're scrolling up, keep it reversed
          if (!isScrollingDown) {
            element.classList.remove('animated');
            element.classList.add('reverse');
          }
        } else if (rect.bottom < -viewportHeight * 0.3) {
          // If element is well above viewport, reverse it
          element.classList.remove('animated');
          element.classList.add('reverse');
        }
      });
      
      lastScrollY = currentScrollY;
    });
    
  } else {
    // Fallback for browsers that don't support Intersection Observer
    function checkScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const viewportHeight = window.innerHeight;
      
      animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isInViewport) {
          if (isScrollingDown || currentScrollY < 100) {
            element.classList.add('animated');
            element.classList.remove('reverse');
          } else if (rect.top > viewportHeight * 0.6) {
            // Only reverse if scrolling up and element is in top 60% of viewport
            element.classList.remove('animated');
            element.classList.add('reverse');
          }
        } else if (rect.top > viewportHeight) {
          // If element is below viewport and we're scrolling up, keep it reversed
          if (!isScrollingDown) {
            element.classList.remove('animated');
            element.classList.add('reverse');
          }
        } else if (rect.bottom < -viewportHeight * 0.3) {
          // If element is well above viewport, reverse it
          element.classList.remove('animated');
          element.classList.add('reverse');
        }
      });
      
      lastScrollY = currentScrollY;
    }
    
    checkScroll();
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// Re-initialize animations on window resize
window.addEventListener('resize', initScrollAnimations);

/**
 * Scroll top button - Smooth scroll intact
 */
let scrollTop = document.querySelector('.scroll-top');

function toggleScrollTop() {
  if (scrollTop) {
    window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
}

scrollTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('load', toggleScrollTop);
document.addEventListener('scroll', toggleScrollTop);

/**
 * Number counting animation with symbol preservation
 */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  
  // Check if Intersection Observer is supported
  if (typeof IntersectionObserver !== 'undefined') {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
          animateNumber(entry.target);
          entry.target.setAttribute('data-counted', 'true');
          // Stop observing after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    counterElements.forEach(element => {
      // Extract number and symbol from the original text
      const originalText = element.textContent;
      const numberMatch = originalText.match(/([0-9,.]+)/);
      
      if (numberMatch) {
        const numberValue = numberMatch[1];
        const symbol = originalText.replace(numberValue, '').trim();
        
        // Store the target value and symbol
        const targetValue = parseFloat(numberValue.replace(/,/g, ''));
        element.setAttribute('data-target', targetValue);
        element.setAttribute('data-symbol', symbol);
        
        // Set initial value to 0 with symbol
        element.textContent = '0' + (symbol ? ' ' + symbol : '');
      }
      
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    function checkCounters() {
      counterElements.forEach(element => {
        if (isInViewport(element) && !element.hasAttribute('data-counted')) {
          animateNumber(element);
          element.setAttribute('data-counted', 'true');
        }
      });
    }
    
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }
    
    // Initialize counters
    counterElements.forEach(element => {
      const originalText = element.textContent;
      const numberMatch = originalText.match(/([0-9,.]+)/);
      
      if (numberMatch) {
        const numberValue = numberMatch[1];
        const symbol = originalText.replace(numberValue, '').trim();
        
        const targetValue = parseFloat(numberValue.replace(/,/g, ''));
        element.setAttribute('data-target', targetValue);
        element.setAttribute('data-symbol', symbol);
        element.textContent = '0' + (symbol ? ' ' + symbol : '');
      }
    });
    
    checkCounters();
    window.addEventListener('scroll', checkCounters);
  }
}

/**
 * Animate number from 0 to target value with symbol preservation
 */
function animateNumber(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const symbol = element.getAttribute('data-symbol') || '';
  const duration = 2000; // Animation duration in ms
  const steps = 60; // Number of steps
  const stepDuration = duration / steps;
  const increment = target / steps;
  
  let current = 0;
  let step = 0;
  
  const timer = setInterval(() => {
    current += increment;
    step++;
    
    if (step >= steps) {
      current = target;
      clearInterval(timer);
      element.classList.add('animated'); // Add pulse animation
      
      // Remove animation class after animation completes
      setTimeout(() => {
        element.classList.remove('animated');
      }, 600);
    }
    
    // Format number with symbol
    let displayValue;
    if (target % 1 === 0) {
      // Integer values
      displayValue = Math.floor(current).toLocaleString();
    } else {
      // Decimal values (show one decimal place)
      displayValue = current.toFixed(1);
    }
    
    // Add symbol with appropriate spacing
    element.textContent = displayValue + (symbol ? ' ' + symbol : '');
  }, stepDuration);
}

// Initialize number counters when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNumberCounters();
  });
} else {
  initScrollAnimations();
  initNumberCounters();
}

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide any previous messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            loadingMessage.style.display = 'block';
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Send form data using Fetch API
            fetch('../forms/contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                loadingMessage.style.display = 'none';
                
                if (data.status === 'success') {
                    successMessage.textContent = data.message;
                    successMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Unknown error occurred');
                }
            })
            .catch(error => {
                loadingMessage.style.display = 'none';
                errorMessage.textContent = error.message || 'Form submission failed. Please try again.';
                errorMessage.style.display = 'block';
            });
        });
    }
});