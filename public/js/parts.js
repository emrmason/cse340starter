"use strict";

// Get a list of parts based on part Id, return as data
fetch(partId);

// Build parts items into HTML table components and write to DOM
function buildPartsList(data) {
  let partsDisplay = document.getElementById("partsDisplay");
  //set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Part Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // set up table body
  dataTable += "<tbody>";
  //iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.part_id + ", " + element.part_name);
    dataTable += `<tr><td>${element.part_name}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.part_id}' title='Click to Update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.part_id}' title='Click to Delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the inventory management view
  inventoryDisplay.innerHTML = dataTable;
}
