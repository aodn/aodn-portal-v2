/** Shared SES request preparation; this module never sends email. */
export interface SesEmailContent {
  recipients: { name: string; address: string }[];
  subject: string;
  text: string;
  html: string;
}

const validateAddress = (address: string) => {
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(address)) {
    throw new Error("Email configuration requires valid plain email addresses");
  }
  return address;
};

/** Delivery requires an explicit override; never silently email the QA list. */
export const parseEmailRecipients = (configuration: string) => {
  const addresses = configuration
    .split(/[,;\n]/)
    .map((value) => value.trim())
    .filter(Boolean);
  if (!addresses.length) throw new Error("LH_EMAIL_RECIPIENTS is required");
  return [
    ...new Set(
      addresses.map((address) => validateAddress(address).toLowerCase())
    ),
  ].map((address) => ({ name: address, address }));
};

/** AWS CLI SES SendEmail input. Generating this payload never sends an email. */
export const buildSesEmailPayload = (
  email: SesEmailContent,
  sender: string
) => {
  const Source = validateAddress(sender.trim());
  if (!email.recipients.length)
    throw new Error("At least one email recipient is required");
  return {
    Source,
    Destination: {
      ToAddresses: email.recipients.map(({ address }) =>
        validateAddress(address)
      ),
    },
    Message: {
      Subject: { Data: email.subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: email.text, Charset: "UTF-8" },
        Html: { Data: email.html, Charset: "UTF-8" },
      },
    },
  };
};
