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
  { type: 'pineapple', color: 'yellow', weight: 1, price: 4 },
  { type: 'banana', color: 'yellow', weight: 0.3, price: 1.5 },
  { type: 'melon', color: 'yellow', weight: 3, price: 3 },
  { type: 'watermelon', color: 'green', weight: 10, price: 5 },
  { type: 'apple', color: 'green', weight: 0.24, price: 1 },
  { type: 'strawberries', color: 'red', weight: 0.1, price: 0.2 },
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
    ['pineapple', 'yellow', 1, 4],
    ['banana', 'yellow', 0.3, 1.5],
    ['melon', 'yellow', 3, 3],
    ['watermelon', 'green', 10, 5],
    ['apple', 'green', 0.24, 1],
    ['strawberries', 'red', 0.1, 0.2],
  ],
});
```

### Simple Examples

**Find all green apples:**

```js
var greenApples = fruits.find({ type: 'apple', color: 'green' });
// Returns:
// [
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 }
// ]
```

**Find all apples and pears:**

```js
var applesAndPears = fruits.find({ type: ['apple', 'pear'] });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'green', weight: 0.4, price: 2 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 }
// ]
```

**Which fruits can be red?**

```js
var redFruitTypes = fruits.getList({ color: 'red' }, 'type');
// Returns:
// ['apple', 'pear', 'strawberries']
```

**Find all fruits with price between $1 and $2:**

```js
var affordableFruits = fruits.find({ price: { $gte: 1, $lte: 2 } });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
//   { type: 'banana', color: 'yellow', weight: 0.3, price: 1.5 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 }
// ]
```

**Find fruits where the price per kg is greater than $5:**

```js
var expensivePerKgFruits = fruits.find(function (item) {
  return item.price / item.weight > 5;
});
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 },
//   { type: 'strawberries', color: 'red', weight: 0.1, price: 0.2 }
// ]
```

**Add a computed field for price per kilogram:**

```js
fruits.addFields({
  name: 'pricePerKg',
  compute: function (fruit) {
    return (fruit.price / fruit.weight).toFixed(2);
  },
});

// Now each item in the collection has a 'pricePerKg' field.
```

**Group fruits by color:**

```js
var groupedFruits = fruits.groupBy('color');
// groupedFruits.rows will contain groups of fruits by color.
```

---

## Features and Examples

### Data Search

#### `.find(query, [fields], [options])`

Searches the collection and returns an array of items that match the query.

**Examples:**

```js
// Find all red fruits
var redFruits = fruits.find({ color: 'red' });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'strawberries', color: 'red', weight: 0.1, price: 0.2 }
// ]

// Find all apples or pears
var applesOrPears = fruits.find({ type: ['apple', 'pear'] });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'green', weight: 0.4, price: 2 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 }
// ]

// Find all fruits with price less than $2
var cheapFruits = fruits.find({ price: { $lt: 2 } });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 },
//   { type: 'banana', color: 'yellow', weight: 0.3, price: 1.5 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 },
//   { type: 'strawberries', color: 'red', weight: 0.1, price: 0.2 }
// ]

// Using regular expressions to find fruits starting with 'p'
var pFruits = fruits.find({ type: /^p/ }); // Matches 'pear' and 'pineapple'
// Returns:
// [
//   { type: 'pear', color: 'green', weight: 0.4, price: 2 },
//   { type: 'pear', color: 'red', weight: 0.3, price: 1.8 },
//   { type: 'pineapple', color: 'yellow', weight: 1, price: 4 }
// ]
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
var ibmMessages = usersMessages.find({ 'user.company.name': 'IBM' });
// Returns:
// [
//   {
//     text: 'Hi',
//     subject: 'new year',
//     user: { id: 1, name: 'Bob', company: { name: 'IBM', phone: '+9999' } }
//   }
// ]
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
  { name: 'soldier', items: [{ name: 'helmet', color: 'green' }] },
]);

