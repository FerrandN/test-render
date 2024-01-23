//Class aim to fill HTML table with associated JSON Datas

class TableGenerator
{
    constructor(datasArray, tablebody, tablehead)
    {
        this.datasArray = datasArray;
        this.tBody = document.getElementById(tablebody);
        this.tHead = document.getElementById(tablehead);
        this.tableMax = "all";
        this.filterValue = "";
        this.isSortedBy = "";
    }

    generateTable()
    {
        //reset table
        this.tHead.innerHTML="";
        this.tBody.innerHTML="";

        let data = this.datasArray.DatasList[0];
        //do nothing if there's no data
        if(data == null || data == undefined)
        {
            let maindiv = document.getElementsByClassName("maincontentdiv");
            let p = document.createElement("p");
            p.textContent = "No datas, please retry later";
            p.id = "nodata";
            maindiv[0].appendChild(p);
            return
        }

        let trh = this.generateTRH(data);
        this.tHead.appendChild(trh);

        //create new array with datas to display
        let newArray = [];
        //store each values from the datas into an array
        for (let datas of this.datasArray.DatasList) {
            const objectValues = Object.values(datas);
            let found = false;
            //check if the given value to push is already in the array or if it contains the filter value
            for (let values of objectValues) {
                if(typeof values != "string")
                {
                    if(values == null)
                    {
                        values = "null";
                    }
                    values = values.toString();
                }

                if (values.includes(this.filterValue)) 
                {
                    if (!found) {
                        newArray.push(datas);
                        found = true;
                    }
                }
            }
        }

        if(this.filterValue != "all")
        {
            while(newArray.length > this.tableMax)
            {
                newArray.splice(-1);
            }
        }
        
        for(let datas of newArray)
        {
            this.addTRToBody(datas);
        }
        this.setEventListener();
    }

    generateTRH(data)
    {
        let tr = document.createElement("tr");
        const keys = Object.keys(data);
        for (let vals of keys) 
        {
            tr.appendChild(this.generateHeader(vals));
        }
        return tr;
    }

    generateTRB(data)
    {
        let tr = document.createElement("tr");
        const keys = Object.values(data);
        for (let vals of keys) 
        {
            tr.appendChild(this.generateCell(vals));
        }
        return tr;
    }

    generateHeader(val)
    {
        let th = document.createElement("th");
        th.textContent = val;
        th.addEventListener("click",()=>{this.sortArray(val)});
        th.textContent = th.textContent.charAt(0).toUpperCase() + th.textContent.slice(1);
        return th;
    }

    generateCell(val)
    {
        let td = document.createElement("td");
        td.textContent=val;
        return td;
    }

    addTRToBody(datas)
    {
        let trb = this.generateTRB(datas);
        this.tBody.appendChild(trb);
    }

    eventChangeTableMax(val)
    {
        if(val != "" || val != null)
        {
            this.tableMax = val;
        }
        this.generateTable();
    }

    eventChangeFilterValue(val)
    {
        this.filterValue = val;
        this.generateTable();
    }

    sortArray(val)
    {
        //if val was already sorted by ASC sort it by DESC
        if(this.isSortedBy == val)
        {
            this.datasArray.DatasList.sort((a, b) => 
        {
            let nameA = a[val];
            let nameB = b[val];

            if (this.stringAsLetters(nameA)) {
                nameA = nameA.toLowerCase();
            }
            if (this.stringAsLetters(nameB)) {
                nameB = nameB.toLowerCase();
            }

            if (nameA > nameB) {
                return -1;
            }
            if (nameA < nameB) {
                return 1;
            }

            return 0;
        });
            this.isSortedBy = "";
            this.generateTable();
        }

        //Else it wasn't already sorted, so sort it by ASC
        else
        {
        this.datasArray.DatasList.sort((a, b) => 
        {
            let nameA = a[val];
            let nameB = b[val];

            if(this.stringAsLetters(nameA))
            {
                nameA = nameA.toLowerCase();
            }
            if(this.stringAsLetters(nameB))
            {
                nameB = nameB.toLowerCase();
            }

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            
            return 0;
            });
        this.isSortedBy = val;
        this.generateTable();
        }
    }

    stringAsLetters(string)
    {
        return /[a-zA-Z]/.test(string);
    }

    setEventListener()
    {
        for(let rowIndex = 0; rowIndex < this.tBody.rows.length; rowIndex++)
        {
            let currentRow = this.tBody.rows[rowIndex];

            for(let cellIndex = 0; cellIndex < currentRow.cells.length; cellIndex++)
            {
                let currentCell = currentRow.cells[cellIndex];
                
                let headerCell = this.tHead.rows[0].cells[cellIndex];

                if (headerCell.textContent === 'Player_nickname')
                {
                    currentCell.addEventListener("click", (event) =>{
                        window.location.href = "participant.html?participantName="+ encodeURIComponent(event.target.textContent);
                    });
                    currentCell.id = "playerName";
                }
                if (headerCell.textContent === 'Tournament_name')
                {
                    currentCell.addEventListener("click", (event) =>{
                        window.location.href = "tournament.html?tournamentName="+ encodeURIComponent(event.target.textContent);
                    });
                    currentCell.id = "tournamentName";
                }
                if (headerCell.textContent === 'starting_date')
                {
                    currentCell.addEventListener("click", (event) =>{
                        window.location.href = "season.html?starting_date="+ encodeURIComponent(event.target.textContent);
                    });
                    currentCell.id = "tournamentName";
                }
            }
        }
    }
}
export{TableGenerator}