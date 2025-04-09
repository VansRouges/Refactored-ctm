import React from 'react';

interface SupportResponseTemplateProps {
  data?: {
    ticketNumber?: string;
    name?: string;
    ticketSubject?: string;
    responseDetails?: string;
  };
}

const SupportResponseTemplate: React.FC<SupportResponseTemplateProps> = ({ data = {} }) => {
  const {
    ticketNumber = '0000',
    name = 'Customer',
    ticketSubject = 'your inquiry',
    responseDetails = 'Our team has reviewed your request and is working on a solution.'
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
        Re: Support Ticket #{ticketNumber}
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
        Thank you for contacting our support team. We're writing in response to your support ticket #{ticketNumber} regarding {ticketSubject}.
      </p>

      <p style={{
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        {responseDetails}
      </p>

      <p style={{
        color: '#555',
        margin: '0 0 16px 0'
      }}>
        If you have any further questions, please don't hesitate to reply to this email.
      </p>

      <p style={{
        color: '#555',
        marginTop: '30px'
      }}>
        Best regards,<br />
        The Support Team
      </p>
    </div>
  );
};

export default SupportResponseTemplate;