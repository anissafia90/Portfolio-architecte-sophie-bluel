document.addEventListener("DOMContentLoaded", () => {
  const adminIcon = document.getElementById("admin-icon");
  const modal = document.getElementById("adminModal");
  const addImageModal = document.getElementById("addImageModal");
  const imageList = document.getElementById("imageList");
  const addImageButton = document.getElementById("addImageButton");
  const backArrow = document.querySelector(".back-arrow");
  const closeModal = modal?.querySelector(".close");
  const closeAddImageModal = addImageModal?.querySelector(".close");
  const addImageForm = document.getElementById("addImageForm");
  const validateButton = document.getElementById("validateButton");

  let works = [];

  // Masquer un modal
  function closeModalHandler(modal) {
    if (modal) modal.style.display = "none";
  }

  // Afficher un modal
  function openModal(modal) {
    if (modal) modal.style.display = "block";
  }

  // Configuration des événements pour les modals
  function setupModalEvents() {
    if (closeModal)
      closeModal.addEventListener("click", () => closeModalHandler(modal));
    if (closeAddImageModal)
      closeAddImageModal.addEventListener("click", () =>
        closeModalHandler(addImageModal)
      );

    window.addEventListener("click", (event) => {
      if (event.target === modal) closeModalHandler(modal);
      if (event.target === addImageModal) closeModalHandler(addImageModal);
    });

    addImageButton.addEventListener("click", () => openModal(addImageModal));
    backArrow.addEventListener("click", () => {
      closeModalHandler(addImageModal);
      openModal(modal);
    });
  }

  // Rendre les images
  function renderImages() {
    imageList.innerHTML = "";
    works.forEach((work) => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const imgElement = document.createElement("img");
      imgElement.src = work.imageUrl;
      imgElement.alt = work.title;

      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "🗑️";
      deleteIcon.classList.add("delete-icon");
      deleteIcon.addEventListener("click", () =>
        confirmDeletion(work.id, imageContainer)
      );

      imageContainer.append(imgElement, deleteIcon);
      imageList.appendChild(imageContainer);
    });
  }

  // Supprimer une image
  async function deleteImage(id, element) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token manquant. Veuillez vous connecter.");

      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression.");

      element.remove();
      works = works.filter((work) => work.id !== id);
      console.log(`Image ${id} supprimée avec succès.`);
      renderImages();
    } catch (error) {
      console.error("Erreur :", error);
      alert("Échec de la suppression.");
    }
  }

  // Confirmation avant suppression
  function confirmDeletion(id, element) {
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
      deleteImage(id, element);
    }
  }

  // Ajouter une image
  async function addImage(event) {
    event.preventDefault();

    const title = document.getElementById("imageTitle").value.trim();
    const imageInput = document.getElementById("file-upload");
    const image = imageInput.files[0];
    const categorySelect = document
      .getElementById("imageCategory")
      .value.trim();

    const categoryMap = {
      Objets: 1,
      Appartements: 2,
      "Hotels & restaurants": 3,
    };

    const categoryId = categoryMap[categorySelect];

    if (!title || !image || !categoryId) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("category", categoryId);

      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur de l'API.");
      }

      alert("Projet ajouté avec succès !");
      const newWork = await response.json();
      works.push(newWork);
      renderImages();
      closeModalHandler(addImageModal);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'ajout de l'image.");
    }
  }

  // Activation/Désactivation du bouton de validation
  document.getElementById("file-upload").addEventListener("change", (event) => {
    const hasFile = event.target.files && event.target.files.length > 0;
    validateButton.disabled = !hasFile;
    validateButton.classList.toggle("addImageButton", hasFile);
  });

  // Initialisation
  function initialize() {
    setupModalEvents();

    window.addEventListener("initializeModal", (event) => {
      works = event.detail || [];
      if (works.length === 0) return alert("Aucune image à afficher.");
      renderImages();
      openModal(modal);
    });

    if (addImageForm) addImageForm.addEventListener("submit", addImage);
  }

  initialize();
});
