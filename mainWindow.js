let renderer = require('./renderer.js');
let fs = require('fs');

const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm (e){
    e.preventDefault();
    
    let dtcFile = document.querySelector('#dtc-file').files[0].path;
    let dtcString = document.querySelector('#dtc-string').value;


    fs.readFile(dtcFile, function (err, data) {
        if (err) {
            return console.error(err);
        }
        //console.log('doc ' + data);
        let results = renderer.getFaults(data, dtcString);
        
    });
}

form.addEventListener('change', updateFileName);

function updateFileName (e) {
    console.log('dom',document.querySelector('.file-name').innerHTML)
    document.querySelector('.file-name').innerHTML = e.target.files[0].name;
}