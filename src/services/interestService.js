// Recursively builds a subinterest hierarchy starting from a specific ID.
// Subinterests can reference other subinterests by ID,
// allowing the function to navigate through multiple hierarchy levels.
function findSubinterestRecursive(
    subinterestId,
    subinterests,
    visited = new Set()
) {

    // Stops the recursion if this subinterest has already been visited.
    // This prevents circular references from causing infinite recursion.
    if (visited.has(subinterestId)) {
        return null;
    }

    // Marks the current subinterest as visited.
    visited.add(subinterestId);

    // Finds the current subinterest in the collection.
    const subinterest = subinterests.find(
        item => item.id === subinterestId
    );

    // Base case: returns null if the requested subinterest does not exist.
    if (!subinterest) {
        return null;
    }

    // Base case: returns the current subinterest if it has no children.
    if (
        !Array.isArray(subinterest.subinterests) ||
        subinterest.subinterests.length === 0
    ) {
        return {
            ...subinterest,
            children: []
        };
    }

    // Recursive case: calls this function for each child subinterest
    // and builds the next level of the hierarchy.
    const children = subinterest.subinterests
        .map(childId =>
            findSubinterestRecursive(
                childId,
                subinterests,
                new Set(visited)
            )
        )
        .filter(child => child !== null);

    // Returns the current subinterest together with
    // all child subinterests found recursively.
    return {
        ...subinterest,
        children: children
    };
}


// Recursively collects the IDs of a subinterest and all its descendants.
// This list is used by the recommendation engine to match related
// subinterests even when they were not directly selected by the user.
function getSubinterestHierarchyIds(
    subinterestId,
    subinterests,
    visited = new Set()
) {

    // Stops the recursion if this subinterest has already been visited.
    // This prevents circular references from causing infinite recursion.
    if (visited.has(subinterestId)) {
        return [];
    }

    // Marks the current subinterest as visited.
    visited.add(subinterestId);

    // Finds the current subinterest in the collection.
    const subinterest = subinterests.find(
        item => item.id === subinterestId
    );

    // Base case: returns an empty array if the subinterest does not exist.
    if (!subinterest) {
        return [];
    }

    // Starts the hierarchy with the current subinterest ID.
    let ids = [subinterest.id];

    // Recursive case: collects the IDs of every child and descendant.
    if (Array.isArray(subinterest.subinterests)) {
        for (const childId of subinterest.subinterests) {
            ids = ids.concat(
                getSubinterestHierarchyIds(
                    childId,
                    subinterests,
                    new Set(visited)
                )
            );
        }
    }

    // Returns the complete list of IDs found in the hierarchy.
    return ids;
}


// Makes the recursive interest functions available to other services.
export {
    findSubinterestRecursive,
    getSubinterestHierarchyIds
};