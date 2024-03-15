"use strict";

// Get a list of items from inventory based on classification_id
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`); // This is not logging (3/15 10:57AM)
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data); //right now this is not logging (3/15 10:57AM)
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// Build inventory items into HTML table components and write to DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  //set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // set up table body
  dataTable += "<tbody>";
  //iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to Update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to Delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the inventory management view
  inventoryDisplay.innerHTML = dataTable;
}
