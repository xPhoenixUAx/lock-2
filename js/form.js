document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const message = form.querySelector(".form-message");
  const submitBtn = form.querySelector("button[type='submit']");
  const submitBtnInitialText = submitBtn ? submitBtn.textContent : "";
  const phoneRegex = /^\+?[\d\s().-]{7,}$/;

  const showMessage = (text, isError = false) => {
    if (!message) return;
    message.textContent = text;
    message.style.color = isError ? "#c2410c" : "#1b6ca8";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showMessage("");

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const email = form.elements.email.value.trim();

    if (!name || !phone || !email) {
      showMessage("Please fill out all required fields.", true);
      return;
    }

    if (!phoneRegex.test(phone)) {
      showMessage("Please enter a valid phone number.", true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    setTimeout(() => {
      showMessage("Thanks! Your request has been sent. We will contact you shortly.");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtnInitialText || "Send";
    }, 900);
  });
});
