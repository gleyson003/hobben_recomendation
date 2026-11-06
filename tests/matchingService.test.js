import users from "../src/data/users.js";
import groups from "../src/data/groups.js";
import interests from "../src/data/interests.js";
import subinterests from "../src/data/subinterests.js";

import { matchGroups } from "../src/services/matchingService.js";

function runTest(name, testFunction) {
    try {
        testFunction();
        console.log(`PASS: ${name}`);
    } catch (error) {
        console.error(`FAIL: ${name}`);
        console.error(error.message);
    }
}


// Test 1: Valid user should receive recommendations.
runTest("Valid user receives recommendations", () => {

    const user = users.find(user => user.id === 1);

    const recommendations = matchGroups(
        user,
        groups,
        interests,
        subinterests
    );

    if (recommendations.length === 0) {
        throw new Error("No recommendations were generated.");
    }
});


// Test 2: Invalid user should throw an error.
runTest("Invalid user throws an error", () => {

    let errorThrown = false;

    try {
        matchGroups(
            undefined,
            groups,
            interests,
            subinterests
        );
    } catch (error) {
        errorThrown = true;
    }

    if (!errorThrown) {
        throw new Error("Expected an error for an invalid user.");
    }
});


// Test 3: Recommendations should be sorted by compatibility.
runTest("Recommendations are sorted by compatibility", () => {

    const user = users.find(user => user.id === 1);

    const recommendations = matchGroups(
        user,
        groups,
        interests,
        subinterests
    );

    for (let i = 1; i < recommendations.length; i++) {

        if (
            recommendations[i].compatibilityScore >
            recommendations[i - 1].compatibilityScore
        ) {
            throw new Error(
                "Recommendations are not correctly sorted."
            );
        }
    }
});


// Test 4: Recursive subinterest matching should work.
runTest("Recursive subinterest matching works", () => {

    const user = users.find(user => user.id === 1);

    const recommendations = matchGroups(
        user,
        groups,
        interests,
        subinterests
    );

    const hasRecursiveMatch = recommendations.some(
        recommendation =>
            recommendation.matchingSubinterests.length > 0
    );

    if (!hasRecursiveMatch) {
        throw new Error(
            "No recursive subinterest match was found."
        );
    }
});