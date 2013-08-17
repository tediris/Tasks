function addFamily(family_name, family_username) {
	$.post('/new_family', {username: family_username, lastname: family_name});
}

function addChild(name, username, family_username) {
	$.post('/child/new', {name: name, username: username, family_username: family_username});
}

function addParent(name, username, family_username) {
	$.post('/child/new', {name: name, username: username, family_username: family_username});
}

function addTask(family_username, task) {
	
}