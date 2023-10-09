let toTopButton = document.getElementById("to-top-button");

if (toTopButton) {
window.onscroll = function () {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const threshold = 500;
  if (scrollTop > threshold) {
    toTopButton.classList.remove("hidden");
  } else {
    toTopButton.classList.add("hidden");
  }
};

window.goToTop = function() {
  // Scroll to the top of the page smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
};
}

function bypassLogin() {
  const email = "tomato@10.com";
  const password = "tomato@10.com";

  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const form = document.querySelector("form");

  emailInput.value = email;
  passwordInput.value = password;

  form.submit();
}
