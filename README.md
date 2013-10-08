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
####find

Returns all objects from collection which compliance query  
See [examples of usage](http://holiber.github.io/activedata/examples/)
 
**.find(query, [fields], [options])**

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
  If query is **Function**:  
  Example:
  
  ```js
  //find all red fruits
  fruits.find(function (row) {
      return row.color == 'red';
  });
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
  **Warning! options will be availble in version 0.3.0**

#####Queries concatination:
```js
	var filter1 = {type: 'apple'};
	var filter2 = {color: 'red'};
	
	//search rows valid for filter1 or filter2
	var commonFilter1 = [filter1, filter2]
	
	//search rows valid for filter1 and filter2
	var commonFilter2 = {$and: [filter1, filter2]};
	
```

in development


<a name="findOne"></a>
####.findOne
**.findOne(query, [fields])**  
finf first row compilance query
it same as:

```js
	.find(query, fields, {limit: 1})[0]
```
in development

<a name="findIn"></a>
####ActiveData.findIn
in development

<a name="test"></a>
####ActiveData.test
in development

<a name="addOperator"></a>
####ActiveData.addOperator
in development

<a name="getList"></a>
####.getList
in development

<a name="operators"></a>
###Operators

<a name="availOperators"></a>
####Availble operators
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

<a name="addOperator"></a>
####addOperator
**ActiveData.addOperator (operatorName, function)**


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
 - exclude jquery
 - compatibility with nodejs

##Roadmap to 0.4.0
 - left join and right join
 - collections merge
