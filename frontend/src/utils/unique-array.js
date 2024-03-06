const uniqueArray = (arr, key = "_id") => {
  const mappedArr = arr.map((item, index) => {
    if (item[key]) {
      return [item[key], item];
    }

    throw new Error(
      `"${key}" doesn't exist in the element at position ${index}`
    );
  });

  return [...new Map(mappedArr).values()];
};

export default uniqueArray;
