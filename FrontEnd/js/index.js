document.addEventListener("DOMContentLoaded", () => {
  const apiWorks = "http://localhost:5678/api/works";
  const apiCat = "http://localhost:5678/api/categories";
  const categoriesContainer = document.getElementById("container-button");
  const imagesContainer = document.getElementById("gallery");

  // Fetch data from API
  async function fetchData() {
    try {
      const responseWorks = await fetch(apiWorks);
      const responseCategories = await fetch(apiCat);

      const works = await responseWorks.json();
      const categories = await responseCategories.json();

      // Generate category buttons
      generateCategoryButtons(categories);

      // Display all images initially
      displayImages(works);

      // Add event listeners to buttons for filtering
      addFilterFunctionality(works);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Generate buttons dynamically
  function generateCategoryButtons(categories) {
    categoriesContainer.innerHTML = ""; // Clear existing buttons

    // Create "All" button to display all images
    const allButton = document.createElement("button");
    allButton.classList.add("btn", "active");
    allButton.textContent = "Tous";
    allButton.dataset.category = "all";
    categoriesContainer.appendChild(allButton);

    // Create buttons for each category
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = category.name;
      button.dataset.category = category.name;
      categoriesContainer.appendChild(button);
    });
  }

  // Display images
  function displayImages(images) {
    imagesContainer.innerHTML = "";
    images.forEach((image) => {
      const imgElement = document.createElement("img");
      const figcaptionElement = document.createElement("figcaption");

      imgElement.src = image.imageUrl;
      imgElement.alt = image.title;
      figcaptionElement.innerHTML = image.title;
      imagesContainer.appendChild(imgElement);
    });
  }

  // Add filter functionality
  function addFilterFunctionality(works) {
    categoriesContainer.addEventListener("click", (e) => {
      const clickedButton = e.target;

      if (clickedButton.tagName === "BUTTON") {
        // Remove "active" class from all buttons
        const allButtons = categoriesContainer.querySelectorAll(".btn");
        allButtons.forEach((button) => button.classList.remove("active"));

        // Add "active" class to the clicked button
        clickedButton.classList.add("active");

        const clickedCategory = clickedButton.dataset.category;

        if (clickedCategory === "all") {
          // Display all images if "All" is clicked
          displayImages(works);
        } else {
          // Filter images by category
          const filteredImages = works.filter(
            (item) => item.category.name === clickedCategory
          );
          displayImages(filteredImages);
        }
      }
    });
  }

  // Initialize
  fetchData();
  const form = document.querySelector("form");
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
        // console.log("Login successful:", json);
        localStorage.setItem("authToken", json.token);
        window.location.href = "/FrontEnd/index.html";
      })
      .catch((err) => {
        console.error(err.message);
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent =
          "Email ou mot de passe incorrect. Veuillez réessayer.";
        errorMessage.style.color = "red";
      });
  });
});
