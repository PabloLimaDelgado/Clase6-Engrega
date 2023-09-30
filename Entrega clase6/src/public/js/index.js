let divProducts = document.getElementById("productos");

fetch("../../ManagerAPI.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Aquí puedes trabajar con tus datos
  })
