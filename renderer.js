let {xml2json, parseXml} = require('./js/parse.js')

//sample
//59 72 FB 02 10 01 A3 02 34 01 23 02 3C 01 23

exports.getFaults = (dtcFile, dtcStr, callback) => {
    let parsedFaults = parseFaultsFromString(dtcStr)
    dtcFile = parseXml(dtcFile);
    dtcFile = xml2json(dtcFile, "");
    //console.log(dtcFile);
    dtcFile = JSON.parse(dtcFile);
    dtcFile = getFaultsFromJson(dtcFile, parsedFaults);
    
    let results = dtcFile;

    let table = document.querySelector('table');
    let headers = ['id','name','status'];
    let trHeaders = document.createElement('tr');
    table.appendChild(trHeaders);
    for(let value of headers){

        let th = document.createElement('th');
        let text = document.createTextNode(value);
        th.appendChild(text);

        trHeaders.appendChild(th);
    }
    
    for (var value of results) {
        console.log("fault");
        console.log(value);

        displayDTCs(value);
    }
}

function displayDTCs(item){
    let table = document.querySelector('table');
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let itemText = document.createTextNode(item.id);
    tdId.appendChild(itemText);

    let tdName = document.createElement('td');
    let itemName = document.createTextNode(item.name);
    tdName.appendChild(itemName);

    let tdStatus = document.createElement('td');
    let itemStatus = document.createTextNode(item.status);
    tdStatus.appendChild(itemStatus);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdStatus);

    table.appendChild(tr);
}

function parseFaultsFromString(s) {

    s = s.replace(/\s/g, '');
    //console.log(s);

    let request = s.substr(0,6);
    let faults = s.substr(6, s.length);
    let parsedFaults = [];

    while(faults.length > 0){
        parsedFaults.push(faults.substr(0,8));
        faults = faults.replace(faults.substr(0,8), '');
    }

    console.log(parsedFaults);
    return parsedFaults;
}

function getFaultsFromJson(json, parsedFaults) {
    console.log(json);

    let faultData = json.Workbook.Worksheet[0].Table.Row
    let results = [];

    console.log(faultData.length + " faults to search");
    for(var i = 0; i < faultData.length; i++){

        try{

            var fid = String(faultData[i].Cell[2].Data["#text"]);
            var fname = String(faultData[i].Cell[0].Data["#text"]);
            
            for(var j = 0; j < parsedFaults.length; j++){
                
                pid = String( "0x" + parsedFaults[j].substr(0,4));
                
                if( fid.includes( pid ) ){
                    
                    var o = {
                        name:fname,
                        id:fid,
                        status:parsedFaults[j].substr(4,parsedFaults[j].length)
                    };
                    
                    //console.log('comparing ' + fid + ' with ' +  "0x" + parsedFaults[j].substr(0,4));     
                    results.push( o )

                }
            }
        }catch(e){
            //nothing
            console.log('err ' + e);
        }
    }

    console.log(results);

    return results;
}