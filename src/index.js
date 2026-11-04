// Imports the application data.
// These files contain the users, groups, and available interests.
import users from "./data/users.js";
import groups from "./data/groups.js";
import interests from "./data/interests.js";

// Imports the recommendation engine responsible for matching
// a user with groups based on shared interests.
import { matchGroups } from "./services/matchingService.js";

// Finds the user who will receive group recommendations.
// For now, the user is selected by ID for testing purposes.
const user = users.find(user => user.id === 1);

// Runs the recommendation engine for the selected user.
// The engine compares the user's interests with each group's interests.
const recommendations = matchGroups(
  user,
  groups,
  interests
);

// Displays the recommendation results in the console.
console.log(`Recommended groups for ${user.name}:`);
console.log(recommendations);