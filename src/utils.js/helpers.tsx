

export const transformObjectToArray = (obj: any) => {
    const arr = [];
    for (let key in obj) {
        arr.push({ ...obj[key], id: key });
    }
    return arr;
}