class SeasonButtonGenerator
{
    constructor(datasArray)
    {
        this.datasArray = datasArray;
        this.DivToFill = document.getElementById("seasonsLink");
    }

    fillDiv()
    {
        this.DivToFill.innerHTML = "";
        let i = 0;
        for(let datas of this.datasArray.DatasList)
        {
            i++;
            let a = document.createElement("a");
            let sdate = new Date(datas.starting_date);
            let formattedDate = sdate.getFullYear() + "-" + ('0' + (sdate.getMonth() + 1)).slice(-2) + "-" + ('0' + sdate.getDate()).slice(-2);
            a.text = formattedDate;
            a.setAttribute("href", "./season.html?starting_date=" + formattedDate + "&id=" + i);
            a.setAttribute("class", "linkToSeasonPage");
            a.setAttribute("id", "linkToSeasonPage" + i);
            this.DivToFill.appendChild(a);
        }
    }
}
export {SeasonButtonGenerator}