// Find costumes that include a 'helmet'
var costumesWithHelmet = costumes.find({ items: { name: 'helmet' } });
// Returns:
// [
//   { name: 'fireman', items: [{ name: 'helmet', color: 'yellow' }] },
//   { name: 'soldier', items: [{ name: 'helmet', color: 'green' }] }
// ]
```

### Aliases in Field Selection

You can create aliases for fields when selecting data:

```js
var messages = new Qstore({
  columns: ['text', 'subject', 'user'],
  rows: [
    ['Hello world!', 'programming', { id: 1, name: 'Bob' }],
    ['Happy new year!', 'new year', { id: 2, name: 'Kate' }],
    ['How to learn JavaScript?', 'programming', { id: 3, name: 'Stan' }],
    ['Anyone want to dance?', 'new year', { id: 4, name: 'James' }],
  ],
});

// Select 'text' and 'user.name' as 'userName'
var newYearMessages = messages.find({ subject: 'new year' }, ['text', 'user.name:userName']);
// Returns:
// [
//   { text: 'Happy new year!', userName: 'Kate' },
//   { text: 'Anyone want to dance?', userName: 'James' }
// ]
```

**Using an alias map:**

```js
var newYearMessages = messages.find(
  { subject: 'new year' },
  { text: true, userName: 'user.name' }
);
// Returns same as above
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
var lighterDinners = diet.find({ 'dinner.calories': { $lt: '$.breakfast.calories' } });
// Returns:
// [
//   {
//     month: 'April',
//     breakfast: { calories: 400, food: 'egg' },
//     dinner: { calories: 300, food: 'soup' }
//   }
// ]
```

### Queries Concatenation

Combine queries using logical operators:

```js
var filter1 = { type: 'apple' };
var filter2 = { color: 'red' };

// Find items that are apples OR red
var orFilter = [filter1, filter2];
var resultOr = fruits.find(orFilter);
// Returns all apples and all red fruits

// Find items that are apples AND red
var andFilter = { $and: [filter1, filter2] };
var resultAnd = fruits.find(andFilter);
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 }
// ]
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
var clothesWithXS = clothes.find({ sizes: { $has: 'XS' } });
// Returns:
// [
//   { name: 'skirt', sizes: ['XS', 'S', 'XL'] }
// ]

// Find clothes that have both 'XS' and 'S' sizes
var clothesWithXSandS = clothes.find({ sizes: { $has: ['XS', 'S'] } });
// Returns:
// [
//   { name: 'skirt', sizes: ['XS', 'S', 'XL'] }
// ]
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
var fruitsWithIntPrice = fruits.find({ price: { $isInt: true } });
// Returns:
// [
//   { type: 'melon', color: 'yellow', weight: 3, price: 3 },
//   { type: 'watermelon', color: 'green', weight: 10, price: 5 },
//   { type: 'apple', color: 'green', weight: 0.24, price: 1 }
// ]
```

### Functions

Use functions in queries for dynamic computations.

#### Built-in Functions

- `$length`: Length of an array or string
- `$first`: First item of an array or string
- `$min`: Minimum value in an array
- `$max`: Maximum value in an array
- `$upper`: Converts a string to uppercase
- `$lower`: Converts a string to lowercase

**Example:**

```js
var users = new Qstore([
  { id: 1, name: 'Bob', friends: ['Mike', 'Sam'] },
  { id: 2, name: 'Martin', friends: ['Bob'] },
  { id: 3, name: 'Mike', friends: ['Bob', 'Martin', 'Sam'] },
  { id: 4, name: 'Sam', friends: [] },
]);

// Find users with no friends
var usersWithNoFriends = users.find({ 'friends.$length': 0 });
// Returns:
// [
//   { id: 4, name: 'Sam', friends: [] }
// ]

