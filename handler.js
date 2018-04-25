var express = require('express');
var googlehome = require('./google-home-notifier');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080; // default port

var deviceName = 'Ghom';
var ip = '192.168.1.85'; // default IP

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/google-home-notifier', function(req, res) {
  var text = null;
  var language = 'fr'; // default language code

  if (req.body) {
    if (req.body.text) text = req.body.text;
    if (req.body.language) language = req.body.language;
  }

  // support api.ai webhook
  if (req.body && req.body.queryResult) {
    text = req.body.queryResult.queryText;
  }

  if (text) {
    googlehome.ip(ip, language);
    googlehome.device(deviceName, language);

    try {
      if (text.startsWith('http')) {
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  } else {
    res.send('Please GET "text=Hello Google Home"');
  }
});

app.listen(serverPort, function() {
  console.log('Listening to :8080');
});
