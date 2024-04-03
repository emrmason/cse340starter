("use strict");

// Get parts data
document.addEventListener("DOMContentLoaded", function () {
  //Get a list of parts
  let partsURL = "/parts/api/parts/";
  fetch(partsURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network Response was not OK - parts.js ");
    })
    .then(function (data) {
      console.log(data);
      buildPartsList(data);
    })
    .catch(function (error) {
      console.log("There was a problem with parts.js: ", error.message);
    });
});

// Build parts items into HTML table components and write to DOM
async function buildPartsList(data) {
  console.log(data);
  let partsDisplay = document.getElementById("partsDisplay");
  //set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Part Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // set up table body
  dataTable += "<tbody>";
  //iterate over all data in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.part_id + ", " + element.part_name);
    dataTable += `<tr><td>${element.part_name}</td>`;
    dataTable += `<td><a href='/parts/update/${element.part_id}' title='Click to Update'>Modify</a></td>`;
    dataTable += `<td><a href='/parts/delete/${element.part_id}' title='Click to Delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the inventory management view
  partsDisplay.innerHTML = dataTable;
}
