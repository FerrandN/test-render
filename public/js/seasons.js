import{DatasArray} from "./DatasArray.js";
import{SeasonButtonGenerator} from "./SeasonButtonGenerator.js";

const tableDatas = new DatasArray();
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/seasons')
       .then(response => response.json())
       .then(data => {
          tableDatas.JsonDatasToArray(data);
          const bg = new SeasonButtonGenerator(tableDatas);
          bg.fillDiv();
       })
       .catch(error => console.error('Error fetching data:', error));
 });

