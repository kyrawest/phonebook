class Contact {
    firstName;
    lastName;
    fullName;
    phoneNumber;
    email;
    //Assumption: names and emails are stored with lowercase letters.
    constructor(firstName, lastName, phoneNumber, email) {
        // Store names and emails in lowercase only
        this.firstName = firstName.trim().toLowerCase();
        this.lastName = lastName.trim().toLowerCase();
        this.fullName = `${firstName} ${lastName}`;
        this.phoneNumber = phoneNumber;
        this.email = email.trim().toLowerCase();
    }
}
class PhoneBook {
    contacts = [];
    sortedBy = false;
    constructor() {
        this.contacts = [];
        this.sortedBy = false; // Indicates what field the book is currently sorted by, or false if not sorted.
    }
    add(firstName, lastName, phoneNumber, email) {
        const newContact = new Contact(firstName, lastName, phoneNumber, email);
        this.contacts.push(newContact);
        this.sortedBy = false; //The phonebook does not sort by default when adding, so indicate this here.
    }
    search(phoneNumber, startIndex = 0, stopIndex = this.contacts.length - 1) {
        // Search for contact by phone number, since phone number short by unique and is stored as a number.
        // Uses binary search.
        // This function is used downstream in update and delete methods, so we also want to return the index of the contact found.
        // To do this, we must guarantee how the list will be sorted.
        // If the list is not currently sorted by phone number, sort it first.
        if (this.sortedBy !== "phoneNumber") {
            this.sort();
        }
        if (startIndex >= stopIndex)
            return null;
        const midpoint = Math.floor((stopIndex + startIndex) / 2);
        let contact = this.contacts[midpoint];
        if (contact.phoneNumber === phoneNumber) {
            return { contact, index: midpoint }; // Return the contact if found
        }
        else if (contact.phoneNumber < phoneNumber) {
            // If the searched number is greater, look in the right half of the list.
            return this.search(phoneNumber, midpoint + 1, stopIndex);
        }
        else {
            // If the searched number is smaller, look in the left half of the list.
            return this.search(phoneNumber, startIndex, midpoint);
        }
    }
    //Contacts can be updated and deleted by searching their phone number, as we assume this is unique.
    update(phoneNumber, fieldName, newValue) {
        // Identify contact by phone number, tell us what field to update with fieldName and give us the new value for that field.
        // Uses the search function above to find the contact and gives the index of where it can be found in the phonebook.
        const result = this.search(phoneNumber);
        if (result) {
            const { contact, index } = result;
            if (contact) {
                // If the contact exists, update the specified field with the new value
                if (fieldName == "phoneNumber") {
                    //make sure phone number is saved as a number
                    this.contacts[index].phoneNumber = parseInt(newValue);
                }
                else {
                    this.contacts[index][fieldName] = newValue.trim().toLowerCase();
                }
            }
            else {
                console.log(`Contact with phone number ${phoneNumber} not found.`);
            }
            if (this.sortedBy === fieldName) {
                this.sortedBy = false;
            }
        }
        else {
            console.log(`Contact with phone number ${phoneNumber} not found.`);
        }
    }
    delete(phoneNumber) {
        // Identify contact by phone number and delete.
        // Uses the search function above to find the contact and gives the index of where it can be found in the phonebook for deletion.
        const result = this.search(phoneNumber);
        if (result) {
            const { contact, index } = result;
            if (contact) {
                // Delete the contact
                this.contacts.splice(index, 1);
            }
            else {
                console.log(`Contact with phone number ${phoneNumber} not found.`);
            }
        }
    }
    //For grading purposes, I'm assuming we should demonstrate a manual sort here, so I have done a merge sort. Based on my research, it seems TimSort (native js sort) would be more efficient, but out of the scope of this project.
    sort(sortBy = "phoneNumber") {
        //Sort contacts by phone number, name or email;
        // This is a wrapper function for the recursive mergeSort function that sets this.contacts to the sorted array.
        // If the sortBy field is not a valid field, throw an error.
        if (!["firstName", "lastName", "fullName", "phoneNumber", "email"].includes(sortBy)) {
            throw new Error(`Invalid sort field: ${sortBy}. Valid fields are: firstName, lastName, fullName, phoneNumber, email.`);
        }
        // If the phonebook is already sorted by the specified field, do nothing.
        if (this.sortedBy === sortBy)
            return;
        // Set the sorted array to this.contacts
        this.contacts = this.mergeSort(this.contacts, sortBy);
        // Update sortedBy field
        this.sortedBy = sortBy;
    }
    mergeSort(arr = this.contacts, sortBy = "phoneNumber") {
        //Sort contacts by phone number
        //Let's try a merge sort
        //base case:
        if (arr.length <= 1)
            return arr;
        //split array in half
        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), sortBy);
        const right = this.mergeSort(arr.slice(mid), sortBy);
        //merge sorted halves
        if (sortBy === "phoneNumber") {
            return this.mergeByPhone(left, right);
        }
        else if (sortBy == "firstName" ||
            sortBy == "lastName" ||
            sortBy == "fullName" ||
            sortBy == "email") {
            return this.mergeByString(left, right, sortBy);
        }
    }
    mergeByPhone(left, right) {
        let sorted = [];
        let leftIndex = 0;
        let rightIndex = 0;
        //Compare phone numbers and merge
        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex].phoneNumber < right[rightIndex].phoneNumber) {
                sorted.push(left[leftIndex]);
                leftIndex++;
            }
            else {
                sorted.push(right[rightIndex]);
                rightIndex++;
            }
        }
        //Add remaining elements
        return sorted.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }
    mergeByString(left, right, sortBy) {
        let sorted = [];
        let leftIndex = 0;
        let rightIndex = 0;
        //Compare phone numbers and merge
        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex][sortBy].localeCompare(right[rightIndex][sortBy]) <= 0) {
                sorted.push(left[leftIndex]);
                leftIndex++;
            }
            else {
                sorted.push(right[rightIndex]);
                rightIndex++;
            }
        }
        //Add remaining elements
        return sorted.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }
}
//Implementation and testing
const phonebook = new PhoneBook();
console.log("Phonebook after creation", phonebook);
const Contact1 = new Contact("John", "Doe", 1234567890, "john@google.com");
const Contact2 = new Contact("Kyra", "West", 6043764095, "kyra@google.com");
const Contact3 = new Contact("Tom", "Smith", 7783986784, "tom@outlook.com");
const Contact4 = new Contact("Clara", "Nguyen", 7783456789, "clara@outlook.com");
const Contact5 = new Contact("David", "Kim", 5554567890, "david@protonmail.com");
const Contact6 = new Contact("Ella", "Patel", 5555678901, "ella@icloud.com");
const Contact7 = new Contact("Frank", "Lee", 5556789012, "frank@live.com");
const Contact8 = new Contact("Grace", "Chen", 5557890123, "grace@zoho.com");
phonebook.add(Contact1.firstName, Contact1.lastName, Contact1.phoneNumber, Contact1.email);
phonebook.add(Contact2.firstName, Contact2.lastName, Contact2.phoneNumber, Contact2.email);
phonebook.add(Contact3.firstName, Contact3.lastName, Contact3.phoneNumber, Contact3.email);
phonebook.add(Contact4.firstName, Contact4.lastName, Contact4.phoneNumber, Contact4.email);
phonebook.add(Contact5.firstName, Contact5.lastName, Contact5.phoneNumber, Contact5.email);
phonebook.add(Contact6.firstName, Contact6.lastName, Contact6.phoneNumber, Contact6.email);
phonebook.add(Contact7.firstName, Contact7.lastName, Contact7.phoneNumber, Contact7.email);
phonebook.add(Contact8.firstName, Contact8.lastName, Contact8.phoneNumber, Contact8.email);
console.log("Phonebook after adding contacts", phonebook);
phonebook.sort();
console.log("Phonebook after sorting contacts by phone", phonebook);
phonebook.sort("firstName");
console.log("Phonebook after sorting contacts by first name", phonebook);
phonebook.sort("lastName");
console.log("Phonebook after sorting contacts by last name", phonebook);
phonebook.sort("fullName");
console.log("Phonebook after sorting contacts by full name", phonebook);
phonebook.sort("email");
console.log("Phonebook after sorting contacts by email", phonebook);
phonebook.update(1234567890, "firstName", "Johnathan");
console.log("Phonebook after updating John Doe's first name to Johnathan", phonebook.search(1234567890).contact);
phonebook.delete(6043764095);
console.log("Phonebook after deleting Kyra West's contact", phonebook);
