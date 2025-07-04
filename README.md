# Sorting Problem

## Goal

Create a data structure to represent the entries in a phone book. Each entry should include information like name, phone number, and any additional relevant details.

## Implemented functions:

- `add()`: Add new contacts
- `update()`: Update contact fields by phone number
- `delete()`: Remove contact by phone number
- `sort()`: Sort contacts by a selected field

## Structure:

### Contact

-Contains `firstName`, `lastName`, `fullName`, `phoneNumber`, `email`.
-string fields are stored in lowercase only to allow for more efficient downstream sorting.

### Phonebook

-Contains an array of `Contact` objects and a `sortedBy` status (contact field name or boolean). -`sortedBy` keeps track of how the list is currently sorted. This eliminates redundant sorts (ie if the list is already sorted by last name, do not re-sort if the `sort("lastName")` function is run). The search(), update() and delete functions also operate on the assumption the that list is sorted by phone number, so sortedBy is an easy reference to know if this is currently true.

---

### Functions:

#### `add()`

Creates a new contact, pushes it into the contacts array, and sets `sortedBy = false` to indicate this list is no longer sorted.

#### `search(phoneNumber)`

A **binary search** function. If the list is already sorted by phone number, it is O(logn), if sort is needed first it will be O(n log n).

We assume that a phone number will be unique, wheres name fields may have duplicated. We also store `phoneNumber` as a number, meaning we have to do less work to search using this as a binary search function.

While a search function is outside of the scope of this project, we need it for our update and delete functions if not using the native js Array.prototype.find().

For this reason, the search function returns both a contact and the index of where that contact is in the sorted contacts list.

Instead of splicing the array in half at each iteration, `search()` reduces a startIndex and stopIndex for the original contacts array. This means that the midpoint of each iteration will always be the true index of the matching contact, which can then be returned.

### How the `search(phoneNumber)` function works step-by-step:

1. **Initialize two pointers:**

   - `startIndex` at the beginning of the contacts array (0).
   - `stopIndex` at the end of the contacts array (`contacts.length - 1`).

2. **Loop while** `startIndex <= stopIndex`:  
   Continue searching as long as there is a valid range.

3. **Calculate the midpoint index:**
   ```js
   midIndex = Math.floor((startIndex + stopIndex) / 2);
   ```

#### `update(phoneNumber, fieldName, newValue)`

This function performs a binary search (`search()`, O(log n)), then uses the returned index to directly update a contact O(1).

If `contacts` is already sorted by phoneNumber,total time complexity is O(log n). If not, `sort()` (described below) will also be called, resulting in total time complexity of O(n log n)

Contacts are identified by phoneNumber, then the given `fieldName` is updated to the `newValue` in the Phonebook.

The use of `search()` sorts `contacts` by `phoneNumber` if not already done. If a contact's `phoneNumber` is subsequently updated, `sortedBy` is then set to false.

#### `delete(phoneNumber)`

This function performs a binary search (`search()`, Ologn), then uses the returned index to delete the specified contact using `Array.splice` (O(n)).

If `contacts` is already sorted by phoneNumber,total time complexity is O(n). If not, `sort()` (described below) will also be called, resulting in total time complexity of O(log n)

---

## 🔄 Sorting

The `PhoneBook` class uses a custom **merge sort** implementation to sort contacts by various fields such as `phoneNumber`, `firstName`, `lastName`, `fullName`, and `email`.

> 📝 While JavaScript’s native sort method uses **TimSort**, which is typically faster in practice, this project uses **merge sort** to demonstrate manual sorting logic. Both algorithms have an average time complexity of **`O(n log n)`**, but TimSort’s internal mechanics are considered out of scope for this assignment.

### 1. `sort(sortBy)`

- A **public** method that acts as a wrapper for the recursive `mergeSort()` function.
- Accepts a `sortBy` parameter indicating which field to sort by.
- Checks whether the contacts are already sorted by that field using the `sortedBy` property.
- If already sorted, it **avoids re-sorting**.
- Otherwise, it performs a sort and updates `this.contacts` with the sorted array.
- Updates `this.sortedBy` to reflect the new sort field.

### 2. `mergeSort(arr, sortBy)`

- A recursive function that implements **merge sort** on the `arr` of contacts based on the specified `sortBy` field.
- Splits the array into `left` and `right` halves until the base case of `length <= 1`.
- Recursively sorts each half, then merges them back together using:
  - `mergeByPhoneNumber()` for numerical sorts
  - `mergeByString()` for alphabetical sorts

### 3a. `mergeByPhoneNumber(left, right)`

- Merges two already-sorted arrays of contacts by comparing their `phoneNumber` values.
- Returns a new sorted array by repeatedly moving the lower `phoneNumber` from either `left` or `right` into a result array.
- Continues until all items from both arrays are merged.

### 3b. `mergeByString(left, right, sortBy)`

- Works similarly to `mergeByPhoneNumber()`, but compares contacts using `localeCompare()` on the specified string field (e.g., `firstName`, `email`).
- Ensures proper alphabetical ordering based on the field.
- Returns a new sorted array of contacts.

### 4. Summary of Sort Flow

- `mergeSort()` receives a single sorted array from each recursive call.
- It resolves the base case first (where `left.length <= 1` and `right.length <= 1`), and progressively merges results up the call stack.
- Once complete, the top-level call to `mergeSort()` returns one fully sorted array.
- This array replaces `this.contacts` in the `PhoneBook`, and `sortedBy` is updated.

---

## Test cases

To run the tests:

```bash
-npm install
-node ./dist/index.js
```

### Test cases will console.log the phonebook after each case

1. **Creation and addition** of 8 contacts to the phone book
2. **Sorting the phone book** by:
   - Phone number
   - First name
   - Last name
   - Full name
   - Email
3. **Updating** a contact's first name
4. **Deleting** a contact
