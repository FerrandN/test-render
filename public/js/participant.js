import { TableGenerator } from "./TableGenerator.js";
import { DatasArray } from "./DatasArray.js";

const tableDatasPalmares = new DatasArray();
const tableDatasSeason = new DatasArray();
const tableDatasMatches = new DatasArray();

document.addEventListener("DOMContentLoaded", function() {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
         name = name.replace(/[\[\]]/g, "\\$&");
    
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    
        var results = regex.exec(url);
    
        if (!results) return null;
    
        if (results[2]) {
            return results[2].split("&").map(function(value) {
                return decodeURIComponent(value.replace(/\+/g, " "));
            });
        }
        else
        {
            return "";
        }
    }
    var participantName = getParameterByName("participantName");
    let playernickname = document.getElementById("playernickname")
    playernickname.textContent = participantName;

    fetch(`/api/participantpalmares?participantName=${participantName}`)
    .then(response => response.json())
    .then(data => {
        tableDatasPalmares.JsonDatasToArray(data);
        const tableGeneratorpalmares = new TableGenerator(tableDatasPalmares,"palmarestablebody","palmarestablehead");
        tableGeneratorpalmares.generateTable();

        document.getElementById("searchbarpalmares").addEventListener("input",(event)=>{tableGeneratorpalmares.eventChangeFilterValue(event.target.value);});

        // Chain the next fetch request
        return fetch(`/api/participantsaison?participantName=${participantName}`);
    })
    .then(response => response.json())
    .then(data => {
        tableDatasSeason.JsonDatasToArray(data);

        const tableGeneratorseason = new TableGenerator(tableDatasSeason,"saisonstablebody","saisonstablehead");
        tableGeneratorseason.generateTable();

        document.getElementById("searchbarsaison").addEventListener("input",(event)=>{tableGeneratorseason.eventChangeFilterValue(event.target.value);});

        // Chain the next fetch request
        return fetch(`/api/participantmatches?participantName=${participantName}`);
    })
    .then(response => response.json())
    .then(data => {
        tableDatasMatches.JsonDatasToArray(data);

        const tableGeneratormatch = new TableGenerator(tableDatasMatches,"matchestablebody","matchestablehead");
        tableGeneratormatch.generateTable();

        document.getElementById("searchbarmatches").addEventListener("input",(event)=>{tableGeneratormatch.eventChangeFilterValue(event.target.value);});        
        return fetch(`/api/participantinfos?participantName=${participantName}`);
    })
    .then(response => response.json())
    .then(data => {
        let playerInfo = data[0];

        let name = document.getElementById("playername");
        let surname = document.getElementById("playersurname");
        let totalpoints = document.getElementById("playertotalpoints");
        let playersumranking = document.getElementById("playersumranking");
        let playerfavoritequote = document.getElementById("playerfavoritequote");
        let playerparticipation = document.getElementById("playerparticipation");
        
        name.textContent = playerInfo.player_name;
        surname.textContent = playerInfo.player_surname;
        totalpoints.textContent = playerInfo.playertotalscore;
        playersumranking.textContent = playerInfo.average_rank;
        playerfavoritequote.textContent = "soon";
        playerparticipation.textContent = playerInfo.participation;
    })
    .catch(error => console.error('Error fetching data:', error));
});

