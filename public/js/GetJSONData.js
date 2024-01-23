//One tournament

class GetJSONData
{
    constructor(Data)
    {
        Object.assign(this,Data);
    }

    getValues(){
        return Object.values(this);
    }
}

export{GetJSONData}