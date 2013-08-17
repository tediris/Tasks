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
	$.post('/new_task', {family_username: family_username, name: name, description: description, cost: cost});
}

function completeTask(family_username, task_name, username) {
	$.post('/finish_task', {family_username: family_username, name: name, username: username});
}

function claimReward(family_username, reward_name, username) {
	$.post('/finish_reward', {family_username: family_username, name: name, username: username});
}