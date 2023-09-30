const socketClient = io();

const form = document.getElementById("form");
const formTitle = document.getElementById("title");
const formDescription = document.getElementById("description");
const formCode = document.getElementById("code");
const formPrice = document.getElementById("price");
const formStatus = document.getElementsByName("status");
const formStock = document.getElementById("stock");
const formCategory = document.getElementById("category");

form.onsubmit = (e) => {
  e.preventDefault();

  let selectedStatus;
  for (let i = 0; i < formStatus.length; i++) {
    if (formStatus[i].checked) {
      selectedStatus = formStatus[i].value;
      break;
    }
  }

  const formData = {
    title: formTitle.value,
    description: formDescription.value,
    code: formCode.value,
    price: formPrice.value,
    status: selectedStatus === "true", // Esto lo convierte en un booleano: true o false
    stock: formStock.value,
    category: formCategory.value,
  };

  // const formDataJSON = JSON.stringify(formData);

  socketClient.emit("agregoProducto", formData);
};

socketClient.on("mostrarTodosProductosCliente", ()=>{
  socketClient.emit("mostrarTodosProductos")
})

socketClient.on("all-products", (info) => {
    console.log(`info sent: ${info}`);
  });
  
