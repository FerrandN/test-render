import { GetJSONData } from "./GetJSONData.js";

class DatasArray {
  constructor() {
    this.DatasList = [];
    this.DatasListCopy = [];
  }

  JsonDatasToArray(data) {
    this.DatasList = data.map(c => new GetJSONData(c));
    this.DatasListCopy = Array.from(this.DatasList);
  }
}

export { DatasArray };