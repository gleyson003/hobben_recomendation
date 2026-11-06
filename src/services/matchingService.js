import { getSubinterestHierarchyIds } from "./interestService.js";
import _ from "lodash";


// Finds an interest by its ID and returns its name.
// This allows recommendation results to display readable names
// instead of numeric interest IDs.
function getInterestName(interestId, interests) {

    const interest = interests.find(
        interest => interest.id === interestId
    );

    // Returns a default description if the interest does not exist.
    return interest ? interest.name : "Unknown interest";
}


// Finds a subinterest by its ID and returns its name.
// This allows recommendation results to display readable names
// instead of numeric subinterest IDs.
function getSubinterestName(subinterestId, subinterests) {

    const subinterest = subinterests.find(
        subinterest => subinterest.id === subinterestId
    );

    // Returns a default description if the subinterest does not exist.
    return subinterest ? subinterest.name : "Unknown subinterest";
}


// Generates and ranks group recommendations for a specific user
// based on shared interests, subinterests, and subinterest hierarchy.
function matchGroups(user, groups, interests, subinterests) {

    // Validates whether a user was provided.
    if (!user) {
        throw new Error("User not found.");
    }

    // Validates whether the user's interests are stored in an array.
    if (!Array.isArray(user.interests)) {
        throw new Error("The user interests must be an array.");
    }

    // Validates whether the user's subinterests are stored in an array.
    if (!Array.isArray(user.subinterests)) {
        throw new Error("The user subinterests must be an array.");
    }

    // Validates whether groups are stored in an array.
    if (!Array.isArray(groups)) {
        throw new Error("Groups must be an array.");
    }

    // Validates whether interests are stored in an array.
    if (!Array.isArray(interests)) {
        throw new Error("Interests must be an array.");
    }

    // Validates whether subinterests are stored in an array.
    if (!Array.isArray(subinterests)) {
        throw new Error("Subinterests must be an array.");
    }


    // Expands the user's selected subinterests by recursively collecting
    // their descendant IDs. Lodash removes duplicate IDs that may be
    // reached through more than one hierarchy path.
    const expandedUserSubinterests = _.uniq(
        user.subinterests.flatMap(
            subinterestId =>
                getSubinterestHierarchyIds(
                    subinterestId,
                    subinterests
                )
        )
    );


    // Evaluates each group and creates a recommendation result.
    const recommendations = groups.map(group => {

        // Validates whether the group's interests are stored in an array.
        if (!Array.isArray(group.interests)) {
            throw new Error(
                `The interests of group "${group.name}" must be an array.`
            );
        }

        // Validates whether the group's subinterests are stored in an array.
        if (!Array.isArray(group.subinterests)) {
            throw new Error(
                `The subinterests of group "${group.name}" must be an array.`
            );
        }


        // Finds the main interests shared by the user and the group.
        const matchingInterests = group.interests.filter(
            interestId => user.interests.includes(interestId)
        );


        // Finds group subinterests that match either a directly selected
        // user subinterest or one of its recursively discovered descendants.
        const matchingSubinterests = group.subinterests.filter(
            subinterestId =>
                expandedUserSubinterests.includes(subinterestId)
        );


        // Calculates the percentage of the group's main interests
        // that match the user's interests.
        const matchPercentage = group.interests.length > 0
            ? Math.round(
                (matchingInterests.length / group.interests.length) * 100
            )
            : 0;


        // Calculates the percentage of the group's subinterests
        // that match the user's expanded subinterest hierarchy.
        const subinterestMatchPercentage = group.subinterests.length > 0
            ? Math.round(
                (matchingSubinterests.length / group.subinterests.length) * 100
            )
            : 0;


        // Calculates the final compatibility score.
        // Main interests represent 70% of the score and subinterests 30%.
        // Groups without subinterests use only the main interest percentage
        // so they are not penalized for having no subinterests.
        const compatibilityScore = group.subinterests.length > 0
            ? Math.round(
                (matchPercentage * 0.7) +
                (subinterestMatchPercentage * 0.3)
            )
            : matchPercentage;


        // Creates the recommendation result for the current group.
        return {
            groupId: group.id,
            groupName: group.name,

            // Converts matching interest IDs into readable names.
            matchingInterests: matchingInterests.map(
                interestId =>
                    getInterestName(interestId, interests)
            ),

            // Converts matching subinterest IDs into readable names.
            matchingSubinterests: matchingSubinterests.map(
                subinterestId =>
                    getSubinterestName(
                        subinterestId,
                        subinterests
                    )
            ),

            // Number of main interests shared by the user and the group.
            score: matchingInterests.length,

            // Percentage of matching main interests.
            matchPercentage: matchPercentage,

            // Percentage of matching subinterests.
            subinterestMatchPercentage: subinterestMatchPercentage,

            // Final weighted score used to rank recommendations.
            compatibilityScore: compatibilityScore
        };
    });


    // Removes groups without matching main interests
    // and ranks the remaining recommendations from highest
    // to lowest compatibility score.
    return recommendations
        .filter(recommendation => recommendation.score > 0)
        .sort(
            (a, b) =>
                b.compatibilityScore - a.compatibilityScore
        );
}


// Makes the recommendation engine available to other application files.
export { matchGroups };