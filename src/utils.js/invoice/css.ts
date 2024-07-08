export const invoiceCss = `
  body {
    font-family: Arial, sans-serif;
  }
  .invoice-box {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-size: 0.8rem;
    font-family: 'Roboto', sans-serif;
}

.invoice-headr{
    display:flex;
    flex-direction:rows;
    justify-content: space-between;  
}

.src-left{
background-color: #fffff;
border-left:1px solid black;
border-right:1px solid black;
font-size:0.7rem;
font-style: italic;
}

.catgory{
font-weight: 1000;
font-size: 0.9rem;
text-decoration: underline;

} 
.src-right{
background-color: #fffff;
border-right:1px solid black;
font-size:0.7rem;
font-style: italic;
}
.src{
background-color: #fffff;
border-right:1px solid black;
font-size:0.7rem;
font-style: italic;
}


.src-heading {
background-color: #cccccc;
border-top:1px solid black;
border-right:1px solid black;
border-left:1px solid black;
}

.invoice-box table tr.invoiceheading td {  
    border-bottom: 1px solid #000;
    font-weight: bold;
}

.invoice-box table {
    width: 100%;
    line-height: inherit;
    text-align: left;
}

.invoice-box table td {
    padding: 5px; 
}

.invoice-box table tr.heading td  {  
    border-bottom: 1px solid #000;
    border-top: 1px solid #000;
    font-weight: bold;
}

.invoice-box table tr.total td {
    border-bottom: 1px solid #000;
    border-top: 1px solid #000;
    font-weight: bold;
}

.companyheading{
margin-bottom: 0;
text-transform: uppercase;
}

.header-subheading{
margin:0;
}

.customername {
text-transform: uppercase;
}

.right{
text-align: right;
}

.invoice-summary{
display:flex;
justify-content:flex-end;
margin-top:2px;
margin-right:0px
}


.opening-balance-text{
padding-top:20px;
}

.disclaimer-text{
padding-top:40px;
font-size:0.6rem;
}





`