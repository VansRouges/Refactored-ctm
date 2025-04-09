import React from 'react';

interface WelcomeTemplateProps {
  data?: {
    name?: string;
    // Add other expected props here if needed
  };
}

const WelcomeTemplate: React.FC<WelcomeTemplateProps> = ({ data = {} }) => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      color: '#333'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        color: 'inherit'
      }}>
        Welcome to Our Platform!
      </h1>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6',
        margin: '0 0 16px 0'
      }}>
        Dear {data.name || 'Customer'},
      </p>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6',
        margin: '0 0 16px 0'
      }}>
        Thank you for joining our platform! We're excited to have you on board.
      </p>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6',
        margin: '0 0 16px 0'
      }}>
        Here are a few things you can do to get started:
      </p>
      
      <ul style={{ 
        color: '#555', 
        lineHeight: '1.6', 
        paddingLeft: '20px',
        margin: '0 0 16px 0'
      }}>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Connect with other users</li>
      </ul>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6',
        margin: '0 0 16px 0'
      }}>
        If you have any questions, feel free to reach out to our support team.
      </p>
      
      <p style={{ 
        color: '#555', 
        lineHeight: '1.6', 
        marginTop: '30px'
      }}>
        Best regards,<br />
        The Team
      </p>
    </div>
  );
};

export default WelcomeTemplate;