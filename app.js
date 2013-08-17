
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var families = [];

function Family(username, lastname) {
	this.username = username;
	this.lastname = lastname;
	this.members = [];
	this.tasks = [];
	this.rewards = [];
	this.currency = 0;

	this.completeTask = function(task) {
		task.completed = true;
		this.currency = this.currency + task.reward;
	}

	this.claimReward = function(reward) {
		reward.earned = true;
		this.currency = this.currency - reward.cost;
	}
}

function Member(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	this.family = getFamilyByUsername(family_username);
}

function Task(name, description, reward) {
	this.name = name;
	this.description = description;
	this.reward = reward;
	this.completed = false;
}

function Reward(name, description, cost) {
	this.name = name;
	this.description = description;
	this.cost = cost;
	this.earned = false;
}

function getFamilyByUsername(family_username) {
	for (var i = 0; i < families.length; i++) {
		if (families[i].username == family_username) return families[i];
	}
	return null;
}