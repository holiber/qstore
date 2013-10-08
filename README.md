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
See more [examples](http://holiber.github.io/activedata/examples/)

##API
- [Initialisation](#initialisation)
- [Data search](#dataSearch)
  - [find](#find)
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
- [Utilites](#utilites)
  - [size](#size)
  - [pack](#pack)
  - [unpack](#unpack)
  - [getCopy](#getCopy)
- [Events](#events)

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
	
	// Which fruits can be red?
	fruits.getList({color: 'red'}, 'type');// ['apple', 'pear', 'strawberries']
	
	// get fruits types with idx in [3, 5, 6]
	fruits.getList({idx: [3, 5, 6]}); //['pear', 'apple', 'banana']
	
	//get list of idx
	fruits.getList();
	
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
 $test | *in development (v0.3)*  
 
 you can also add your operators - see [addOperator](#addOperator) method
 
---

<a name="addOperator"></a>
####ActiveData.addOperator
**ActiveData.addOperator (operatorName, function)**

---

<a name="removeOperator"></a>
####ActiveData.removeOperator
**ActiveData.removeOperator (operatorName)**
---

<a name="dataManipulation"></a>
###Data manipulation
in development
	<a name="add"></a>
####add
in development

<a name="update"></a>
####update
in development

<a name="patch"></a>
####patch
in development

<a name="remove"></a>
####remove
in development

<a name="addFields"></a>
####addFields
in development

<a name="compute"></a>
####compute
in development

<a name="removeFields"></a>
####removeFields
in development

<a name="sort"></a>
####sort
in development

<a name="changes"></a>
###Work with changes
in development

<a name="getChanges"></a>
####getChanges
in development

<a name="commit"></a>
####commit
in development

<a name="revert"></a>
####revert
in development


<a name="utilites"></a>
###Utilites
in development

<a name="size"></a>
####size
in development

<a name="pack"></a>
####pack
in development

<a name="unpack"></a>
####unpack
in development

<a name="getCopy"></a>
####getCopy
in development


<a name="events"></a>
###Events
in development


##Roadmap to 0.2.0
 - static **ActiveData.test** method
 - static **ActiveData.findIn** methid
 - support regular expressions in queries
 - functions with context in query
 
  
##Roadmap to 0.3.0
 - query options
 - **limit** option
 - **$test** operator

##Roadmap to 0.4.0
 - exclude jquery
 - compatibility with nodejs

##Roadmap to 0.5.0
 - left join and right join
 - collections merge
