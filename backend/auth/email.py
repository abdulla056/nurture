import smtplib
from email.message import EmailMessage
from flask import jsonify
from config import Config

app_password = Config.APP_PASSWORD
gmail = Config.GMAIL
def sendMessage(recipient_email, recipient, mfa_code):
    try:
        altbody = f"""
        <div dir=3D"ltr">
            <p><strong>Dear {recipient},</strong></p>
            <p>Your Multi-Factor Authentication (MFA) code is:</p>
            <p>&#128273; <strong>{mfa_code}</strong></p>
            <p>For security reasons, this code will expire in <b>5</b><strong> minutes</strong>. Please do not share this code with anyone.</p>
            <p>If you did not request this code, please contact our support team immediately at <strong><a rel=3D"noopener">nurture@gmail.com</a></strong> or call <b>+62 818-0275-2930</b>.</p>
            <p>
                <strong>Stay healthy,</strong>
                <br>
                <strong>Nurture Team </strong>
                <br>
                <b><a href=3D"http://www.nurture.com">www.nurture.com</a> (fake)</b>
            </p>
        </div>
        """
        msg = EmailMessage()
        msg['Subject'] = 'Your multi-factor authentication code for Nurture:'
        msg['From'] = gmail
        print(recipient_email)
        msg['To'] = "zhehin.shine@gmail.com"
        msg.preamble = 'You will not see this in a MIME-aware mail reader.\n'
        msg.add_header('Content-Type', 'text/html')
        msg.set_content(altbody, subtype = 'html')
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(gmail, app_password)
            s.send_message(msg)

        return jsonify({'message' : "Email sent successfully"}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'error' : 'An error has occurred.'}), 500