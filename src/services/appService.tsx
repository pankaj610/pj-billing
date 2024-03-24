
import database from '@react-native-firebase/database';
import { Billing, Customer } from '../types/billing';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
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
  return new Promise((resolve, reject) => {
    customersRef.once('value', (snapshot) => {
      resolve(snapshot.val());
    }, error => {
      reject(error);
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


export const createBilling = ({ customer, billing }: { customer: Customer; billing: Partial<Billing> }) => {
  return new Promise((resolve, reject) => {
    db.ref(`/bills/${customer.id}`).push()
      .update(billing).then((data) => {
        console.log(data); resolve(data);
      }).catch(err => {
        reject(err);
      });
  });
}

export const fetchBilling = ({ customer }: { customer: Customer; }) => {
  return new Promise((resolve, reject) => {
    db.ref(`/bills/${customer.id}`).once('value', (snapshot) => {
      resolve(snapshot.val());
    }, error => {
      reject(error);
    });
  });
}

export const deleteBill = ({ customer, billId }: { customer: Customer; billId: string }) => {
  return new Promise((resolve, reject) => {
    db.ref(`/bills/${customer.id}/${billId}`).remove().then(() => {
      resolve("Entry Removed")
    })
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