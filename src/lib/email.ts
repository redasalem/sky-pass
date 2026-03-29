import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface BookingEmailParams {
  to: string;
  passengerName: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  passengers: number;
  bookingReference: string;
}

export async function sendBookingConfirmation({
  to,
  passengerName,
  flightNumber,
  route,
  departureTime,
  passengers,
  bookingReference,
}: BookingEmailParams) {
  if (!resend) {
    return null;
  }

  // Implement a small retry with exponential backoff for transient errors
  let lastError: unknown;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Sky-Pass <noreply@skypass.com>",
        to: [to],
        subject: "Your Sky-Pass booking is confirmed",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px;margin:0 auto;background:#ffffff;">
          <!-- Header -->
          <tr>
            <td style="background:#C10016;padding:30px 40px;">
              <h1 style="margin:0;color:#fff;font-size:24px;">Sky-Pass</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1E1E1E;font-size:22px;">
                Booking Confirmed!
              </h2>
              <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.6;">
                Hi ${passengerName},<br/><br/>
                Your flight has been booked successfully. Here are your details:
              </p>

              <!-- Booking Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f9f9f9;border-radius:12px;padding:24px;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 24px;">
                     <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Booking Reference</p>
                     <p style="margin:4px 0 0;color:#1E1E1E;font-size:16px;font-weight:bold;">
                       ${bookingReference}
                     </p>
                   </td>
                 </tr>
                 <tr>
                   <td style="padding:12px 24px;">
                     <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Flight</p>
                     <p style="margin:4px 0 0;color:#1E1E1E;font-size:16px;font-weight:bold;">
                       ${flightNumber}
                     </p>
                   </td>
                 </tr>
                 <tr>
                   <td style="padding:12px 24px;">
                     <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Route</p>
                     <p style="margin:4px 0 0;color:#1E1E1E;font-size:16px;font-weight:bold;">
                       ${route}
                     </p>
                   </td>
                 </tr>
                 <tr>
                   <td style="padding:12px 24px;">
                     <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Departure</p>
                     <p style="margin:4px 0 0;color:#1E1E1E;font-size:16px;font-weight:bold;">
                       ${departureTime}
                     </p>
                   </td>
                 </tr>
                <tr>
                  <td style="padding:12px 24px;">
                    <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Passengers</p>
                    <p style="margin:4px 0 0;color:#1E1E1E;font-size:16px;font-weight:bold;">
                      ${passengers}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px;">
                    <p style="margin:0;color:#999;font-size:12px;text-transform:uppercase;">Status</p>
                    <p style="margin:4px 0 0;color:#22c55e;font-size:16px;font-weight:bold;">
                      Confirmed ✓
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#666;font-size:14px;line-height:1.6;">
                Check in online 24 hours before departure.<br/>
                Thank you for flying with Sky-Pass!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1E1E1E;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#999;font-size:12px;">
                © ${new Date().getFullYear()} Sky-Pass. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

      if (error) throw error;
      return data;
    } catch (err) {
      lastError = err;
      // exponential backoff before retrying
      if (attempt < maxAttempts) {
        const wait = 100 * Math.pow(2, attempt - 1);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      throw lastError;
    }
  }
}
