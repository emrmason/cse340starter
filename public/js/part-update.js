const form2 = document.querySelector("#partsUpdate");
form2.addEventListener("change", function () {
  console.log("Change event triggered");
  const updateBtn = document.querySelector("#button2");
  updateBtn.removeAttribute("disabled");
});
