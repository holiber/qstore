$(function () {

	var data = {
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
	}

	var selectors = {
		all: true,
		apples: {type: 'apple'},
		greenApples: {type: 'apple', color: 'green'},
		applesAndPears: {type: ['apple', 'pear']},
		redImages: [{color: 'red'}, ['image']],
		heavyFruits: [{weight: {$gte: 1}}, ['image', 'weight', 'type']],
		cheapOrYellow: [[{price: {$lt: 1}}, {color: 'yellow'}]],
		expensiveIntfruits: {price: {$and: [{$gte: 1}, function (value) {return value % 1 == 0}] }}

	}
	var render = function (rows) {
		$('.table-place').html(tableTemplate(rows));
	}

	var switchExaple = function (exampleName) {
		var selector = selectors[exampleName];
		var fields = null;
		if ($.isArray(selector)) {
			fields = selector[1];
			selector = selector[0];
		}
		$('.code').hide();
		$('#' + exampleName).show();
		render(fruits.find(selector, fields));
	}

	$('[name="queries"]').change(function () {
		switchExaple($(this).val());
	});


	var fruits = window.fruits = new ActiveData(data);
	fruits.addFields([{name: 'image', compute: function (row) { return '<img src="images/' + row.type + '-' + row.color + '.jpeg">'}}])
	render(fruits.rows);


})