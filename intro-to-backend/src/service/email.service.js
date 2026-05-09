import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});


export const sendReminderEmail = async (to, debtor, creditor, amount, groupName) => {

  const message = `
Hello,

Reminder: You owe ${creditor} ₹${amount} in the group "${groupName}".

Please settle the payment.

Thank you.
`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "Expense Payment Reminder",
    text: message
  });

};