import { convertToPrice } from "./utils";


export const transformObjectToArray = (obj: any) => {
    const arr = [];
    for (let key in obj) {
        arr.push({ ...obj[key], id: key });
    }
    return arr.sort((a, b) => b.datetime - a.datetime);
}

export const getDueAmount = (billings) => {
    const finalAmount = billings.reduce((acc, val) => {
        if (val.totalAfterTax) {
            acc += val.totalAfterTax
        }
        if (val.amountPaid) {
            acc -= val.amountPaid
        }
        return acc
    }, 0)
    return convertToPrice(finalAmount)
}