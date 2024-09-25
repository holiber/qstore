![Qstore Logo](https://raw.githubusercontent.com/holiber/qstore/master/qstore.png)

# Qstore

**Effortless JavaScript Collections and Queries**

---

## Overview

Qstore is a lightweight JavaScript library designed to simplify working with collections. Whether you're dealing with arrays of objects or complex nested data structures, Qstore provides tools to search, manipulate, and manage your data with ease.


I created this project many years ago for my working tasks and as my diploma project. I needed some alternative to SQL but on the client javascript. The alternative nowdays could be https://github.com/jmespath/jmespath.js

**Key Features:**

- **Easy Collection Creation:** Initialize collections from arrays or custom data formats.
- **Flexible Data Queries:** Search and update data using intuitive query syntax.
- **Deep Searching:** Perform deep searches within nested objects and arrays.
- **Computed Fields:** Define fields that automatically compute values based on other fields.
- **Change Tracking:** Keep track of changes in your collections for debugging or syncing.
- **Extendable Query Language:** Customize operators and functions to suit your needs.

---

## Installation

### Front-End

**Using a Script Tag:**

Include the `qstore.js` file in your HTML:

```html
<script src="path/to/qstore.js"></script>
```

**Using Bower:**

If you're using Bower as your package manager:

```bash
bower install qstore
```

### Back-End

**Using NPM:**

For Node.js environments:

```bash
npm install qstore
```

---

## Quick Start Guide

Let's dive right in and see how Qstore can simplify your data handling.

### Creating a Collection

You can initialize a collection using an array of objects:

```js
var fruits = new Qstore([
  { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
  { type: 'pear', color: 'green', weight: 0.4, price: 2 },
  { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
  { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
]);
```

Or using a reduced format with columns and rows:

```js
var fruits = new Qstore({
  columns: ['type', 'color', 'weight', 'price'],
  rows: [
    ['apple', 'red', 0.25, 1.5],
    ['pear', 'green', 0.4, 2],
    ['pear', 'red', 0.3, 1.8],
    ['apple', 'yellow', 0.26, 1.2],
  ],
});
```

### Simple Examples

**Find all green apples:**

```js
fruits.find({ type: 'apple', color: 'green' });
```

**Find all apples and pears:**

```js
fruits.find({ type: ['apple', 'pear'] });
```

**Which fruits can be red?**

```js
fruits.getList({ color: 'red' }, 'type'); // ['apple', 'pear', 'strawberries']
```

**Find all fruits with price between $1 and $2:**

```js
fruits.find({ price: { $gte: 1, $lte: 2 } });
```

**Find fruits where the price per kg is greater than $5:**

```js
fruits.find(function (item) {
  return item.price / item.weight > 5;
});
```

**Add a computed field for price per kilogram:**

```js
fruits.addFields({
  name: 'pricePerKg',
  compute: function (fruit) {
    return (fruit.price / fruit.weight).toFixed(2);
  },
});
```

Now each item in the collection has a `pricePerKg` field.

**Group fruits by color:**

```js
var groupedFruits = fruits.groupBy('color');
```

---

## Features and Examples

### Data Search

#### `.find(query, [fields], [options])`

Searches the collection and returns an array of items that match the query.

**Examples:**

```js
// Find all red fruits
fruits.find({ color: 'red' });

// Find all apples or pears
fruits.find({ type: ['apple', 'pear'] });

// Find all fruits with price less than $2
fruits.find({ price: { $lt: 2 } });

// Using regular expressions to find fruits starting with 'p'
fruits.find({ type: /^p/ }); // Matches 'pear' and 'pineapple'
```

#### Deep Search in Objects

You can perform deep searches within nested objects:

```js
var usersMessages = new Qstore({
  columns: ['text', 'subject', 'user'],
  rows: [
    [
      'Hi',
      'new year',
      { id: 1, name: 'Bob', company: { name: 'IBM', phone: '+9999' } },
    ],
    [
      'Happy new year!',
      'new year',
      { id: 2, name: 'Kate', company: { name: 'Microsoft', phone: '+8888' } },
    ],
  ],
});

// Find messages from users working at IBM
usersMessages.find({ 'user.company.name': 'IBM' });
```

#### Deep Search in Arrays

Search within arrays inside your data:

```js
var costumes = new Qstore([
  {
    name: 'policeman',
    items: [
      { name: 'tie', color: 'black' },
      { name: 'cap', color: 'blue' },
    ],
  },
  { name: 'fireman', items: [{ name: 'helmet', color: 'yellow' }] },
]);

// Find costumes that include a 'helmet'
costumes.find({ items: { name: 'helmet' } });
```

### Aliases in Field Selection

You can create aliases for fields when selecting data:

```js
// Select 'text' and 'user.name' as 'userName'
messages.find({ subject: 'new year' }, ['text', 'user.name:userName']);

// Using alias map
messages.find({ subject: 'new year' }, { text: true, userName: 'user.name' });
```

**Result:**

```js
[
  { text: 'Happy new year!', userName: 'Kate' },
  { text: 'Anyone want to dance?', userName: 'James' },
];
```

### Comparison of Fields

You can compare fields within the same item:

```js
var diet = new Qstore({
  columns: ['month', 'breakfast', 'dinner'],
  rows: [
    [
      'April',
      { calories: 400, food: 'egg' },
      { calories: 300, food: 'soup' },
    ],
    [
      'May',
      { calories: 300, food: 'bacon' },
      { calories: 500, food: 'steak' },
    ],
  ],
});

// Find days where dinner calories are less than breakfast calories
diet.find({ 'dinner.calories': { $lt: '$.breakfast.calories' } });
```

### Queries Concatenation

Combine queries using logical operators:

```js
var filter1 = { type: 'apple' };
var filter2 = { color: 'red' };

// Find items that are apples OR red
var orFilter = [filter1, filter2];

// Find items that are apples AND red
var andFilter = { $and: [filter1, filter2] };
```

### Operators

Qstore provides several built-in operators for advanced querying:

- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$lt`: Less than
- `$gte`: Greater than or equal to
- `$lte`: Less than or equal to
- `$like`: String contains
- `$has`: Checks if a value exists in an array, object, or string

**Example of `$has` Operator:**

```js
var clothes = new Qstore([
  { name: 'skirt', sizes: ['XS', 'S', 'XL'] },
  { name: 'jeans', sizes: ['M', 'XXL'] },
]);

// Find clothes that have size 'XS'
clothes.find({ sizes: { $has: 'XS' } });
```

### Adding Custom Operators

You can add your own operators to extend the query language:

```js
// Add "isInt" operator to check for integer values
Qstore.addOperator('isInt', function (left, right) {
  var isInt = left % 1 === 0;
  return right ? isInt : !isInt;
});

// Find fruits with integer prices
fruits.find({ price: { $isInt: true } });
```

### Functions

Use functions in queries for dynamic computations.

**Built-in Functions:**

- `$length`: Length of an array or string
- `$first`: First item of an array or string
- `$min`: Minimum value in an array
- `$max`: Maximum value in an array
- `$upper`: Converts a string to uppercase
- `$lower`: Converts a string to lowercase

**Example:**

```js
// Find users with more than 2 friends
users.find({ 'friends.$length': { $gt: 2 } });

// Select user name and number of friends
users.find(true, ['name', 'friends.$length:friendsCount']);
```

### Grouping Data

#### `.groupBy(fields)`

Group your data based on one or more fields.

**Example:**

```js
// Group fruits by type
var groupedFruits = fruits.groupBy('type');
```

**Result:**

Each group contains an `_g` property with the grouped items.

### Data Manipulation

#### Adding Items

```js
// Add a new fruit
fruits.add({ type: 'banana', color: 'yellow', weight: 0.2, price: 1.0 });
```

#### Updating Items

```js
// Increase the price of all apples by $0.5
fruits.update({ type: 'apple' }, function (item) {
  return { price: item.price + 0.5 };
});
```

#### Removing Items

```js
// Remove all fruits that are red
fruits.remove({ color: 'red' });
```

### Working with Changes

Track changes in your collection to sync with a database or for undo functionality.

#### `.getChanges()`

Returns a collection of changes made since the last commit.

```js
var changes = fruits.getChanges();
```

**Example:**

```js
// Get a list of indices of removed items
var removedIndices = fruits
  .getChanges()
  .search({ action: 'remove' })
  .getList('source.idx');
```

#### `.commit()`

Commits the changes, clearing the change history.

```js
fruits.commit();
```

#### `.rollback()`

Reverts the collection to the state at the last commit.

```js
fruits.rollback();
```

#### Soft Mode

If you don't need change tracking, you can enable soft mode:

```js
fruits.setSoftMode(true);
```

### Utilities

#### `.size()`

Returns the number of items in the collection.

```js
var totalFruits = fruits.size();
```

#### `.pack([query], [fields])`

Compresses the collection data for efficient storage or transmission.

```js
var packedFruits = fruits.pack();
```

**Example:**

```js
var apples = fruits.pack({ type: 'apple' }, ['idx', 'weight', 'price']);
```

#### `.getCopy()`

Returns a deep copy of the collection.

```js
var fruitsCopy = fruits.getCopy();
```

### Events

Listen to collection events for reactive programming.

#### `.setListener(fn)`

Sets a listener function that reacts to collection events like 'change', 'commit', or 'sort'.

```js
fruits.setListener(function (eventName, data, collection) {
  if (eventName === 'change' && data.action === 'update') {
    var changes = data.changes.find({ 'source.type': 'apple', 'patch.color': { $ne: undefined } });
    changes.forEach(function (change) {
      console.log(
        'An apple changed color from ' + change.source.color + ' to ' + change.patch.color
      );
    });
  }
});
```

---

## API Reference

### Initialization

#### Using an Array of Objects

```js
var collection = new Qstore(arrayOfObjects);
```

#### Using Reduced Format

```js
var collection = new Qstore({
  columns: ['column1', 'column2'],
  rows: [
    ['value1', 'value2'],
    ['value3', 'value4'],
  ],
});
```

---

### Data Search Methods

#### `.find(query, [fields], [options])`

Returns all objects matching the query.

- **`query`**: The search criteria.
- **`fields`**: (Optional) Array of field names to include in the result.
- **`options`**: (Optional) Additional options like `limit`.

**Examples:**

```js
// Find all red fruits
fruits.find({ color: 'red' });

// Find first two apples
fruits.find({ type: 'apple' }, true, { limit: 2 });
```

#### `.search(query, [fields], [options])`

Same as `.find` but returns a new Qstore collection.

#### `.findOne(query, [fields], [options])`

Returns the first object that matches the query.

```js
var firstApple = fruits.findOne({ type: 'apple' });
```

#### `.findIn(array, query, [fields], [options])`

Static method to search within an array.

```js
Qstore.findIn(arrayOfObjects, { key: 'value' });
```

#### `.test(object, query)`

Checks if an object matches the query.

```js
Qstore.test({ type: 'apple', color: 'red' }, { color: 'red' }); // true
```

#### `.getList([query], [fieldName='idx'])`

Returns a list of unique values for a specified field.

```js
// List of all fruit colors
fruits.getList('color'); // ['red', 'green', 'yellow']

// List of types for red fruits
fruits.getList({ color: 'red' }, 'type'); // ['apple', 'strawberries']
```

#### `.each([query], fn)`

Applies a function to each item in the collection.

```js
fruits.each(function (item, index) {
  console.log('Fruit #' + index + ' is a ' + item.type);
});
```

---

### Operators

#### Built-in Operators

- **`$eq`**: Equal to
- **`$ne`**: Not equal to
- **`$gt`**: Greater than
- **`$lt`**: Less than
- **`$gte`**: Greater than or equal to
- **`$lte`**: Less than or equal to
- **`$like`**: Contains substring
- **`$has`**: Contains value in array, object, or string

#### Custom Operators

Add custom operators using:

```js
Qstore.addOperator('operatorName', function (left, right) {
  // Your logic here
});
```

---

### Functions

#### Built-in Functions

- **`$length`**: Length of an array or string
- **`$first`**: First item in an array or string
- **`$min`**: Minimum value in an array
- **`$max`**: Maximum value in an array
- **`$upper`**: Convert string to uppercase
- **`$lower`**: Convert string to lowercase
- **`$toNumber`**: Convert to number
- **`$toString`**: Convert to string

#### Using Functions in Queries

```js
// Find users with no friends
users.find({ 'friends.$length': 0 });

// Get list of first friends' names
users.getList('friends.$first');
```

#### Custom Functions

Add custom functions using:

```js
Qstore.addFunction('functionName', function (value) {
  // Your logic here
});
```

---

### Data Manipulation Methods

#### `.add(items, [soft=false])`

Adds new items to the collection.

```js
fruits.add({ type: 'orange', color: 'orange', weight: 0.3, price: 1.2 });
```

#### `.update([searchQuery], updateQuery, [soft=false])`

Updates items in the collection.

```js
// Make all green fruits red
fruits.update({ color: 'green' }, { color: 'red' });
```

#### `.patch(values, [key='idx'], [soft=false])`

Updates the collection using an array of patches.

```js
var patches = [
  { id: 1, connected: true },
  { id: 2, connected: false },
];

users.patch(patches, 'id');
```

#### `.remove(query, [soft=false])`

Removes items from the collection.

```js
// Remove messages without an author
messages.remove({ author: undefined });
```

#### `.addFields(fields)`

Adds new fields to the collection.

```js
fruits.addFields([
  { name: 'season', default: 'summer' },
  {
    name: 'pricePerKg',
    compute: function (item) {
      return item.price / item.weight;
    },
  },
]);
```

#### `.compute()`

Forces recomputation of computed fields.

#### `.removeFields(fields)`

Removes fields from the collection.

```js
// Remove the 'weight' field
fruits.removeFields('weight');
```

#### `.sort(fields, [zeroIsLast=false])`

Sorts the collection.

```js
// Sort by price ascending
fruits.sort({ fieldName: 'price', order: 'asc' });

// Sort by type ascending, then price descending
fruits.sort([
  { fieldName: 'type', order: 'asc' },
  { fieldName: 'price', order: 'desc' },
]);
```

---

### Grouping Methods

#### `.groupBy(fields)`

Groups the collection based on specified fields.

```js
// Group shops by country and city
var shopsGrouped = shops.groupBy(['country', 'city']);
```

#### `.indexBy(indexes)`

Creates a map of the collection indexed by specified fields.

```js
// Index users by 'id'
var usersById = users.indexBy('id');
```

#### `.mapOf(indexes)`

Similar to `.indexBy` but always wraps values in an array.

---

### Working with Changes

#### `.getChanges()`

Returns a collection of changes.

#### `.getChangesMap([keyField='idx'])`

Returns a map of changes grouped by action.

#### `.commit()`

Commits the changes.

#### `.rollback()`

Reverts the changes.

#### `.setSoftMode(flag)`

Enables or disables soft mode.

---

### Utilities

#### `.size()`

Returns the number of items.

#### `.pack([query], [fields])`

Compresses the collection data.

#### `.unpack(data)`

Unpacks compressed data into a collection.

#### `.getCopy()`

Returns a deep copy of the collection.

---

### Events

#### `.setListener(fn)`

Sets a listener for collection events.

**Event Names:**

- `change`
- `commit`
- `sort`

---

## Examples of Collections

### Fruits

```js
var fruits = new Qstore({
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
    ['strawberries', 'red', 0.1, 0.2],
  ],
});
```

### Users Messages

```js
var usersMessages = new Qstore({
  columns: ['text', 'subject', 'user'],
  rows: [
    [
      'Hi',
      'new year',
      { id: 1, name: 'Bob', company: { name: 'IBM', phone: '+9999' } },
    ],
    [
      'Happy new year!',
      'new year',
      { id: 2, name: 'Kate', company: { name: 'Microsoft', phone: '+8888' } },
    ],
    ['How to learn JavaScript?', 'programming', { id: 3, name: 'Stan' }],
    ['Anyone want to dance?', 'new year', { id: 4, name: 'James' }],
  ],
});
```

### Diet

```js
var diet = new Qstore({
  columns: ['month', 'breakfast', 'dinner'],
  rows: [
    [
      'April',
      { calories: 400, food: 'egg' },
      { calories: 300, food: 'soup' },
    ],
    [
      'May',
      { calories: 300, food: 'bacon' },
      { calories: 500, food: 'steak' },
    ],
    [
      'June',
      { calories: 350, food: 'porridge' },
      { calories: 300, food: 'chicken' },
    ],
  ],
});
```

### Users

```js
var users = new Qstore([
  { id: 12, name: 'Bob', friends: ['Mike', 'Sam'] },
  { id: 4, name: 'Martin', friends: ['Bob'] },
  { id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam'] },
  { id: 10, name: 'Sam', friends: [] },
  { id: 15, name: 'Sam', friends: ['Mike'] },
]);
```

### Costumes

```js
var costumes = new Qstore([
  {
    name: 'policeman',
    items: [
      { name: 'tie', color: 'black' },
      { name: 'cap', color: 'blue' },
    ],
  },
  { name: 'fireman', items: [{ name: 'helmet', color: 'yellow' }] },
  { name: 'soldier', items: [{ name: 'helmet', color: 'green' }] },
  {
    name: 'zombie',
    items: [
      { name: 'skin', color: 'green' },
      { name: 'brain', color: 'pink' },
    ],
  },
]);
```

### Shops

```js
var shops = new Qstore({
  columns: ['country', 'city', 'address'],
  rows: [
    ['UK', 'London', 'Mace St. 5'],
    ['UK', 'York', 'Temple Ave. 10'],
    ['France', 'Paris', 'De Rivoli St. 20'],
    ['France', 'Paris', 'Pelleport St. 3'],
    ['Germany', 'Dresden', 'Haydn St. 2'],
    ['Germany', 'Berlin', 'Bornitz St. 50'],
    ['Germany', 'Munich', 'Eva St. 12'],
    ['Russia', 'Vladivostok', 'Stroiteley St. 9'],
  ],
});
```

---



## License

Qstore is open-source and released under the MIT License.
