function streamFile(file, string){
    if (file) {

        faultString(string);

        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {

            // browser completed reading file - display it
            json = xml2json( parseXml(e.target.result), "" );
            json = JSON.parse(json);
            parseJson(json);
        };
        
    }else{
        console.log('no file selected!');
    }
}


function parseJson(json) {
    console.log(json);

    var faultData = json.Workbook.Worksheet[0].Table.Row

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
            console.log(e);
        }
    }

    console.log(results);

    var table = document.createElement("table");
    var row = table.innerHTML.createElement("row");

    document.write('test');
}

function faultString(s) {
    s = s.replace(/\s/g, '');
    console.log(s);
    var request = s.substr(0,6);
    var faults = s.substr(6, s.length);

    while(faults.length > 0){
        parsedFaults.push(faults.substr(0,8));
        console.log("added");
        faults = faults.replace(faults.substr(0,8), '');
    }

    console.log(parsedFaults);

}