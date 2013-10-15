![activedata](activedata-big.png)

##Overview
Work with collections in javascript
- Create your collections.
- Search and update data using queries.
- Use computed fields
- Get collections changes.
- Extend your query language.

###Simple examples
  We need find all green apples from fruits collection. In SQL it will be:
  
```sql
select * from fruits where type = 'apple' and color = 'green'
```

It's same as ActiveData query:

```js
fruits.find({type: 'apple', color: 'green'});
```

 ---
  We need find all apples and pears from fruits collection. In SQL it will be:
  
```sql
  select * from fruits where type in ('apple', 'pear')
```
It's same as ActiveData query:

```js
fruits.find({type: ['apple', 'pear']});
```

 ---
 
 What fruits can be red?
 ```js
	fruits.getList({color: 'red'}, 'type');// ['apple', 'pear', 'strawberries']
 ```
 ---
 
See more [examples](http://holiber.github.io/activedata/examples/)

##API
- [Initialisation](#initialisation)
- [Data search](#dataSearch)
  - [find](#find)
	- [deepSearch](#deepSearch)
	- [aliases](#aliases)
	- [comparison of fields](#comparisonOfFields)
  - [search](#search)
  - [findOne](#findOne)
  - [findIn](#findIn)
  - [test](#test)
  - [getList](#getList)
- [Operators](#operators)
  - [Availble operators](#availOperators)
  - [addOperator](#addOperator)
  - [removeOperator](#removeOperator)
- [Data manipulation](#dataManipulation)
  - [add](#add)
  - [update](#update)
  - [patch](#patch)
  - [remove](#remove)
  - [addFields](#addFields)
  - [compute](#compute)
  - [removeFields](#removeFields)
  - [sort](#sort)
- [Work with changes](#changes)
  - [getChanges](#getChanges)
  - [commit](#commit)
  - [revert](#revert)
  - [softMode](#softMode)
- [Utilites](#utilites)
  - [size](#size)
  - [pack](#pack)
  - [unpack](#unpack)
  - [getCopy](#getCopy)
- [Events](#events)
  - [Events list](#eventsList)
  - [setListener](#setListener)

<a name="initialisation"></a>
###Initialisation

Using array of objects:

```js
var fruits = new ActiveData([
	{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
	{type: 'pear', color: 'green', weight: 0.4, price: 2},
	{type: 'pear', color: 'red', weight: 0.3, price: 1.8},
	{type: 'apple', color: 'yellow', weight: 0.26, price: 1.2},
]);
```

Using reduce format:

```js
var fruits = new ActiveData({
	columns: ['type', 'color', 'weight', 'price'],
	rows: [
		['apple', 'red', 0.25, 1.5],
		['pear', 'green', 0.4, 2],
		['pear', 'red', 0.3, 1.8],
		['apple', 'yellow', 0.26, 1.2]
	]
});
```
 ---

<a name="dataSearch"></a>
###Data search
<a name="find"></a>
####.find (query, [fields], [options])

Returns all objects from collection which compliance query  
See [examples of usage](http://holiber.github.io/activedata/examples/)
 

- **query {Object|Array|Function|Bolean}**  
 See [examples](http://holiber.github.io/activedata/examples/)  
 If query is **true** then will be returned all rows.  
 If query is **Object** or **Array**:  
 { } - contains conditions separeted with **and**  
 [ ] - contains conditions separeted with **or**  
 Operators describes as **$&lt;operator name&gt;**, see [Operators](#operators).  
  Example:
  
  ```js
//find all red or green fruits with price between 0.5 and 1.5  
fruits.find({color: ['red', 'green'], price: {$gt: 0.5, $lt: 1.5});
  ```

  ```js
  //using regular expressions
  fruits.find({type: /apple/});//returns all apples and pineapples
  ```

  If query is **Function**:  
  Example:
  
  ```js
  //find all red fruits
  fruits.find(function (row) {
      return row.color == 'red';
  });
  ```
  If query is **Object** that contains functions:  
  
  Function with field-context:
  
  ```js
  //find all fruits with integer price or with 0.5$ price
  fruits.find({price: [0.5, function (price) { return price % 1 == 0}]);
  ```
  
  Function with row-context:
  
  ```js
  //find all fruits with integer price or with 0.5$ price
  fruits.find([price: 0.5, function (row) { return row.price % 1 == 0});
  ```
- **[fields=true] {Array|Boolean}**  
 Array of fields names which will be added to result.  
 Example:
 
  ```js
  	//same as SQL query:
  	//select type, color, price from fruits where type = 'apple'
 	fruits.find({type: 'apple'}, ['type', 'color', 'price']);
  ```
Also you can use fields [aliases](#aliases)
 
- **[options] {Object}**  
  - limit: rowsCount
  - limit: [fromRow]
  - limit: [fromRow, RowsCount]  
  
  Example:
  
  ```js
  	//find first two apples
  	fruits.find({type: 'apple'}, true, {limit: 2});
  	
  	//find two yellow fruits begins from third yellow fruit
  	fruits.find ({color: 'yelow'}, true, {limit: [3,2]});
  	
  ```
<a href="deepSearch"></a>
#####Deep search:
```js
	// find all messages with subject 'New year' from user with name 'Bob' who works in 'IBM' company
	messages.find({subject: 'new year', user: {name: 'Bob', company: {name: 'IBM'} }});
	
	// or
	messages.find({subject: 'new year', 'user.name': 'Bob', 'user.company.name': 'IBM'});
```

<a href="aliases"></a>
#####Aliases:

You can use aliases fields using the syntax "fieldName:aliasName"

```js
	var messages = new ActiveData ({
		columns: ['text', 'subject', 'user'],
		rows: [
			['Hello world!', 'programming', {id: 1, name: 'Bob'}],
			['Happy new year!', 'new year', {id: 2, name: 'Kate'}],
			['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
			['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
		]
	});
	
	messages.find({subject: 'new year'}, ['text', 'user.name:userName']);// it will return:
	// [ {text: 'Happy new year!', userName: 'Kate'}, {text: 'Anyone want to dance?', userName: 'James'}]
```

<a href="comparisonOfFields"></a>
#####Comparison of fields.

Use '$.fieldName' syntax to get the value of field
```js
	var diet = new ActiveData ({
		columns: ['month', 'breakfast', 'dinner'],
		rows: [
			['april', {calories: 400, food: 'egg'}, {calories: 300, food: 'soup'}],
			['may', {calories: 300, food: 'bacon'}, {calories: 500, food: 'soup'}],
			['june', {calories: 350, food: 'porridge'}, {calories: 300, food: 'chicken'}]
		]
	});
	
	// find diet where dinner calories less when breackfast calories
	diet.find({'dinner.calories': {$lt: '$.breakfast.calories'} });
```

#####Queries concatenation:
```js
	var filter1 = {type: 'apple'};
	var filter2 = {color: 'red'};
	
	//search rows valid for filter1 or filter2
	var commonFilter1 = [filter1, filter2]
	
	//search rows valid for filter1 and filter2
	var commonFilter2 = {$and: [filter1, filter2]};
	
```
 ---

<a name="search"></a>
####.search (query, [fields], [options])
Same as [.find](#find) but returns ActiveData collection

```js
	// get collection of red fruits sorted by type
	fruits.search({color: 'red'}).sort({fieldName: 'type', order: 'asc');
```

 ---

<a name="findOne"></a>
####.findOne (query, [,fields=true] [,options])

find first row valid for query
it same as:

```js
	.find(query, fields, {limit: 1})[0]
```
---

<a name="findIn"></a>
####ActiveData.findIn (rows, query, [,fields=true] [,options])
same as [.find](#find) but work as static method with you array

```js
	var users = [
		{name: 'user1', id: 1, email: 'user1@anymail.com'},
		{name: 'user2', id: 2, email: 'user2@anymail.com'},
		{name: 'user3', id: 3, email: 'user3@anymail.com'},
		{name: 'user4', id: 4, email: 'user4@anymail.com'}
	];
	
	// find user with id = 3
	ActiveData.findIn(users, {id: 3});
```
---

<a name="test"></a>
####ActiveData.test (object, query)
checks that the object match the query

```js
	var fruit = {type: 'pineapple', color: 'yellow', weight: 1, price: 4};
	
	// The fruit is yellow?
	ActiveData.test(fruit, {color: 'yellow'}); //true
	
	// The fruit is pineapple or pear?
	ActiveData.test(fruit, {type: ['pear', 'pineapple']}); //true
	
	// The fruit has "apple" in type?
	ActiveData.test(fruit, {type: {$like: 'apple'}}); //true
	
	// Fruit price less when 1$ per kg
	ActiveData.test(fruit, function (fruit) { return fruit.price/fruit.weight < 1});//false
```
---

<a name="getList"></a>
####.getList ([query,] [fieldName='idx']);
Returns list of values for **fieldName**.  
Elements of the list are not repeated.

Examples:

```js
	// list of all fruits colors
	fruits.getList('color'); // ['red', 'green', 'yellow']
	
	// list of all pears colors
	fruits.getList({type: 'pear'}, 'color');// ['green', 'red']
	
	// What fruits can be red?
	fruits.getList({color: 'red'}, 'type');// ['apple', 'pear', 'strawberries']
	
	// get fruits types with idx in [3, 5, 6]
	fruits.getList({idx: [3, 5, 6]}); //['pear', 'apple', 'banana']
	
	//get list of idx
	fruits.getList();
	
	// list of deep fields
	messages.getList('user.name'); // ['Bob', 'Kate', 'Stan', 'James']
```
---

<a name="operators"></a>
###Operators
Оperators are used to extend the query language.

<a name="availOperators"></a>
####Available operators
 name  | description
 ----- | -----------
 $eq   | equals
 $ne   | not equals
 $gt   | more then
 $lt   | less then
 $gte  | more or equals then
 $lte  | less or equals then
 $and  | change condition of [ ] operator from **or** to **and**
 $like | "like" search
 
 you can also add your operators - see [addOperator](#addOperator) method
 
---

<a name="addOperator"></a>
####ActiveData.addOperator (operatorName, function)

Example:

```js
	/* we need find fruits with integer price */
	
	// add "isInt" operator
	ActiveData.addOperator('isInt', function (left, right) {
		var isInt = (left % 1 == 0);
		return right ? isInt : !isInt
	});
	
	// find them
	fruits.find({price: {$isInt: true}});
	
	// find other
	fruits.find({price: {$isInt: false}});
	
```


 ---

<a name="removeOperator"></a>
####ActiveData.removeOperator (operatorName)
remove operator
 ---

<a name="dataManipulation"></a>
###Data manipulation

<a name="add"></a>
####.add (rows [,soft=false])

add new items to collection

 - **row {Object|Array}**
 - **soft** soft add. See [soft mode](#softMode).  


Examples:
 
 ```js
 	//add one new fruit
 	fruits.add({type: 'carrot', color: 'red', weight: 0.3, price: 0.3});
 	
 	//add few new fruits
 	fruits.add([
 		{type: 'carrot', color: 'red', weight: 0.3, price: 0.3},
 		{type: 'orange', color: 'orange', weight: 0.4, price: 0.5}
 	]);
 ```

 ---


<a name="update"></a>
####.update ([searchQuery,] updateQuery [,soft=false])
update items in collection

 - **[searchQuery] {Object|Function}** if option is set then will be updated only finded items
 - **updateQuery {Object|Function}** patch or function returned patch
 - **[soft=false]** soft update. See [soft mode](#softMode).  

Examples:

```js
	//all fruits will be apples
	fruits.update({type: 'apple'});
	
	//make all green fruits red
	fruits.update({color: 'green'}, {color: 'red'});
	
	//The price of all pears will increase by 1 $
	fruits.update(function (item) {
		if (item.type == 'pear') {
			return {price: item.price + 1}
		}
	});
```

 ---

<a name="patch"></a>
####.patch (values [,key='idx'] [,soft=false])
Update current collection by using update-collection.

 - **values** array of patches
 - **[key='idx']** key field
 - **[soft=false]** soft patch. See [soft mode](#softMode). 


```js
	var patch = [
		{id: 21, connected: true},
		{id: 22, connected: false},
		{id: 33, name: 'unknown'}
	];
	
	users.patch(patch, 'id');
```
 ---

<a name="remove"></a>
####.remove (expr [,soft=false])

Delete items from collection and returns count of deleted items.

```js
	// delete messages that do not have author
	messages.remove({author: undefined});
```

 ---
 
<a name="addFields"></a>
####.addFields (fields)
Add new fields in collection.

 - fields {Array|Object} array of new fields settings

Fields with default values:

```js
	messages.addFields([
		{name: 'author', default: 'unknown'},
		{name: 'rating', default: 0}
	]);
	
	messages.add({text: 'hello world'});
	messages.findOne({text: 'hello world'}); // {text: 'hello world', author: 'unknown', rating: 0}
```

Computed fields: 

```js
	fruits.addFields({name: 'pricePerKg', compute: function (fruit) {
		return fruit.price / fruit.weight;
	});
```

 ---
 
<a name="compute"></a>
#### .compute ()
Forced recalculates computed fields.  
Computed fields automatically recalculeted whan collection was changed.
Use this method if you need recalculate computed fields manualy.

 ---
 
<a name="removeFields"></a>
####.removeFields (fields)
remove fields from collection
 - **fields {String|Array}** field name or array of field names to delete

```js
	// delete one field
	fruits.removeFields('weight');
	
	// delete few fields
	fruits.removeFields(['price', 'color']);
```

 ---

<a name="sort"></a>
####sort (fields [,zeroIsLast=false])
another variant:
**sort (fn)**  where **fn** is sort function

sort collection

Examples:
```js
	fruits.sort();//sort by idx
	
	fruits.sort({fieldName: 'type', order: 'asc'});
	
	fruits.sort([
		{fieldName: 'type', order: 'asc'},
		{fieldName: 'price', order: 'desc'},
	]);
	
	fruits.sort({fieldName: 'price', zeroIsLast: true});
	
	fruits.sort(function (fruit1, fruit2) {
		return fruit1.price - fruit2.price;
	});
	
```
 ---

<a name="changes"></a>
###Work with changes

<a name="getChanges"></a>
####getChanges ()
returns collection of changes

Examples:
```js
	// we need get the list of idx of removed items
	fruits.remove({type: 'apple'});
	var changes = fruits.getChanges();
	changes.search({action: 'remove'}).getList('source.idx');// [1, 4, 9]
```
<!--
```js
	// we need get updates for fruits
	fruits.update({type: 'pear'}, {color: 'blue', price: 0.5});
	var updates = fruits.getChanges().search({action: 'update'}, ['idx:id', ':values']);
	
```
-->
 ---

<a name="commit"></a>
####commit
Commit changes.

 ---
 
<a name="rollback"></a>
####rollback
Revert all changes.

 ---
 
 
<a name="softMode"></a>
####softMode
in development


<a name="utilites"></a>
###Utilites

<a name="size"></a>
####.size ()
returns rows count

 ---
 
<a name="pack"></a>
####.pack ([query] [,fields])
returs reduced collection

```js
	var fruits = new ActiveData([
		{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
		{type: 'pear', color: 'green', weight: 0.4, price: 2},
		{type: 'pear', color: 'red', weight: 0.3, price: 1.8},
		{type: 'apple', color: 'yellow', weight: 0.26, price: 1.2}
	]);
	
	var apples =  fruits.pack({type: 'apple'}, ['idx', 'weight', 'price']);
	
	//now apples contains:
	{
		columns: ['idx', 'weight', 'price'],
		rows: [
			[1, 0.25, 1.5],
			[4, 0.26, 1.2]
		]
	}
	
```
Use this method if you whant to send collection or part of collection by network,
because it will reduce the outgoing traffic.

 ---
 
<a name="getCopy"></a>
####.getCopy ()
Returns a new independent collection, which will be copy of current collection.

 ---

<a name="events"></a>
###Events

<a name="eventsList"></a>
#### Events list
 - change
 - commit
 - sort

Use [addListener](#addListener) method to react on changes

 ---

#### .addListener (fn)
 - fn {Function} listener function

Example: 
```js
// Add message to log if some apple has changed color
var listener = function (name, data, collection) {
	if (name != 'change' || data.action != 'update') return;
	var changes = data.changes;
	var applePainting = changes.find({'source.type': 'apple', 'patch.color': {$ne: undefined} });
	for (var i = 0; i < applePainting.length; i++) {
		var change = applePainting[i];
		console.log('Some apple change color from ' + change.source.color + ' to ' + change.patch.color);
	}
};

fruits.setListener(listener);

fruits.update({color: 'blue'}); // it will write to log:
// Some apple change color from red to blue
// Some apple change color from yellow to blue
// Some apple change color from green to blue

```
 ---


