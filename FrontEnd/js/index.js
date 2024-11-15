async function afficherWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const Works = await reponse.json();
  console.log(Works);
  for (let i = 0; i < Works.length; i++) {
    const element = Works[i];
    const container = document.getElementById("gallery");
    var figure = document.createElement("figure");
    figure.id = "image-container" + i;
    container.appendChild(figure);
    const imageElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    imageElement.src = element.imageUrl;
    figcaptionElement.innerHTML = element.title;
    figure.appendChild(imageElement);
    figure.appendChild(figcaptionElement);
  }
}

afficherWorks();
