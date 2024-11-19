document.addEventListener("DOMContentLoaded", () => {
  const adminIcon = document.getElementById("admin-icon");
  const modal = document.getElementById("adminModal");
  const closeModal = modal.querySelector(".close");
  const addImageModal = document.getElementById("addImageModal");
  const closeAddImageModal = addImageModal.querySelector(".close");
  const imageList = document.getElementById("imageList");
  const addImageButton = document.getElementById("addImageButton");
  const backArrow = document.querySelector(".back-arrow");

  let works = [];
  if (closeModal) {
    modal.style.display = "none";
  }

  addImageButton.addEventListener("click", () => {
    addImageModal.style.display = "block";
  });

  backArrow.addEventListener("click", () => {
    addImageModal.style.display = "none";
    modal.style.display = "block";
  });

  closeAddImageModal.addEventListener("click", () => {
    addImageModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  window.addEventListener("click", (event) => {
    if (event.target === addImageModal) {
      addImageModal.style.display = "none";
    }
  });
  // Écouter l'événement personnalisé et afficher les images
  window.addEventListener("initializeModal", (event) => {
    works = event.detail; // Récupérer les données depuis l'événement
    console.log("Données reçues dans le modal :", works); // Debugging
    if (!works || works.length === 0) {
      console.error("Les données sont vides ou nulles !");
      return;
    }
    renderImages();
    modal.style.display = "block"; // Afficher le modal
  });
  // Fermer le modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  // Rendre les images dans le modal
  function renderImages() {
    imageList.innerHTML = ""; // Réinitialiser la liste
    works.forEach((work) => {
      const imageContainer = document.createElement("div");
      imageContainer.style.display = "flex";
      imageContainer.style.alignItems = "center";

      const imgElement = document.createElement("img");
      imgElement.src = work.imageUrl; // Assure-toi que l'API retourne une propriété 'url'
      imgElement.alt = work.title; // Ajoute un alt text
      imageContainer.appendChild(imgElement);

      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "🗑️"; // Icône delete
      deleteIcon.classList.add("delete-icon");
      deleteIcon.addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
          deleteImage(work.id, imageContainer); // Supprime après confirmation
        }
      });
      imageContainer.appendChild(deleteIcon);

      imageList.appendChild(imageContainer);
    });
  }

  // Supprimer une image
  async function deleteImage(id, element) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token manquant. Veuillez vous connecter.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
          "Content-Type": "application/json", // Optionnel : précise le type de contenu si nécessaire
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      // Supprime l'élément du DOM après succès
      element.remove(); // Retirer l'élément HTML
      console.log(`Image ${id} supprimée avec succès.`);
      works = works.filter((work) => work.id !== id); // Mettre à jour localement
      renderImages(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur :", error);
    }
  }
});
