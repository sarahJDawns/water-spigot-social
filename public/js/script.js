let toTopButton = document.getElementById("to-top-button");

if (toTopButton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      toTopButton.classList.remove("hidden");
    } else {
      toTopButton.classList.add("hidden");
    }
  };

  window.goToTop = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
}

function bypassLogin() {
  const email = "tomato@10.com";
  const password = "tomato@10.com";

  document.querySelector('input[name="email"]').value = email;
  document.querySelector('input[name="password"]').value = password;

  document.querySelector("form").submit();
}
