import { convertToPrice } from "../utils";
import { invoiceCss } from "./css";

export const generateInvoiceHtml = (jsonData, customerData) => {
    console.log(JSON.stringify(jsonData, null, 2));
    const isTaxable = jsonData.taxable === 'checked'
    return `

<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>A simple, clean, and responsive HTML invoice template</title>
  <link href="https://fonts.googleapis.com/css?family=Montserrat|Roboto&display=swap" rel="stylesheet">
  <style type="text/css">
    ${invoiceCss}
  </style>
</head>

<body>
  <div class="invoice-box">
    <div class="flex-invoicesubheader">
      <table>
        <tr class="invoiceheading">
          <td colspan=2>
            <div class="invoice-headr">
              <div class="headerdiv">
                <h2 class="companyheading"> Pankaj Jwellers </h2>
                <small>Tyagi Markeet Krishna Nagar Merrut Road Ghaziabad</small><br>
                <small>Phone: +91 9971973844</small>
              </div>
              <div class="headerinvoicediv">
                <h2 class="companyheading"> ${customerData.id?.replace("-", "").substr(0, 5)} </h2>
                <h3 class="header-subheading">${new Date(jsonData.datetime).toLocaleDateString()}</h3>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 15px; vertical-align: top;">
            <div class="headerdiv-customer">
              <div class="sub-customerinfo"><b>Bill To</b></div>
              <div class="customername">${customerData.name}</div>
              <div class="sub-customerinfo">${customerData.gender} </div>
              <div class="sub-customerinfo">${customerData.phone}</div>
              <div class="sub-customerinfo">${customerData.address}</div>
              <div class="sub-customerinfo">${customerData.id?.replace("-", "").substr(0, 5)} </div>
            </div>
          </td>
          <td style="padding-top: 15px; vertical-align: top;">
            <div class="ng-star-inserted">
              <div class="date ng-star-inserted" style="text-align: right;"><b>Gold Price</b></div>
              <div class="date" style="text-align: right;">${convertToPrice(jsonData.goldPrice)}</div>
            </div>
            <div>
              <div class="date" style="text-align: right;"><b>Silver Price</b></div>
              <div class="date" style="text-align: right;">${convertToPrice(jsonData.silverPrice)}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="right"></td>
          <td colspan="5" class="src-heading" style="text-align:center; ">
            RETAIL INFORMATION
          </td>
        </tr>
        <tr class="heading">
          <td>
            ITEM NAME
          </td>
          <td>
            METAL
          </td>
          <td>
            QTY
          </td>
          <td class="right">
            WEIGHT
          </td>
          <td class="right">
            PRICE
          </td>
          <td class="right src-left">
            AMOUNT
          </td>
          <td class="right src">
            LABOUR
          </td>
          <td class="right src">
            TAX
          </td>
          <td class="right src">
            DISCOUNT
          </td>
          <td class="right src-right">
            FINAL AMOUNT
          </td>
        </tr>

        
        ${jsonData.items.map(item => {
        return `<tr class="item">
            <td> ${item.item_name} </td>
            <td> ${item.metalType} </td>
            <td>  ${item.quantity} </td>
            <td class="right"> ${item.weight_in_gram}g ${item.weight_in_milligram}mg</td>
            <td class="right"> ${convertToPrice(item.price)} </td>
            <td class="right src-left"> <i>${convertToPrice(item.total)} </i> </td>
              <td class="right src">
              ${convertToPrice(item.labour)}
            </td>
            <td class="right src">
              ${convertToPrice(item.tax ?? 0)}
            </td>
            <td class="right src">
              ${convertToPrice(item.discount)}
            </td>
            <td class="right src-right"> <i>${convertToPrice(item.finalAmount)} </i> </td>
          </tr>`
    })}
         
      </table>
    </div>
    <div class="invoice-summary">
      <table style="width:30%">
        <thead>

        </thead>
        <tbody>
         ${isTaxable ? `<tr>
            <td style="font-size:13px; font-weight: 600;"> Total </td>
            <td class="right"> ${convertToPrice(jsonData.totalBeforeTax)} </td>
          </tr>`: ""}
          ${isTaxable ? `<tr>
            <td style="font-size:13px; font-weight: 600; "> Sales Tax</td>
            <td class="right"> ${convertToPrice(jsonData.tax)} </td>
          </tr>`: ''}
          <tr>
            <td style="font-size:13px; font-weight: 600; "> Total Amount</td>
            <td class="right"> ${convertToPrice(jsonData.amountPaid)} </td>
          </tr>
          <tr>
            <td style="font-size:13px; font-weight: 600; "> Amount Paid</td>
            <td class="right"> ${convertToPrice(jsonData.totalAfterTax)} </td>
          </tr>
          <tr>
            <td style="font-size:13px; font-weight: 600;"> Remaining Balance </td>
            <td class="right"> ${convertToPrice(jsonData.totalAfterTax - jsonData.amountPaid)} </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex-invoicesubheader">
      <table>
        <tbody>
          <tr>
            <div class="opening-balance-text" style="text-align:center;"> PANKAJ JWELLERS </div>
          </tr>

          <tr>
            <p class="disclaimer-text"> All the information in the correct. </p>

            <img src="http://barcode.pinonclick.com/barcode?code=413075" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>

</html>`}