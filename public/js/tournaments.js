import { TableGenerator } from "./TableGenerator.js";
import { DatasArray } from "./DatasArray.js";

const tableDatas = new DatasArray();
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/tournaments')
       .then(response => response.json())
       .then(data => {
          tableDatas.JsonDatasToArray(data);
          const tableGenerator = new TableGenerator(tableDatas,"rankingtablebody","rankingtablehead");
        tableGenerator.generateTable();
        document.getElementById("searchbar").addEventListener("input",(event)=>{tableGenerator.eventChangeFilterValue(event.target.value);});
         document.getElementById("Max").addEventListener("change",(event)=>{tableGenerator.eventChangeTableMax(event.target.value);});
       })
       .catch(error => console.error('Error fetching data:', error));
 });