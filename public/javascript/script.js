//form validating 
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

const taxSwitch = document.querySelectorAll(".taxSwitch");
const tax = document.querySelectorAll("p i");
taxSwitch.forEach((e) => {
  e.addEventListener("click", () => {
    tax.forEach((v) => {
      if (v.getAttribute("class") == "none") {
        v.classList.add("block");
        v.classList.remove("none");
      } else {
        v.classList.add("none");
        v.classList.remove("block");
      }
    });
  });
});


