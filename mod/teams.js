const db = require('./database.js').teams;
const fs = require('fs');

db.loadDatabase();

exports.getTeams = (req, res) => {
    db.find({}, (err, teamList) => {
        if (err) return res.sendStatus(500);
        res.setHeader('Content-Type', 'application/json');
        return res.json({teams: teamList});
    });
};
exports.addTeam = (req, res) => {
    let team = req.body;
    delete team._id;

    if(req.file) team.logo = req.file.filename;
    
    db.insert(team, (err, newTeam) => {
        if (err) return res.sendStatus(500);
        return res.status(200).json({id:newTeam["_id"]});
    });
};
exports.updateTeam = (req, res) => {
    let team = req.body;
    let teamId = team._id;
    delete team._id;

    if(req.file) team.logo = req.file.filename;

    function removeLogoFile(err, teamList){
        if(err) return res.sendStatus(500);
        if(!teamList[0]) return res.sendStatus(200);

        if(fs.existsSync('./public/teams/' + teamList[0].logo)) fs.unlinkSync('./public/teams/' + teamList[0].logo);

        db.update({ _id: teamId }, { $set: {team_name: team.team_name, short_name:team.short_name, country_code:team.country_code, logo:team.logo}}, {}, (err, numReplaced) => {
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }

    
    db.find({_id:teamId}, removeLogoFile);
};
exports.deleteTeam = (req,res) => {
    let teamId = req.body.teamId;

    function removeTeam(err, teamList) {
        if(err) return res.sendStatus(500);
        if(!teamList[0]) return res.sendStatus(200);

        if(fs.existsSync('./public/teams/' + teamList[0].logo)) fs.unlinkSync('./public/teams/' + teamList[0].logo);

        db.remove({_id:teamId}, {}, (err, numRemoved) => {
            if(err || numRemoved != 1) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }

    db.find({_id:teamId}, removeTeam);
};
exports.deleteLogo = (req,res) => {
    let teamId = req.body.teamId;

    function removeLogoFile(err, teamList){
        if(err) return res.sendStatus(500);
        if(!teamList[0]) return res.sendStatus(200);

        if(fs.existsSync('./public/teams/' + teamList[0].logo)) fs.unlinkSync('./public/teams/' + teamList[0].logo);

        db.update({ _id: teamId }, { $set: {logo:null}}, {}, (err, numReplaced) => {
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }
    db.find({_id:teamId}, removeLogoFile);
};

exports.render = (req,res) => {
    return res.render('teams', {
        ip: address,
        port: hud_port,
        flags: getFlags()
    });
};