// export function receiptHTML(data: any) {
//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <style>
//       body { font-family: Arial; padding: 40px; }
//       .header { text-align: center; }
//       .box { margin-top: 20px; }
//       table { width: 100%; border-collapse: collapse; }
//       td, th { border: 1px solid #ccc; padding: 8px; }
//     </style>
//   </head>
//   <body>

//     <div class="header">
//       <h1>GREENFIELD COLLEGE</h1>
//       <p>Official Payment Receipt</p>
//     </div>

//     <div class="box">
//       <p><b>Student:</b> ${data.studentName}</p>
//       <p><b>Class:</b> ${data.className}</p>
//       <p><b>Receipt No:</b> ${data.reference}</p>
//       <p><b>Date:</b> ${data.date}</p>
//     </div>

//     <table>
//       <tr>
//         <th>Description</th>
//         <th>Amount (XAF)</th>
//       </tr>
//       <tr>
//         <td>${data.feeName}</td>
//         <td>${data.amount.toLocaleString()}</td>
//       </tr>
//     </table>

//     <h3 style="margin-top:20px">
//       Total Paid: ${data.amount.toLocaleString()} XAF
//     </h3>

//     <p style="margin-top:40px">
//       ✔ Payment confirmed by school administration
//     </p>

//   </body>
//   </html>
//   `;
// }

export function receiptHTML(data: {
  receiptNo: string;
  studentFirstName: string;
  studentLastName: string;
  feeName: string;
  term: string;
  amount: number;
  method: string;
  reference?: string;
  date: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #1e40af;
    }
    .box {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>PAYMENT RECEIPT</h1>
    <p><b>Receipt No:</b> ${data.receiptNo}</p>
  </div>

  <div class="box">
    <div class="row">
      <span><b>Student</b></span>
      <span>${data.studentFirstName} ${data.studentLastName}</span>
    </div>

    <div class="row">
      <span><b>Fee</b></span>
      <span>${data.feeName}</span>
    </div>

    <div class="row">
      <span><b>Term</b></span>
      <span>${data.term}</span>
    </div>

    <div class="row">
      <span><b>Amount Paid</b></span>
      <span>${data.amount.toLocaleString()} XAF</span>
    </div>

    <div class="row">
      <span><b>Payment Method</b></span>
      <span>${data.method}</span>
    </div>

    ${
      data.reference
        ? `<div class="row">
            <span><b>Reference</b></span>
            <span>${data.reference}</span>
          </div>`
        : ""
    }

    <div class="row">
      <span><b>Date</b></span>
      <span>${data.date}</span>
    </div>
  </div>

  <div class="footer">
    This receipt is system generated and valid without signature.
  </div>

</body>
</html>
`;
}
