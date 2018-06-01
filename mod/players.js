const db = require('./database.js').players;

db.loadDatabase();

exports.getPlayers = (req, res) => {
    db.find({}, (err, playerList) => {
        if (err) 
            res.sendStatus(500);
        res.setHeader('Content-Type', 'application/json');
        return res.json({players: playerList});
    });
};
exports.addPlayer = (req, res) => {
    let user = req.body;
    delete user.id;
    db.insert(user, (err, newUser) => {
        if (err) 
            return res.sendStatus(500);
        return res.status(200).json({id:newUser["_id"]});
    });
};
exports.updatePlayer = (req, res) => {
    let user = req.body;
    let userId = user._id;
    delete user._id;

    db.update({ _id: userId }, user, {}, (err, numReplaced) => {
        if(err) return res.sendStatus(500);
        return res.sendStatus(200);
    });
};
exports.deletePlayer = (req,res) => {
    let userId = req.body.userId;
    
    db.remove({_id:userId}, {}, (err, numRemoved) => {
        if(err || numRemoved != 1) return res.sendStatus(500);
        return res.sendStatus(200);
    });
};
exports.render = (req, res) => {
    return res.render('players', {
        ip: address,
        port: hud_port,
        flags: getFlags()
    });
};