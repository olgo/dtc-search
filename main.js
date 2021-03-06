const electron = require('electron');
const url = require('url');
const path = require('path');

//get app and browser window from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

//var remote = require('remote'); // Load remote compnent that contains the dialog dependency
//var dialog = remote.require('dialog'); // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

//declare main window
let mainWindow;

let infoWindow;

//listen for app to be ready
app.on('ready', function (){
    //create new window
    mainWindow = new BrowserWindow({});

    //load html file to window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    //quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//handle create info window
function createInfoWindow(){
    infoWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Info'
    });

    infoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'infoWindow.html'),
        protocol:'file:',
        slashes:true
    }));

    infoWindow.on('close', function(){
        infoWindow = null;
    });
}

//create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Item'
            },
            {
                label:'Clear Items'
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'About',
        submenu:[
            {
                label:"Info",
                click(){
                    createInfoWindow();
                }
            }
        ]
    }
];

// if mac, add empty object to prevent "electron" from showing as first menu item
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:"Toggle Dev Tools",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I'
            },
            {
                role:'reload'
            }
        ]
    });
}
