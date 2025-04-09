import React from 'react';

interface PaymentConfirmationTemplateProps {
  data?: {
    invoiceNumber?: string;
    name?: string;
    amount?: string;
    date?: string;
    paymentMethod?: string;
  };
}

const PaymentConfirmationTemplate: React.FC<PaymentConfirmationTemplateProps> = ({ data = {} }) => {
  const {
    invoiceNumber = '0000',
    name = 'Customer',
    amount = '$0.00',
    date = 'the specified date',
    paymentMethod = 'N/A'
  } = data;

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      color: '#333',
      lineHeight: '1.6'
    }}>
      <h1 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: 'inherit'
      }}>
        Payment Confirmation - Invoice #{invoiceNumber}
      </h1>

      <p style={{ 
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        Dear {name},
      </p>

      <p style={{
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        Thank you for your payment of {amount} on {date}.
      </p>

      <p style={{
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        Invoice Details:
      </p>

      <ul style={{
        color: '#555',
        paddingLeft: '20px',
        margin: '0 0 16px 0'
      }}>
        <li>Invoice Number: {invoiceNumber}</li>
        <li>Date: {date}</li>
        <li>Amount: {amount}</li>
        <li>Payment Method: {paymentMethod}</li>
      </ul>

      <p style={{
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        You can view and download your invoice by logging into your account.
      </p>

      <p style={{
        color: '#555',
        margin: '30px 0 16px 0'
      }}>
        Thank you for your business!
      </p>

      <p style={{
        color: '#555',
        margin: '0'
      }}>
        Best regards,<br />
        The Billing Team
      </p>
    </div>
  );
};

export default PaymentConfirmationTemplate;