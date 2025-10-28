// Initialize EmailJS
(function () {
  emailjs.init("9JA_ZRCUrm7253vy6");
})();

const form = document.getElementById("contact-form");
const statusMessage = document.getElementById("status-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMessage.textContent = "Sending...";

  // reCAPTCHA token check
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    statusMessage.textContent = "Please complete the reCAPTCHA.";
    return;
  }

  const templateParams = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
    "g-recaptcha-response": recaptchaResponse,
  };

  try {
    await emailjs.send(
      "service_o7kpcy9",
      "template_igu1zfa",
      templateParams
    );
    statusMessage.textContent = "Message sent successfully! We'll get back to you soon.";
    form.reset();
    grecaptcha.reset();
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Oops! Something went wrong. Try again later.";
  }
});