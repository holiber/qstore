var json = JSON.stringify;

// initialization tests
test('initialisation', function() {
	expect(5);

	ok(!!Qstore, 'Qstore exist');

	var fruits = new Qstore([
		{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
		{type: 'pear', color: 'green', weight: 0.4, price: 2}
	]);

	equal(json(fruits.rows), '[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":2,"type":"pear","color":"green","weight":0.4,"price":2}]', 'Object notation rows');
	equal(json(fruits.columns), '["idx","type","color","weight","price"]', 'Object notation columns');

	var fruits = new Qstore({
		columns: ['type', 'color', 'weight', 'price'],
		rows: [
			['apple', 'red', 0.25, 1.5],
			['pear', 'green', 0.4, 2]
		]
	});

	equal(json(fruits.rows), '[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":2,"type":"pear","color":"green","weight":0.4,"price":2}]', 'Reduce notation rows');
	equal(json(fruits.columns), '["idx","type","color","weight","price"]', 'Reduce notation columns');
});


// make collections for testing

window.fruits = new Qstore({
	columns: ['type', 'color', 'weight', 'price'],
	rows: [
		['apple', 'red', 0.25, 1.5],
		['pear', 'green', 0.4, 2],
		['pear', 'red', 0.3, 1.8],
		['apple', 'yellow', 0.26, 1.2],
		['pineapple', 'yellow', 1, 4],
		['banana', 'yellow', 0.3, 1.5],
		['melon', 'yellow', 3, 3],
		['watermelon', 'green', 10, 5],
		['apple', 'green', 0.24, 1],
		['strawberries', 'red', 0.1, 0.2]
	]
});

window.usersMessages = new Qstore ({
	columns: ['text', 'subject', 'user'],
	rows: [
		['Hi', 'new year', {id: 1, name: 'Bob', company: {name: 'IBM', phone: '+9999'} }],
		['Happy new year!', 'new year', {id: 2, name: 'Kate', company: {name: 'Microsoft', phone: '+8888'}}],
		['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
		['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
	]
});

window.messages = new Qstore ({
	columns: ['text', 'subject', 'user'],
	rows: [
		['Hello world!', 'programming', {id: 1, name: 'Bob'}],
		['Happy new year!', 'new year', {id: 2, name: 'Kate'}],
		['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
		['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
	]
});

window.diet = new Qstore ({
	columns: ['month', 'breakfast', 'dinner'],
	rows: [
		['april', {calories: 400, food: 'egg'}, {calories: 300, food: 'soup'}],
		['may', {calories: 300, food: 'bacon'}, {calories: 500, food: 'soup'}],
		['june', {calories: 350, food: 'porridge'}, {calories: 300, food: 'chicken'}]
	]
});

window.users = new Qstore ([
	{id: 1, name: 'Bob', friends: ['Mike', 'Sam']},
	{id: 2, name: 'Martin', friends: ['Bob']},
	{id: 3, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
	{id: 4, name: 'Sam', friends: []}
]);

window.costumes = new Qstore([
	{name: 'policeman', items: [ {name: 'tie', color: 'black'}, {name: 'cap', color: 'blue'}]},
	{name: 'fireman', items: [{name: 'helmet', color: 'yellow'}]},
	{name: 'solder', items: [{name: 'helmet', color: 'green'}]},
	{name: 'zombie', items: [{name: 'skin', color: 'green'}, {name: 'brain', color: 'pink'}]}
]);

window.clothes =  new Qstore([
	{name: 'skirt', sizes: [42, 48, 50]},
	{name: 'jeans', sizes: [48, 54]},
	{name: 'skirt', sizes: [42, 45, 48]}
]);

window.usersChanges = new Qstore ({
	columns: ['source', 'patch'],
	rows: [
		[{id: 2, name: 'Bob', age: 23}, {name: 'Mike'}],
		[{id: 4, name: 'Stan', age: 30}, {age: 31}]
	]
});


// other tests

test('data search', 10, function() {

	equal(json(clothes.find(true)),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":2,"name":"jeans","sizes":[48,54]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'true as query'
	);

	equal(json(clothes.find({name: 'jeans'})),
		'[{"idx":2,"name":"jeans","sizes":[48,54]}]',
		'simple search'
	);

	equal(json(fruits.find({color: ['red', 'green'], price: {$gt: 0.5, $lt: 1.5}})),
		'[{"idx":9,"type":"apple","color":"green","weight":0.24,"price":1}]',
		'"or" condition and simple operators'
	);

	equal(json(clothes.find({name: /rt/})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'regexp'
	);

	equal(json(clothes.find(function (row) { if (row.name == 'skirt') return true})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'function as condition'
	);

	equal(json(usersMessages.find({subject: 'new year', 'user.name': 'Bob', 'user.company.name': 'IBM'})),
		'[{"idx":1,"text":"Hi","subject":"new year","user":{"id":1,"name":"Bob","company":{"name":"IBM","phone":"+9999"}}}]',
		'deep search (long syntax)'
	);

	equal(json(usersMessages.find({subject: 'new year', user: {name: 'Bob', company: {name: 'IBM'} }})),
		'[{"idx":1,"text":"Hi","subject":"new year","user":{"id":1,"name":"Bob","company":{"name":"IBM","phone":"+9999"}}}]',
		'deep search (short syntax)'
	);

	equal(json(diet.find({'dinner.calories': {$lt: '$.breakfast.calories'} })),
		'[{"idx":1,"month":"april","breakfast":{"calories":400,"food":"egg"},"dinner":{"calories":300,"food":"soup"}},{"idx":3,"month":"june","breakfast":{"calories":350,"food":"porridge"},"dinner":{"calories":300,"food":"chicken"}}]',
		'Comparison of fields'
	);

	equal(json(fruits.find({$and: [{type: 'apple'}, {color: 'yellow'}]})),
		'[{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2}]',
		'$and operator'
	);

	equal(json(clothes.find({sizes: {$has: 42}})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'$has operator'
	)
});


test('limits', 3, function() {

	equal(json(fruits.find({type: 'apple'}, true, {limit: 2})),
		'[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2}]',
		'limit: to'
	);

	equal(json(fruits.find({type: 'apple'}, true, {limit: [2]})),
		'[{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2},{"idx":9,"type":"apple","color":"green","weight":0.24,"price":1}]',
		'limit: [from]'
	);

	equal(json(fruits.find({color: 'yellow'}, true, {limit: [2,3]})),
		'[{"idx":5,"type":"pineapple","color":"yellow","weight":1,"price":4},{"idx":6,"type":"banana","color":"yellow","weight":0.3,"price":1.5}]',
		'limit: [from, to]'
	);

});


test('fields selection', 6, function () {

	equal(json(fruits.find({type: 'apple'}, ['type', 'color', 'price'])),
		'[{"price":1.5,"color":"red","type":"apple"},{"price":1.2,"color":"yellow","type":"apple"},{"price":1,"color":"green","type":"apple"}]',
		'simple fields selection'
	);

	equal(json(messages.find({subject: 'new year'}, ['text', 'user.name:userName'])),
		'[{"userName":"Kate","text":"Happy new year!"},{"userName":"James","text":"Anyone want to dance?"}]',
		'aliases'
	);

	equal(json(messages.find({subject: 'new year'}, {text: true, 'user.name:userName': true})),
		'[{"text":"Happy new year!","userName":"Kate"},{"text":"Anyone want to dance?","userName":"James"}]',
		'object notation'
	);

	equal(json(usersChanges.find(true, ['source.id:id', 'patch:'])),
		'[{"name":"Mike","id":2},{"age":31,"id":4}]',
		'fields extraction'
	);

	equal(json(clothes.find(true, ['name', 'sizes.$length:sizesCount'])),
		'[{"sizesCount":3,"name":"skirt"},{"sizesCount":2,"name":"jeans"},{"sizesCount":3,"name":"skirt"}]',
		'functions usage'
	);

	equal(json(costumes.find(true, ['name', 'items.$getList("color"):colors'])),
		'[{"colors":["black","blue"],"name":"policeman"},{"colors":["yellow"],"name":"fireman"},{"colors":["green"],"name":"solder"},{"colors":["green","pink"],"name":"zombie"}]',
		'functions with additional arguments'
	)
});


test('getList', 5, function () {
	equal(json(fruits.getList()), '[1,2,3,4,5,6,7,8,9,10]', '.getList()');
	equal(json(fruits.getList('color')), '["red","green","yellow"]', '.getList(fieldName)');
	equal(json(fruits.getList({type: 'pear'}, 'color')), '["green","red"]', '.getList(query, fieldName)');
	equal(json(messages.getList('user.name')), '["Bob","Kate","Stan","James"]', 'deep fields');
	equal(json(users.getList('friends.$length')), '[2,1,3,0]', 'functions usage');
});


//test('functions', function () {
//
//});