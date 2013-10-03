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
see more in [exaples](https://github.com/holiber/activedata/tree/master/example) folder

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

<a name="dataSearch"></a>
###Data search
<a name="find"></a>
####find
<a name="findOne"></a>
####findOne
<a name="findIn"></a>
####findIn
<a name="test"></a>
####test
<a name="addOperator"></a>
####addOperator
<a name="getList"></a>
####getList

<a name="dataManipulation"></a>
###Data manipulation
<a name="add"></a>
####add
<a name="update"></a>
####update
<a name="patch"></a>
####patch
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
