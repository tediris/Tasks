
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
	this.requestedTasks = [];
	// this.completedTasks = []; should we keep track 
	this.rewards = [];
	this.requestedRewards = [];
	this.currency = 0;

}

function Member(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	this.family = getFamilyByUsername(family_username);
}

function Parent() {
	Parent.inherits(Member);
	this.createTask = function(task) {
		this.family_username.tasks.push(task);
	}

	this.createRewards = function(reward) {
		this.family_username.rewards.push(reward);
	}

	this.approveTask = function(task) {
		for (var i = 0; i < this.family_username.requestedTasks.length; i++) {
			if (this.family_username.requestedTasks[i] == this.task) {
				// add to family tasks
				this.family_username.tasks.push(task);

				// delete from family requested Tasks
				this.family_username.requestedTasks.splice(i, 1);
				return;
			}
		}
	}

	this.approveReward = function(reward) {
		for (var i = 0; i < this.family_username.requestedRewards.length; i++) {
			if (this.family_username.requestedRewards[i] == this.reward) {
				// add to family rewards
				this.family_username.rewards.push(reward);

				// delete from family requested rewards
				this.family_username.requestedRewards.splice(i, 1);
				return;
			}
		}
	}
	
}

function Child() {
	Child.inherits(Member);
	this.requestTask = function(task) {
		this.family_username.requestedTasks.push(task);
	}

	this.requestReward = function(reward) {
		this.family_username.requestedRewards.push(reward);
	}

	this.completeTask = function(task) {
		task.completed = true;
		this.currency = this.currency + task.reward;
	}

	this.claimReward = function(reward) {
		reward.earned = true;
		this.currency = this.currency - reward.cost;
	}
}




function Task(name, description, value) {
	this.name = name;
	this.description = description;
	this.value = value;
	this.completed = false;
}

function Reward(name, description, value) {
	this.name = name;
	this.description = description;
	this.value = value;
	this.earned = false;
}

function getFamilyByUsername(family_username) {
	for (var i = 0; i < families.length; i++) {
		if (families[i].username == family_username) return families[i];
	}
	return null;
}