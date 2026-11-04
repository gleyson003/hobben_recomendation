// Finds an interest by its ID and returns its name.
// This allows the recommendation results to display readable
// interest names instead of only numeric IDs.
function getInterestName(interestId, interests) {

    const interest = interests.find(
        interest => interest.id === interestId
    );

    // Returns the interest name when found.
    // If the ID does not exist, returns a default description.
    return interest ? interest.name : "Unknown interest";
}


// Generates group recommendations for a specific user
// based on interests shared between the user and each group.
function matchGroups(user, groups, interests) {

    // Evaluates every group and creates a recommendation object.
    const recommendations = groups.map(group => {

        // Finds the group's interests that are also present
        // in the selected user's list of interests.
        const matchingInterests = group.interests.filter(
            interestId => user.interests.includes(interestId)
        );

        const matchPercentage = Math.round(
            (matchingInterests.length / group.interests.length) * 100
        );

        // Creates the recommendation result for the current group.
        return {
            groupId: group.id,
            groupName: group.name,

            // Converts matching interest IDs into readable names.
            matchingInterests: matchingInterests.map(
                interestId => getInterestName(interestId, interests)
            ),

            // The score represents how many interests
            // the user and the group have in common.
            score: matchingInterests.length,
            matchPercentage: matchPercentage
        };

    });

    // Removes groups with no matching interests and sorts
    // the remaining groups from highest to lowest match score.
    return recommendations
        .filter(recommendation => recommendation.score > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);
}


// Makes the matching function available to other application files,
// such as index.js.
export { matchGroups };