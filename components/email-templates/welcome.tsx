export default function Welcome({ name, password }: { name: string; password: string }) {
// This component is a simple welcome email template that uses inline styles for better compatibility with email clients.
// It accepts a name and password as props to personalize the email content.
    const brandColor = "rgb(240, 5.9%, 10%)";
  
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.7",
          color: "#333",
          padding: "32px",
          maxWidth: "620px",
          margin: "0 auto",
          backgroundColor: brandColor,
          borderRadius: "10px",
          border: "1px solid #333",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Welcome Back, {name} 👋
        </h2>
  
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          We&#39;ve rebuilt and redesigned <strong>CopyTradingMarkets</strong> to make your investing experience smoother, smarter, and more secure.
        </p>
  
        <p style={{ fontSize: "16px", marginBottom: "16px" }}>
          To continue using our platform, kindly sign in with the password below and update your password once logged in:
        </p>
  
        <p
          style={{
            fontSize: "16px",
            padding: "12px 16px",
            backgroundColor: "#000",
            borderRadius: "6px",
            display: "inline-block",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "0.5px",
          }}
        >
          Password: {password}
        </p>
  
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Once you&#39;re in, we&#39;d love for you to explore the new and improved features:
        </p>
        <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
          <li>📈 Copy strategies from top traders</li>
          <li>💼 Buy and manage stock options with ease</li>
          <li>📝 Share feedback to help us grow better for you</li>
        </ul>
  
        <a
          href="https://www.copytradingmarkets.com"
          target="_blank"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: "#fff",
            color: brandColor,
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Visit Our New Platform 🚀
        </a>
  
        <p style={{ fontSize: "14px", color: "#aaa" }}>
          Need help? Reach out to our support team anytime — we&#39;re here for you.
        </p>
  
        <p style={{ fontSize: "16px", marginTop: "24px" }}>
          Cheers,<br />
          <strong>The CopyTradingMarkets Team</strong>
        </p>
      </div>
    );
  }
  