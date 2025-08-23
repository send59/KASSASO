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