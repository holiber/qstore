#ActiveData
Work with collections in javascript
##Overview
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
See more [exaples](http://holiber.github.io/activedata/examples/)

##API
- [Initialisation](#initialisation)
- [Data search](#dataSearch)
  - [find](#find)
  - [findOne](#findOne)
  - [findIn](#findIn)
  - [test](#test)
  - [getList](#getList)
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

```
var fruits = new ActiveData([
	{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
	{type: 'pear', color: 'green', weight: 0.4, price: 2},
	{type: 'pear', color: 'red', weight: 0.3, price: 1.8},
	{type: 'apple', color: 'yellow', weight: 0.26, price: 1.2},
]);
```
Using reduce format:

```
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

returns all objects from collection which compliance query
See [exaples of usage](http://holiber.github.io/activedata/examples/)
 
**.find(query, [fields], [options])**

- **query {Object|Function|Bolean}** 
- **[fields] {Array}**
- **[options] {Object}**

in development


<a name="findOne"></a>
####findOne
in development

<a name="findIn"></a>
####findIn
in development

<a name="test"></a>
####test
in development

<a name="addOperator"></a>
####addOperator
in development

<a name="getList"></a>
####getList
in development

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
<a name="addFields"></a>
####addFields
<a name="compute"></a>
####compute
<a name="removeFields"></a>
####removeFields
<a name="sort"></a>
####sort

<a name="changes"></a>
###Work with changes
<a name="getChanges"></a>
####getChanges
<a name="commit"></a>
####commit
<a name="revert"></a>
####revert

<a name="utilites"></a>
###Utilites
<a name="size"></a>
####size
<a name="pack"></a>
####pack
<a name="unpack"></a>
####unpack
<a name="getCopy"></a>
####getCopy

<a name="events"></a>
###Events
