// /src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend("re_jo8S9jVP_EPh9dZiEnaDi8GnvPqgZ9hZb");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use your verified domain
      to: ['aishna.bhatia.10@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .content { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0; color: #333;">New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${phone}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}