// Find users with more than 2 friends
var popularUsers = users.find({ 'friends.$length': { $gt: 2 } });
// Returns:
// [
//   { id: 3, name: 'Mike', friends: ['Bob', 'Martin', 'Sam'] }
// ]
```

**Select user name and number of friends:**

```js
var userFriendCounts = users.find(true, ['name', 'friends.$length:friendsCount']);
// Returns:
// [
//   { name: 'Bob', friendsCount: 2 },
//   { name: 'Martin', friendsCount: 1 },
//   { name: 'Mike', friendsCount: 3 },
//   { name: 'Sam', friendsCount: 0 }
// ]
```

**Using Functions in `getList`:**

```js
// Get list of first friends' names
var firstFriends = users.getList('friends.$first');
// Returns:
// ['Mike', 'Bob', 'Bob']
```

### Grouping Data

#### `.groupBy(fields)`

Group your data based on one or more fields.

**Example:**

```js
// Group fruits by color
var groupedFruits = fruits.groupBy('color');
// groupedFruits.rows will contain groups of fruits by color
```

**Group shops by country and city:**

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

// Group shops by country and then by city
var groupedShops = shops.groupBy('country', 'city');
// groupedShops.rows will contain nested groups by country and city
```

### Data Manipulation

#### Adding Items

```js
// Add a new fruit
fruits.add({ type: 'orange', color: 'orange', weight: 0.3, price: 1.2 });

// Add multiple fruits
fruits.add([
  { type: 'grape', color: 'purple', weight: 0.05, price: 0.4 },
  { type: 'kiwi', color: 'brown', weight: 0.1, price: 0.8 },
]);
```

#### Updating Items

```js
// Increase the price of all apples by $0.5
fruits.update({ type: 'apple' }, function (item) {
  return { price: item.price + 0.5 };
});

// Make all green fruits red
fruits.update({ color: 'green' }, { color: 'red' });
```

#### Removing Items

```js
// Remove all fruits that are red
fruits.remove({ color: 'red' });

// Remove messages without an author
messages.remove({ author: undefined });
```

### Working with Changes

Track changes in your collection to sync with a database or for undo functionality.

#### `.getChanges()`

Returns a collection of changes made since the last commit.

**Example:**

```js
// Make some changes
fruits.update({ type: 'pear' }, { color: 'blue', price: 0.5 });
fruits.add({ type: 'apple', color: 'green' });
fruits.remove({ type: 'pineapple' });

// Get the changes
var changes = fruits.getChanges();

// To get a list of removed items' indices
var removedIndices = changes.search({ action: 'remove' }).getList('source.idx');
// Returns: [5] // Assuming 'pineapple' had idx 5

// Prepare a patch for database
var patch = {};
patch.add = changes.find({ action: 'add' }, ['values:']);
patch.remove = changes.search({ action: 'remove' }).getList('source.idx');
patch.update = changes.find({ action: 'update' }, ['source.idx:id', 'values:']);
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
// Returns: 12
```

#### `.pack([query], [fields])`

Compresses the collection data for efficient storage or transmission.

**Example:**

```js
// Get a packed version of all apples with selected fields
var packedApples = fruits.pack({ type: 'apple' }, ['idx', 'weight', 'price']);
// Returns:
// {
//   columns: ['idx', 'weight', 'price'],
//   rows: [
//     [1, 0.25, 1.5],
//     [4, 0.26, 1.2],
//     [9, 0.24, 1],
//     [11, 0.3, 1.5] // Assuming the new apple added earlier has idx 11
//   ]
// }
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

**Example:**

```js
fruits.setListener(function (eventName, data, collection) {
  if (eventName === 'change' && data.action === 'update') {
    var changes = data.changes.find({
      'source.type': 'apple',
      'patch.color': { $ne: undefined },
    });
    changes.forEach(function (change) {
      console.log(
        'An apple changed color from ' + change.source.color + ' to ' + change.patch.color
      );
    });
  }
});

