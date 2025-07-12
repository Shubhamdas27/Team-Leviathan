import * as nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ReWear Platform" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || `<p>${options.text}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name: string, points: number) => ({
    subject: "Welcome to ReWear!",
    text: `Welcome ${name}! Your account has been created successfully. You've been awarded ${points} points to get started!`,
    html: `
      <h2>Welcome to ReWear, ${name}!</h2>
      <p>Your account has been created successfully.</p>
      <p>You've been awarded <strong>${points} points</strong> to get started!</p>
      <p>Start exploring and swapping sustainable fashion today!</p>
    `,
  }),

  swapRequest: (requesterName: string, itemTitle: string) => ({
    subject: "New Swap Request",
    text: `${requesterName} has requested to swap for your item "${itemTitle}". Check your dashboard to respond.`,
    html: `
      <h2>New Swap Request</h2>
      <p><strong>${requesterName}</strong> has requested to swap for your item "<strong>${itemTitle}</strong>".</p>
      <p>Check your dashboard to respond to this request.</p>
    `,
  }),

  swapAccepted: (ownerName: string, itemTitle: string) => ({
    subject: "Swap Request Accepted!",
    text: `Great news! ${ownerName} has accepted your swap request for "${itemTitle}".`,
    html: `
      <h2>Swap Request Accepted!</h2>
      <p>Great news! <strong>${ownerName}</strong> has accepted your swap request for "<strong>${itemTitle}</strong>".</p>
      <p>You can now coordinate the exchange through your dashboard.</p>
    `,
  }),

  swapRejected: (ownerName: string, itemTitle: string, reason?: string) => ({
    subject: "Swap Request Update",
    text: `${ownerName} has declined your swap request for "${itemTitle}".${
      reason ? ` Reason: ${reason}` : ""
    }`,
    html: `
      <h2>Swap Request Update</h2>
      <p><strong>${ownerName}</strong> has declined your swap request for "<strong>${itemTitle}</strong>".</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>Don't worry! There are many other great items available on the platform.</p>
    `,
  }),

  itemApproved: (itemTitle: string) => ({
    subject: "Item Approved!",
    text: `Your item "${itemTitle}" has been approved and is now live on the platform.`,
    html: `
      <h2>Item Approved!</h2>
      <p>Your item "<strong>${itemTitle}</strong>" has been approved and is now live on the platform.</p>
      <p>Other users can now discover and request swaps for your item!</p>
    `,
  }),

  itemRejected: (itemTitle: string, reason: string) => ({
    subject: "Item Review Update",
    text: `Your item "${itemTitle}" was not approved. Reason: ${reason}`,
    html: `
      <h2>Item Review Update</h2>
      <p>Your item "<strong>${itemTitle}</strong>" was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please review our guidelines and feel free to submit a new listing.</p>
    `,
  }),
};
