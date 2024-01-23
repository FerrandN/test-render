import { TableGenerator } from "./TableGenerator.js";
import { DatasArray } from "./DatasArray.js";

const tableDatas = new DatasArray();
document.addEventListener('DOMContentLoaded', () => {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
    
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    
        var results = regex.exec(url);
    
        if (!results) return null;
    
        if (results[2]) {
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        else
        {
            return "";
        }
    }

    var tournamentName = getParameterByName("tournamentName");

    fetch(`/api/tournament?tournamentName=${tournamentName}`)
        .then(response => response.json())
        .then(data => {
            tableDatas.JsonDatasToArray(data);
            const tableGenerator = new TableGenerator(tableDatas,"rankingtablebody","rankingtablehead");
            tableGenerator.generateTable();
        })
        .catch(error => console.error('Error fetching data:', error));

    let title = document.getElementById("title");
    title.textContent = title.textContent + tournamentName;
    document.getElementById("searchbar").addEventListener("input",(event)=>{tableGenerator.eventChangeFilterValue(event.target.value);});
    document.getElementById("Max").addEventListener("change",(event)=>{tableGenerator.eventChangeTableMax(event.target.value);});
});

