# Hobben Recommendation Engine

Hobben is a JavaScript recommendation engine designed to connect users with communities based on shared interests and subinterests.

This project represents the first development phase of a larger community platform. Phase 1 focuses on the recommendation logic and runs locally using Node.js.

## Project Purpose

The purpose of the recommendation engine is to help users discover communities that match their interests.

The engine compares general interests and hierarchical subinterests to calculate how compatible each community is with a selected user.

For example, the application can represent a hierarchy such as:

```text
Artificial Intelligence
└── Machine Learning
    └── Deep Learning
        └── Neural Networks
```

If a user selects **Machine Learning**, the recommendation engine can recursively discover related subinterests such as **Deep Learning** and **Neural Networks**.

These related subinterests are included when calculating the compatibility between the user and each community.

## Technologies

The project uses:

- JavaScript
- Node.js
- npm
- ES Modules
- Lodash

## Project Structure

```text
hobben_recomendation/
│
├── src/
│   ├── data/
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── interests.js
│   │   └── subinterests.js
│   │
│   ├── services/
│   │   ├── interestService.js
│   │   └── matchingService.js
│   │
│   └── index.js
│
├── tests/
│   └── matchingService.test.js
│
├── package.json
├── package-lock.json
└── README.md
```

## Application Architecture

The project separates data, business logic, application execution, and tests.

### Data Layer

The `src/data/` directory contains the application data:

- `users.js`
- `groups.js`
- `interests.js`
- `subinterests.js`

### Service Layer

The `src/services/` directory contains the application logic:

- `interestService.js` manages recursive subinterest operations.
- `matchingService.js` generates and ranks group recommendations.

### Application Entry Point

The `src/index.js` file:

- Imports the application data.
- Selects a user.
- Runs the recommendation engine.
- Handles errors.
- Displays the recommendation results.
- Displays a recursive subinterest hierarchy.

### Test Layer

The `tests/` directory contains the automated tests for the recommendation engine.

## Data Model

The application uses four main data collections.

### Users

Users contain personal information and the IDs of their selected interests and subinterests.

Example:

```javascript
{
    id: 1,
    name: "Gleyson",
    email: "gleyson@example.com",
    phone: "123-456-7890",
    interests: [1, 4, 3],
    subinterests: [1]
}
```

The `interests` array contains general interest IDs.

The `subinterests` array contains the IDs of more specific topics selected by the user.

### Groups

Groups represent communities that can be recommended to users.

Each group contains:

- A unique ID.
- A group name.
- A list of member IDs.
- An owner ID.
- A list of interest IDs.
- A list of subinterest IDs.

Example:

```javascript
{
    id: 1,
    name: "Technology Community",
    users_id: [1],
    user_owner_id: 1,
    interests: [1, 2, 3],
    subinterests: [4, 6]
}
```

The recommendation engine compares these interests and subinterests with the selected user's preferences.

### Interests

Interests represent general topics.

Examples include:

- Artificial Intelligence
- Programming
- Technology
- Games
- Music
- Instruments
- Singing

Each interest can also reference related subinterests.

Example:

```javascript
{
    id: 1,
    name: "artificial intelligence",
    subinterests: [1, 2]
}
```

### Subinterests

Subinterests represent more specific topics.

A subinterest can reference other subinterests by ID, allowing the application to create multiple hierarchy levels.

Example:

```javascript
{
    id: 1,
    name: "machine learning",
    subinterests: [4]
}
```

A complete hierarchy can look like this:

```text
Machine Learning
└── Deep Learning
    └── Neural Networks
```

## Recommendation Engine

The main recommendation logic is located in:

```text
src/services/matchingService.js
```

The recommendation engine performs the following operations:

1. Validates the user and application data.
2. Expands the user's selected subinterests recursively.
3. Removes duplicate subinterest IDs with Lodash.
4. Compares the user's interests with each group's interests.
5. Compares the user's expanded subinterests with each group's subinterests.
6. Calculates the main interest match percentage.
7. Calculates the subinterest match percentage.
8. Calculates a final compatibility score.
9. Removes groups without matching main interests.
10. Sorts the remaining groups from highest to lowest compatibility.

## Interest Matching

The recommendation engine identifies the main interests shared by the user and each group.

For example:

```text
User interests:
Artificial Intelligence
Games
Technology

Group interests:
Artificial Intelligence
Programming
Technology
```

The matching interests are:

```text
Artificial Intelligence
Technology
```

The main interest score is the number of interests shared by the user and the group.

## Hierarchical Subinterest Matching

The engine does not compare only the subinterests directly selected by the user.

It also uses recursion to discover every descendant of the selected subinterests.

For example, if the user selects:

```text
Machine Learning
```

The recursive process can expand the selection to:

```text
Machine Learning
Deep Learning
Neural Networks
```

If a group contains **Deep Learning** or **Neural Networks**, the recommendation engine recognizes these topics as hierarchical matches.

## Compatibility Score

