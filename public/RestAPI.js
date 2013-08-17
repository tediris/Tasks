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

function requestReward(family_username, name, description, reward) {
	$.post('/child/request_task', {family_username: family_username, name: name, description: description, reward: reward});
}

function newTask(family_username, name, description, reward) {
	$.post('/new_task', {family_username: family_username, name: name, description: description, reward: reward});
}

function newReward(family_username, name, description, cost) {
	$.post('/new_task', {family_username: family_username, name: name, description: description, cost: cost});
}