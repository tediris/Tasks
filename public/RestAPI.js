function addFamily(family_name, family_username) {
	$.post('/new_family', {username: family_username, lastname: family_name});
}

function addChild(name, username, family_username) {
	$.post('/child/new', {name: name, username: username, family_username: family_username});
}

function addParent(name, username, family_username) {
	$.post('/child/new', {name: name, username: username, family_username: family_username});
}

function requestTask(family_username, name, description, reward) {
	$.post('/child/request_task', {family_username: family_username, name: name, description: description, reward: reward});
}

function requestReward(family_username, name, description, cost) {
	$.post('/child/request_task', {family_username: family_username, name: name, description: description, cost: cost});
}

function newTask(family_username, name, description, reward) {
	$.post('/new_task', {family_username: family_username, name: name, description: description, reward: reward});
}

function newReward(family_username, name, description, cost) {
	$.post('/new_reward', {family_username: family_username, name: name, description: description, cost: cost});
}

function completeTask(family_username, task_name, username) {
	$.post('/finish_task', {family_username: family_username, name: task_name, username: username});
}

function claimReward(family_username, reward_name, username) {
	$.post('/finish_reward', {family_username: family_username, name: reward_name, username: username});
}

function getUser(username, callback) { //callback format should be function callback(data) {};
	$.get('/user/' + username, callback); 
	//the callback function will get a json object representing the user and their family. Process
	//this however you want to (i.e. to populate the UI)
}

function getFamily(family_username, callback) {
	$.get('/family/' + family_username, callback);
}

function getTasks(family_username, callback) {
	$.get('/tasks/' + family_username, callback);
}

function getRequestedTasks(family_username, callback) {
	$.get('/requestedtasks/' + family_username, callback);
}

function getRewards(family_username, callback) {
	$.get('/rewards/' + family_username, callback);
}

function getRequestedRewards(family_username, callback) {
	$.get('/requestedrewards/' + family_username, callback);
}