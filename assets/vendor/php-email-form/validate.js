// Fixed JavaScript code for form submission
(function () {
  "use strict";
  let forms = document.querySelectorAll('.php-email-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let thisForm = this;
      let action = thisForm.getAttribute('action');
      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      // Show loading, hide other messages
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      let formData = new FormData(thisForm);
      // Submit the form
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(response => {
          if (response.ok) {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return response.json();
            } else {
              return response.text();
            }
          } else {
            throw new Error(`${response.status} ${response.statusText} ${response.url}`);
          }
        })
        .then(data => {
          // Hide loading
          thisForm.querySelector('.loading').classList.remove('d-block');
          // Handle JSON response
          if (typeof data === 'object' && data.status) {
            if (data.status === 'success') {
              thisForm.querySelector('.sent-message').innerHTML = data.message;
              thisForm.querySelector('.sent-message').classList.add('d-block');
              thisForm.reset();
            } else {
              throw new Error(data.message || 'Form submission failed');
            }
          }
          // Handle text response (legacy)
          else if (typeof data === 'string' && data.trim() === 'OK') {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            throw new Error(data || 'Form submission failed with unknown error');
          }
        })
        .catch(error => {
          displayError(thisForm, error);
        });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();