// Imports the application data used by the recommendation engine.
// The data includes users, groups, interests, and subinterests.
import users from "./data/users.js";
import groups from "./data/groups.js";
import interests from "./data/interests.js";
import subinterests from "./data/subinterests.js";


// Imports the recommendation engine and the recursive
// function used to build a subinterest hierarchy.
import { matchGroups } from "./services/matchingService.js";
import { findSubinterestRecursive } from "./services/interestService.js";


// Selects the user who will receive group recommendations.
// For this prototype, the user is selected by ID.
const user = users.find(
  user => user.id === 1
);


// Runs the recommendation engine inside a try/catch block
// so validation or processing errors can be handled gracefully.
try {

  const recommendations = matchGroups(
    user,
    groups,
    interests,
    subinterests
  );

  // Displays the ranked group recommendations for the selected user.
  console.log(`Recommended groups for ${user.name}:`);
  console.log(recommendations);

} catch (error) {

  // Displays a readable error message if the recommendation
  // engine cannot complete the operation.
  console.error("Unable to generate recommendations:");
  console.error(error.message);
}


// Builds a hierarchical tree starting from subinterest ID 1.
// The recursive function follows every child subinterest
// until the end of each hierarchy branch.
const subinterestTree = findSubinterestRecursive(
  1,
  subinterests
);


// Displays the complete subinterest hierarchy
// in a readable JSON format for demonstration purposes.
console.log("Subinterest hierarchy:");
console.log(
  JSON.stringify(subinterestTree, null, 2)
);