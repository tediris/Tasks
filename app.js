
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

app.post('/new_user', function (req, res) {
	if(!req.body.hasOwnProperty('username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('family_username')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var mem = new Member(req.body.name, req.body.username, req.body.family_username);
  	var currentFamily = lookupUserFamily(mem.username);
  	currentFamily.members.push(mem);
  	res.json(true);
});

app.post('/new_family', function(req, res) {
	if(!req.body.hasOwnProperty('username') || 
     !req.body.hasOwnProperty('lastname')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var fam = new Family(req.body.username, req.body.lastname);
  	families.push(fam);
  	res.json(true);
});

app.post('/new_task', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('description') || 
     !req.body.hasOwnProperty('reward')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var task = new Task(req.body.name, req.body.description, req.body.reward);
  	var family = getFamilyByUsername(req.body.family_username);
  	family.tasks.push(task);
});

app.post('/new_reward', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('description') || 
     !req.body.hasOwnProperty('cost')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var reward = new Task(req.body.name, req.body.description, req.body.cost);
  	var family = getFamilyByUsername(req.body.family_username);
  	family.tasks.push(reward);
});

app.post('/child/request_task', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('description') || 
     !req.body.hasOwnProperty('reward')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var task = new Task(req.body.name, req.body.description, req.body.reward);
  	var family = getFamilyByUsername(req.body.family_username);
  	family.tasks.push(task);
});

app.post('/finish_task', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var family = getFamilyByUsername(req.body.family_username);
  	var task = getTaskFromFamily(family, req.body.name);
  	task.completed = true;
  	family.completeTask(task);
  	res.json(true);

});

app.post('/finish_reward', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var family = getFamilyByUsername(req.body.family_username);
  	var reward = getTaskFromFamily(family, req.body.name);
  	reward.earned = true;
  	family.claimReward(reward);
  	res.json(true);

});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/family/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	res.json(getFamilyByUsername(family_username));
})

app.get('/user/:username', function (req, res) {
	var username = req.params.username;
	var result = {};
	var family = lookupUserFamily(username);
	result['user'] = family.getUser(username);
	result['family'] = family;
	res.json(result);
});

app.get('/tasks/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	var family = getFamilyByUsername(family_username);
	res.json(family.tasks);
});

app.get('/rewards/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	var family = getFamilyByUsername(family_username);
	res.json(family.rewards);
});

app.get('/all', function (req, res) {
	res.json(families);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var families = [];
var userMap = {};

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

	this.getUser = function(username) {
		for (int i = 0; i < this.members.length; i++) {
			if (this.members[i].username == username) return this.members[i];
		}
		return null;
	}
}

function Member(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	this.family = getFamilyByUsername(family_username);
	userMap[username] = family_username;
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

function lookupUserFamily(username) {
	return userMap[username];
}

function getFamilyByUsername(family_username) {
	for (var i = 0; i < families.length; i++) {
		if (families[i].username == family_username) return families[i];
	}
	return null;
}

function getTaskFromFamily(family, taskname) {
	for (var i = 0; i < family.tasks; i++) {
		if (family.tasks[i] == taskname) return family.tasks[i];
	}

	return null;
}

function getRewardFromFamily(family, rewardname) {
	for (var i = 0; i < family.rewards; i++) {
		if (family.rewards[i] == rewardname) return family.rewards[i];
	}

	return null;
}