When a group contains subinterests, the final compatibility score uses two components:

```text
Main interests: 70%
Subinterests:   30%
```

The calculation is:

```text
Compatibility Score =
(Main Interest Match × 0.70)
+
(Subinterest Match × 0.30)
```

### Calculation Example

```text
Main interest match:     67%
Subinterest match:      100%
```

Calculation:

```text
67 × 0.70  = 46.9
100 × 0.30 = 30

46.9 + 30 = 76.9
```

The application uses `Math.round()` to produce the final result:

```text
Compatibility Score: 77%
```

### Groups Without Subinterests

If a group does not have subinterests, the compatibility score is based entirely on the main interest percentage.

For example:

```text
Main interest match:    100%
Group subinterests:       0
Compatibility score:    100%
```

This rule prevents groups from being penalized because they do not define subinterests.

## Recursion

Recursion is implemented in:

```text
src/services/interestService.js
```

The service contains two recursive functions.

### `findSubinterestRecursive()`

This function builds a complete hierarchical representation of a subinterest and its descendants.

Example result:

```text
Machine Learning
└── Deep Learning
    └── Neural Networks
```

The function returns the hierarchy as nested objects using a `children` property.

### `getSubinterestHierarchyIds()`

This function collects the ID of a selected subinterest and the IDs of all its descendants.

For example:

```javascript
[1]
```

can be expanded to:

```javascript
[1, 4, 6]
```

The recommendation engine uses this expanded list when comparing the user with each community.

## Circular Reference Protection

Both recursive operations track previously visited subinterest IDs using a JavaScript `Set`.

This prevents circular relationships from causing infinite recursion.

The recursive functions stop processing a branch when they find an ID that has already been visited. This prevents errors such as:

```text
RangeError: Maximum call stack size exceeded
```

## External JavaScript Library

The project uses **Lodash** as an external JavaScript library.

Lodash is installed through npm and imported into the recommendation service:

```javascript
import _ from "lodash";
```

The application uses:

```javascript
_.uniq()
```

This function removes duplicate IDs generated while recursively expanding the user's subinterests.

For example:

```javascript
[1, 4, 6, 4, 6]
```

becomes:

```javascript
[1, 4, 6]
```

## Data Validation and Error Handling

The recommendation engine validates:

- A user was provided.
- The user's interests are stored in an array.
- The user's subinterests are stored in an array.
- Groups are stored in an array.
- Interests are stored in an array.
- Subinterests are stored in an array.
- Each group's interests are stored in an array.
- Each group's subinterests are stored in an array.

If invalid data is detected, the service generates an error using `throw new Error()`.

The main application uses a `try...catch` block to handle errors and display readable messages.

## Installation

### Prerequisites

Node.js and npm must be installed before running the application.

Verify the installation with:

```bash
node --version
npm --version
```

### Clone the Repository

```bash
git clone <repository-url>
cd hobben_recomendation
```

Replace `<repository-url>` with the URL of this GitHub repository.

### Install Dependencies

```bash
npm install
```

This command installs the dependencies defined in `package.json`, including Lodash.

## Running the Application

From the project root, run:

```bash
node src/index.js
```

Each recommendation includes:

- Group ID
- Group name
- Matching interests
- Matching subinterests
- Main interest score
- Main interest match percentage
- Subinterest match percentage
- Final compatibility score

The application also displays the recursive subinterest hierarchy in JSON format.

## Automated Tests

The automated tests are located in:

```text
tests/matchingService.test.js
```

Run the tests with:

```bash
npm test
```

The test suite verifies:

1. A valid user receives recommendations.
2. An invalid user generates a controlled error.
3. Recommendations are sorted by compatibility score.
4. Recursive subinterest matching works correctly.

Expected result:

```text
PASS: Valid user receives recommendations
PASS: Invalid user throws an error
PASS: Recommendations are sorted by compatibility
PASS: Recursive subinterest matching works
```

## JavaScript Concepts Demonstrated

- Objects
- Arrays
- Functions
- Arrow functions
- ES Modules
- `import` and `export`
- `map()`
- `filter()`
- `find()`
- `flatMap()`
- `includes()`
- `sort()`
- `concat()`
- Spread syntax
- Default parameters
- Ternary operators
- Template literals
- `Set`
- Recursion
- Exception handling
- `try...catch`
- External npm libraries

## npm Commands

Install project dependencies:

```bash
npm install
```

Run the application:

```bash
node src/index.js
```

Run the automated tests:

```bash
npm test
```

## Current Project Phase

This version represents:

```text
Phase 1: JavaScript Recommendation Engine
```

The current application focuses on:

- JavaScript recommendation logic
- Interest matching
- Hierarchical subinterest matching
- Recursive data processing
- Compatibility calculation
- Exception handling
- Automated tests
- Local data simulation

The application currently runs in the terminal using Node.js.

Future phases can reuse this recommendation engine as the logic layer of a web application connected to persistent cloud data.
