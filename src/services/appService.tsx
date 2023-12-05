
import database from '@react-native-firebase/database';
import { BillItem, Billing, Customer } from '../types/billing';
import { useAppStore } from '../store/appStore';
const db = database();

const customersRef = db.ref('/customers');


export const getCustomer = (search: string) => {
  return new Promise((resolve) => {
    customersRef.orderByChild('phone').equalTo(search).once('value', (snapshot) => {
      resolve(snapshot.val());
    });
  })
}

export const getAllCustomer = () => {
  return new Promise((resolve) => {
    customersRef.once('value', (snapshot) => {
      resolve(snapshot.val());
    });
  })
}

export const getTodaysCustomers = () => {

}

export const createCustomer = async (data: Customer) => {
  try {
    let newCustomer = customersRef.push();
    newCustomer.update(data);
  } catch {
    throw new Error('Error while creating customer');
  }
}


export const createBilling = ({ customer, billing }: { customer: Customer; billing: Billing }) => {
  return new Promise((resolve) => {
    db.ref(`/bills/${customer.id}`).push()
      .update(billing).then((data) => {
        console.log(data); resolve(data);
      });
  });
}

export const fetchBilling = ({ customer }: { customer: Customer; }) => {
  return new Promise((resolve) => {
    db.ref(`/bills/${customer.id}`).once('value', (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

/*

/customers
name
phone
photo
address
unique_code -> 6 digit


/bills/cstid

bill_id -> unique_code+bill_id -> QRCODE
    datetime
    isHideLabour
    goldPrice
    silverPrice
    items
        item_name, 
        price,
        weight : {gram, miligram}, quantity, amount, labour, total, metalType-> gold/silver/stone/artificial
    discount
    total -> Calculated
    pdf_link

payments/cstid/bill_id/
    datetime
    mode -> cash/online
    type -> DEDUCT/CREDIT
    amount
    receipt_link

stocks/
    name
    metalType
    quantity


metalConfig
    gold
        isManualAmountEnter = false
        isWeightNeeded = true
        price
    silver
        isManualAmountEnter = false
        isWeightNeeded = true
        price
    stone
        isManualAmountEnter = true
        isWeightNeeded = true
    artificial
        isManualAmountEnter = true
        isWeightNeeded = false

*/