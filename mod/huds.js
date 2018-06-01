const db = require('./database.js').huds;
const fs = require('fs');
const address = require('ip').address();

db.loadDatabase();
module.exports = {
    loadConfig : () => {
        if(!fs.existsSync('./config.json')) return false;
        let config = {};
        try{
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            config.Address = address;
            return config;
        }catch(e){
            console.warn('\n\tConfig file is corrupted or doesn\'t exist, proceeding with default values');
            config.Address = address;
            config.ServerPort = 1248;
            config.GameStateIntegrationPort = 1337;
            config.SteamApiKey = "";
            config.DisplayAvatars = false;
            config.AvatarDirectory = "/public/files/avatars/";
            config.GSIToken = "120987";
            return config;
        }
    },
    getHUDs : (req, res) => {
        if(!fs.existsSync('./public/huds')) return res.sendStatus(500);

        let existingHUDs = fs.readdirSync('./public/huds').filter(function (file) {
            return fs.statSync('./public/huds/'+file).isDirectory();
        });
        function addNewHUDs(err, hudList){
            let tempList = hudList.map(x => x.name);
            let huds = [];
            
            existingHUDs.forEach(function(hud) {
                if(!tempList.includes(hud)){
                    huds.push({name:hud, enabled:false});
                }
            }, this);
            db.insert(huds, (err, newHuds) => {
                hudList = hudList.concat(newHuds);

                for(var i = 0; i < hudList.length; i++){
                    let files = fs.readdirSync('./public/huds/'+hudList[i].name+'/');
                    hudList[i].files = files;
                }
                
                if(err) return res.sendStatus(500);
                return res.status(200).json({huds:hudList});
            });
        }

        function getExistingHUDs(err, numRemoved){
            if(err) return res.sendStatus(500);

            db.find({}, addNewHUDs);
        }
        db.remove({ name: { $nin: existingHUDs }}, { multi: true }, getExistingHUDs);
    },
    setHUD : (req, res) => {   
        let data = req.body;

        let id = data.id;
        let enabled = data.enabled;

        if(!id || enabled == null) return res.sendStatus(500);
        db.update({ _id: id }, { $set: {enabled: enabled}}, {}, (err, numReplaced) => {
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    },

    render: (req, res) => {
        let config = module.exports.loadConfig();
        let id = req.params.id;

        function displayHUD(err, huds){
            if(huds.length != 1) return res.sendStatus(500);

            let hud = huds[0];

            if(!fs.existsSync('./public/huds/default') || !fs.existsSync('./public/huds/' + hud.name + '/template.pug')) return res.sendStatus(500);
            if(!hud.enabled) return res.redirect('/#huds');

            let hud_dir = "/huds/" + hud.name + "/index.js";
            let css_dir = "/huds/" + hud.name + "/style.css";

            return res.render('../public/huds/' + hud.name + '/template.pug', {
                ip: config.Address,
                port: config.ServerPort,
                avatars: config.DisplayAvatars,
                hud: hud_dir,
                css: css_dir
            });
        }

        db.find({ _id : id}, displayHUD);
    },
    
    overlay: (req, res) => {
        return res.render('list.pug');
    }
}