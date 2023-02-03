export const filterArray = (originalArray) => {
    const newArray = [];
    const lookupObject = {};

    for (const i in originalArray) {
        lookupObject[originalArray[i].id] = originalArray[i];
    }

    for (const i in lookupObject) {
        newArray.push(lookupObject[i]);
    }

    return newArray;
};