// Now, when you update apples' colors, the listener will log the changes
fruits.update({ type: 'apple' }, { color: 'blue' });
// Console output:
// An apple changed color from red to blue
// An apple changed color from yellow to blue
// An apple changed color from green to blue
// An apple changed color from green to blue // For the new apple added earlier
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
var redFruits = fruits.find({ color: 'red' });
// Returns the same as earlier examples

// Find first two apples
var firstTwoApples = fruits.find({ type: 'apple' }, true, { limit: 2 });
// Returns:
// [
//   { type: 'apple', color: 'red', weight: 0.25, price: 1.5 },
//   { type: 'apple', color: 'yellow', weight: 0.26, price: 1.2 }
// ]

// Find two yellow fruits starting from the third one
var yellowFruits = fruits.find({ color: 'yellow' }, true, { limit: [3, 2] });
// Returns:
// [
//   { type: 'melon', color: 'yellow', weight: 3, price: 3 },
//   { type: 'banana', color: 'yellow', weight: 0.3, price: 1.5 }
// ]
```

#### `.search(query, [fields], [options])`

Same as `.find` but returns a new Qstore collection.

```js
// Get a collection of red fruits sorted by type
var redFruitsCollection = fruits.search({ color: 'red' });
redFruitsCollection.sort({ fieldName: 'type', order: 'asc' });
// Now redFruitsCollection contains red fruits sorted by type
```

#### `.findOne(query, [fields], [options])`

Returns the first object that matches the query.

```js
var firstApple = fruits.findOne({ type: 'apple' });
// Returns:
// { type: 'apple', color: 'red', weight: 0.25, price: 1.5 }
```

#### `.findIn(array, query, [fields], [options])`

Static method to search within an array.

```js
var usersArray = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// Find user with id = 2
var user = Qstore.findIn(usersArray, { id: 2 });
// Returns:
// [{ id: 2, name: 'Bob', email: 'bob@example.com' }]
```

#### `.test(object, query)`

Checks if an object matches the query.

```js
var fruit = { type: 'pineapple', color: 'yellow', weight: 1, price: 4 };

// Is the fruit yellow?
Qstore.test(fruit, { color: 'yellow' }); // true

// Is the fruit a pineapple or pear?
Qstore.test(fruit, { type: ['pear', 'pineapple'] }); // true

// Does the fruit type contain "apple"?
Qstore.test(fruit, { type: { $like: 'apple' } }); // true

// Is the price per kg less than $1?
Qstore.test(fruit, function (fruit) {
  return fruit.price / fruit.weight < 1;
}); // false
```

#### `.getList([query], [fieldName='idx'])`

Returns a list of unique values for a specified field.

```js
// List of all fruit colors
var colors = fruits.getList('color');
// Returns: ['red', 'green', 'yellow', 'orange', 'purple', 'brown']

// List of types for red fruits
var redFruitTypes = fruits.getList({ color: 'red' }, 'type');
// Returns: ['apple', 'pear', 'strawberries']

// Get list of indices
var indices = fruits.getList();
// Returns: [1, 2, 3, ..., n] where n is the total number of items
```

#### `.each([query], fn)`

Applies a function to each item in the collection.

```js
// Log each fruit's type
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
var usersWithNoFriends = users.find({ 'friends.$length': 0 });

// Get list of first friends' names
var firstFriends = users.getList('friends.$first');
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

#### `.update([searchQuery], updateQuery, [soft=false])`

Updates items in the collection.

#### `.patch(values, [key='idx'], [soft=false])`

Updates the collection using an array of patches.

#### `.remove(query, [soft=false])`

Removes items from the collection.

#### `.addFields(fields)`

Adds new fields to the collection.

#### `.compute()`

Forces recomputation of computed fields.

#### `.removeFields(fields)`

Removes fields from the collection.

#### `.sort(fields, [zeroIsLast=false])`

Sorts the collection.

---

### Grouping Methods

#### `.groupBy(fields)`

Groups the collection based on specified fields.

#### `.indexBy(indexes)`

Creates a map of the collection indexed by specified fields.

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


## License

Qstore is open-source and released under the MIT License.
