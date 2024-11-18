document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const data = {
        email,
        password,
      };

      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error("Invalid email or password");
          }
          return response.json();
        })
        .then((json) => {
          localStorage.setItem("authToken", json.token);

          // Vérifier si l'utilisateur est admin (par ex., userId === 1)
          const isAdmin = json.userId === 1; // Règle locale
          localStorage.setItem("isAdmin", isAdmin);

          // Rediriger vers la page principale
          window.location.href = "/FrontEnd/index.html";
        })
        .catch((err) => {
          console.error(err.message);
          const errorMessage = document.getElementById("error-message");
          if (errorMessage) {
            errorMessage.textContent =
              "Email ou mot de passe incorrect. Veuillez réessayer.";
            errorMessage.style.color = "red";
          }
        });
    });
  }

  // Vérifier si l'utilisateur est connecté et mettre à jour l'interface
  function checkLoginStatus() {
    const userToken = localStorage.getItem("authToken");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const loginLogoutLink = document.getElementById("login-logout");
    const adminIcon = document.getElementById("admin-icon");

    if (userToken) {
      // Si l'utilisateur est connecté, afficher "logout" au lieu de "login"
      if (loginLogoutLink) {
        loginLogoutLink.textContent = "Logout";
        loginLogoutLink.href = "#";
        loginLogoutLink.addEventListener("click", logout);
      }

      // Si l'utilisateur est admin, afficher l'icône admin
      if (isAdmin && adminIcon) {
        adminIcon.style.display = "block";
      }
    } else {
      // Si l'utilisateur n'est pas connecté, afficher "login"
      if (loginLogoutLink) {
        loginLogoutLink.textContent = "Login";
        loginLogoutLink.href = "Login.html";
        loginLogoutLink.removeEventListener("click", logout);
      }

      // Cacher l'icône admin si elle existe
      if (adminIcon) {
        adminIcon.style.display = "none";
      }
    }
  }

  // Fonction de déconnexion
  function logout(event) {
    event.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/FrontEnd/Login.html";
  }

  checkLoginStatus();
});
