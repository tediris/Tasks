
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
    var currentFamily = getFamilyByUsername(req.body.family_username);
  	currentFamily.addMember(mem);
  	res.json(true);

  	userMap[req.body.username] = currentFamily;

  	res.json(true);
});

app.post('/child/new', function (req, res) {
	if(!req.body.hasOwnProperty('username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('family_username')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var child = new Child(req.body.name, req.body.username, req.body.family_username);
    var currentFamily = getFamilyByUsername(req.body.family_username);

    currentFamily.addMember(child);

    userMap[req.body.username] = currentFamily;
    /*
    currentFamily.members.push(child);
    userMap[req.body.username] = currentFamily;
    console.log(child);
    console.log(currentFamily);
  	*/

  	res.json(true);
});

app.post('/parent/new', function (req, res) {
	if(!req.body.hasOwnProperty('username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('family_username')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var parent = new Parent(req.body.name, req.body.username, req.body.family_username);
    var currentFamily = getFamilyByUsername(req.body.family_username);
    currentFamily.addMember(parent);
    userMap[req.body.username] = currentFamily;

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
  	family.requestedTasks.push(task); //can get the child and do a .request Task too

  	res.json(true);
});

app.post('/child/request_reward', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('description') || 
     !req.body.hasOwnProperty('cost')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var reward = new Reward(req.body.name, req.body.description, req.body.cost);
  	var family = getFamilyByUsername(req.body.family_username);
  	family.requestedRewards.push(task); //can get the child and do a .request Reward too

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

  	res.json(true);
});

app.post('/new_reward', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('description') || 
     !req.body.hasOwnProperty('cost')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var reward = new Reward(req.body.name, req.body.description, req.body.cost);
  	var family = getFamilyByUsername(req.body.family_username);
  	family.tasks.push(reward);

  	res.json(true);
});

app.post('/finish_task', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('username')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var family = getFamilyByUsername(req.body.family_username);
  	var task = getTaskFromFamily(family, req.body.name);
  	var child = family.getUser(req.body.username);
  	

  	child.completeTask(task);

  	//task.completed = true;
  	//family.completeTask(task);
  	res.json(true);

});

app.post('/finish_reward', function (req, res) {
	if(!req.body.hasOwnProperty('family_username') || 
     !req.body.hasOwnProperty('name') || 
     !req.body.hasOwnProperty('username')) {
    	res.statusCode = 400;
    	return res.send('Error 400: Post syntax incorrect.');
  	}

  	var family = getFamilyByUsername(req.body.family_username);
  	var reward = getTaskFromFamily(family, req.body.name);
  	var child = family.getUser(req.body.username);

  	child.claimReward(reward);
  	//reward.earned = true;
  	//family.claimReward(reward);
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

app.get('/requestedtasks/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	var family = getFamilyByUsername(family_username);
	res.json(family.requestedTasks);
});

app.get('/rewards/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	var family = getFamilyByUsername(family_username);
	res.json(family.rewards);
});

app.get('/requestedrewards/:family_username', function (req, res) {
	var family_username = req.params.family_username;
	var family = getFamilyByUsername(family_username);
	res.json(family.requestedRewards);
});

app.get('/all', function (req, res) {
	res.json(families);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



//
//
// Family Model 
//
//

// TO DO: IMPLEMENT SOCIAL ASPECT BY INTRODUCING IDEA OF COMMUNITIES/GROUPS

// var communities = [];
var families = [];
var userMap = {};

// function Community() {
//	
//}

function Family(username, lastname) {
	this.username = username;
	this.lastname = lastname;
	this.members = [];
	this.tasks = [];
	this.requestedTasks = [];
	this.completedTasks = []; 
	this.rewards = [];
	this.requestedRewards = [];
	// this.completedRewards = []; should we keep track of this? probably, people like seeing progress

	this.getUser = function(username) {
		for (var i = 0; i < this.members.length; i++) {
			if (this.members[i].username == username) {
				return this.members[i];
			}
		}
		return null;
	}

	this.addMember = function(member) {
		if (this.members.indexOf(member) == -1) this.members.push(member);
	}
}

function Member(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	userMap[username] = family_username;
}

function Parent(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	userMap[username] = family_username;
	this.createTask = function(task) {
		getFamilyFromUser(this).tasks.push(task);
		this.currentTime = getCurrentTime();
	}

	this.createRewards = function(reward) {
		getFamilyFromUser(this).rewards.push(reward);
	}

	this.approveTask = function(task) {
		for (var i = 0; i < getFamilyFromUser(this).requestedTasks.length; i++) {
			if (getFamilyFromUser(this).requestedTasks[i].name == this.task.name) {
				// add to family tasks
				getFamilyFromUser(this).tasks.push(task);
				task.currentTime = getCurrentTime();
				this.currentTime = getCurrentTime();
				// delete from family requested Tasks
				getFamilyFromUser(this).requestedTasks.splice(i, 1);
				return;
			}
		}
	}

	this.approveReward = function(reward) {
		// add to family rewards
		getFamilyFromUser(this).rewards.push(reward);
		for (var i = 0; i < getFamilyFromUser(this).requestedRewards.length; i++) {
			if (getFamilyFromUser(this).requestedRewards[i] == this.reward) {
				// delete from family requested rewards
				getFamilyFromUser(this).requestedRewards.splice(i, 1);
				return;
			}
		}
	}

}

function Child(name, username, family_username) {
	this.name = name;
	this.username = username;
	this.family_username = family_username;
	userMap[username] = family_username;
	this.requestTask = function(task) {
		getFamilyFromUser(this).requestedTasks.push(task);
	}

	this.requestReward = function(reward) {
		getFamilyFromUser(this).requestedRewards.push(reward);
	}

	this.completeTask = function(task) {
		task.completed = true;
		this.currency = this.currency + task.reward;
		task.completionTime = getCurrentTime();
		// apparently this formula calculates difference between time according to a answers.yahoo post lol
		task.timeToCompleteTask = (task.completionTime.getTime() - task.inceptionTime.getTime()) / 1000;

		var currentFam = getFamilyFromUser(this);

		currentFam.completedTasks.push(task);
		for (var i = 0; i < currentFam.tasks.length; i++) {
			if (currentFam.tasks[i].name == task.name) {
				currentFam.tasks.splice(i, 1);
			}
		}
	}

	this.claimReward = function(reward) {
		reward.earned = true;
		getFamilyFromUser(this).currency = getFamilyFromUser(this).currency - reward.cost;
	}
}

function Task(name, description, reward) {
	this.name = name;
	this.description = description;
	this.reward = reward;
	this.completed = false;
	this.inceptionTime = null;
	this.completionTime = null;
	this.timeToCompleteTask = null;
}

function Reward(name, description, value) {
	this.name = name;
	this.description = description;
	this.value = value;
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

function getFamilyFromUser(user) {
	var family_username = userMap[user.name];
	return getFamilyByUsername(family_username);
}

function getCurrentTime() {
	var currentDate = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	// not sure if i can set things in currentDate object after calling those methods, so creating a new on to be safe
	var dateObject = new Date();
	dateObject.setFullYear(year);
	dateObject.setMonth(month);
	dateObject.setDate(day);
	return dateObject;
}


//
//
// FUNCTIONS FOR DATA ANALYTICS
//
//


// returns a list of lists that contain the month, day, and the number points earned
function pointsEarnedInLastMonth(family) {
	var data = [];
	var currentTime = getCurrentTime;
	var lastFullMonth = currentTime.month;
	var currentYear = currentTime.year;
	for (var i = 0; i < family.completedTasks.length; i++) {
		if ( (family.completedTasks[i].completionTime.getMonth() == lastFullMonth) && (family.completedTasks[i].completionTime.getFullYear() == currentYear()) ) {
			var datapoint = [lastFullMonth, family.completedTasks[i].completionTime.getDate(), family.completedTasks[i].reward];
			data.push(datapoint);
		}
	}
	return data;
}

// returns a list of lists of the task name and time length to complete the task
function averageTimeToCompleteTask(family) {
	var data = []
	for (var i = 0; i < family.completedTasks.length; i++) {
		var datapoint = [family.completedTasks[i].name, family.completedTasks[i].timeToCompleteTask];
		data.push(datapoint);
	}
	return data;
}


// 
//
// API INTEGRATION
//
//


// AT&T SMS API: Send everyone in family a message when a task exists uncompleted for more than a week
// DISCLAIMER: DEVICE MUST BE AT&T Wireless network mobile devices

var APIkey = "el4paner2sjucxk2k02i4w3njnvkwmy7";
var secret = "gy0y5k6rmbzkacspmbyxfveja9en8uaq";

var httpRequest = new XMLHttpRequest();
httpRequest.open("POST", "https://api.att.com/sms/v3/messaging/outbox/", true); // boolean at end determines asynchronous or not
httpRequest.send();
console.log('all response headers: ' + httpRequest.getAllResponseHeaders());
console.log('status: ' + httpRequest.status);
console.log('response test: ' + httpRequest.responseText);

//var ? = 
//"
//POST /sms/v3/messaging/outbox/ 
//Authorization: Bearer xyz123456789  // <-- after bearer, i need my authorization token
//Accept: application/xml  // I want xml format
//Content-Type: application/xml 

//<outboundSMSRequest>
//    <address>tel:+13500000992,tel:+13500000993</address>
//    <message>HelloWorld</message>
//</outboundSMSRequest>  
//" ;
//

