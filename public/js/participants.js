import { TableGenerator } from "./TableGenerator.js";
import { DatasArray } from "./DatasArray.js";

const tableDatas = new DatasArray();
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/participants')
       .then(response => response.json())
       .then(data => {
          tableDatas.JsonDatasToArray(data);
          const tableGenerator = new TableGenerator(tableDatas,"playersTableBody","playersTableHead");
        tableGenerator.generateTable();
      document.getElementById("searchbar").addEventListener("input",(event)=>{tableGenerator.eventChangeFilterValue(event.target.value);});
      document.getElementById("Max").addEventListener("change",(event)=>{tableGenerator.eventChangeTableMax(event.target.value);});
       })
       .catch(error => console.error('Error fetching data:', error));
 });
