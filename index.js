const http = require('http'),
    apps = require('express'),
    app = apps(),
    request = require('request'),
    express = require('http').Server(app),
    io = require('socket.io')(express),
    fs = require('fs'),
    address = require('ip').address(),
    players = require('./mod/players.js'),
    teams = require('./mod/teams.js'),
    huds = require('./mod/huds.js');

var recent_update;
var match = null;
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/teams')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
});

var upload = multer({ storage: storage });

const config = huds.loadConfig();

const bodyParser = require('body-parser');

function getFlags(){
    let flags = [];
    fs
        .readdirSync('./public/files/img/flags/')
        .forEach(file => {
            if (file.substr(-4, 4) == '.png') {
                flags.push(file.substr(0, file.indexOf('.png')));
            }
        });
    return flags;
}

function status(bool) {
    return JSON.stringify({"status": bool});
}

var download = function (uri, filename, callback) {
    request.head(uri, (err, res, body) => {
        request(uri)
            .pipe(fs.createWriteStream(filename))
            .on('close', callback);
    });
};

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(apps.static(__dirname + '/public'));

app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    return res.render('index', {
        ip: config.Address,
        port: config.ServerPort,
        flags: getFlags()
    });
});

app.get('/huds', huds.overlay);

app.get('/huds/:id([^\\\/]+)', huds.render);

app.get('/api/huds', huds.getHUDs);

app.post('/api/huds', huds.addHUD);

app.patch('/api/huds', huds.setHUD);

app.delete('/api/huds', huds.deleteHUD);

app.get('/teams', teams.render);

app.get('/api/teams', teams.getTeams);

app.post('/api/teams', upload.single('logo'), teams.addTeam);

app.patch('/api/teams', upload.single('logo'), teams.updateTeam);

app.delete('/api/teams', teams.deleteTeam);

app.delete('/api/teams_logo', teams.deleteLogo);

app.get('/players', players.render);

app.get('/api/players', players.getPlayers);

app.post('/api/players', players.addPlayer);

app.patch('/api/players', players.updatePlayer);

app.delete('/api/players', players.deletePlayer);


app.get('/av/:sid([0-9]+)', (req, res) => {
    let steam_id = req.params.sid;

    let filename = steam_id + '.png';
    let filepath = config.AvatarDirectory + filename;

    let bodyChunks = [];
    let data;

    if (fs.existsSync(filepath)) {
        let file = fs.readFileSync(filepath);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': file.length
        });
        return res.end(file);
    } else {
        let getPlayerCallback = (ans) => {
            ans.on('data', (chunk) => {
                bodyChunks.push(chunk);
            }).on('end', endCallback)
        }
        let endCallback = () => {
            let body = Buffer.concat(bodyChunks);

            try {
                data = JSON.parse(body).response;
                if (data && data.players) {
                    download(data.players[0].avatarfull, config.AvatarDirectory + filename, () => {
                        let file = fs.readFileSync(filepath);
                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': file.length
                        });
                        return res.end(file);
                    });
                }
            } catch (e) {
                return res.sendStatus(500);
            }
        }

        let request = http.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.SteamApiKey + '&steamids=' + steam_id, getPlayerCallback);
        request.on('error', (e) => {
            return res.sendStatus(500);
        });
    }
});
io.on('connection', (socket) => {
    socket.on('update', (data) => {
        io.emit(data);
    });
    socket.on('ready', () => {
        if(match){
            socket.emit('match', match);
        }
        if (recent_update) {
            socket.emit("update", recent_update);
        }
    });
    socket.on('update_match', (data) => {
        match = data;
        io.emit('match', data);
    });
    socket.on('refresh', (data) => {
        io.emit('refresh', data);
    });
});

express.listen(config.ServerPort, address || 'localhost', () => {
    console.log('\n\tOpen http://' + address + ':' + config.ServerPort + ' in a browser to connect to HUD');
    console.log('\n');
});

server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.method != "POST") {
        return res.end('');
    }
    let body,
        data,
        bodyChunks = [];
    req.on('data', (data) => {
        bodyChunks.push(data);
    });
    req.on('end', () => {
        body = Buffer.concat(bodyChunks);
        data = JSON.parse(body);
        if (data.auth && data.auth.token == config.GSIToken) {
            recent_update = data;
            update(data);
        }
        res.end('');
    });

});

function update(json) {
    io.emit("update", json);
}
server.listen(config.GameStateIntegrationPort);
