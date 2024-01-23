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
            let sdate = datas.starting_date.split('T');
            a.text = sdate[0];
            a.setAttribute("href","./season.html?starting_date=" + sdate[0] + "&id=" + i);
            a.setAttribute("class","linkToSeasonPage");
            a.setAttribute("id","linkToSeasonPage" + i);
            this.DivToFill.appendChild(a);
        }
    }
}
export {SeasonButtonGenerator}