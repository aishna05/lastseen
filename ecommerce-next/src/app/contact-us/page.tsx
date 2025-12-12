// /src/app/contact-us/page.tsx
'use client';

import React, { useState } from 'react';

const ContactUsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <h1 className="contact-heading">Get In Touch</h1>
      <h2 className="contact-subheading">
        We're here to assist with any inquiry you may have.
      </h2>

      <div className="contact-grid">
        <section className="contact-form-section">
          <div className="card">
            <h3>Send Us a Message</h3>
            <p className="small mb-6">
              Fill out the form below and we will get back to you within 24 hours.
            </p>

            {submitStatus === 'success' && (
              <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
                Failed to send message. Please try again or email us directly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-field">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="contact-form-field">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="example@email.com" />
              </div>
              <div className="contact-form-field">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required placeholder="123-456-7890" />
              </div>
              <div className="contact-form-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required placeholder="Your inquiry..."></textarea>
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>

        <section className="contact-info-section">
          <div className="card">
            <h3>General Inquiries</h3>
            <p className="mt-2">
              Email: <br />
              <a href="mailto:support@lastseen.co.in">support@lastseen.co.in</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;