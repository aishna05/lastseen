// /src/app/contact-us/page.tsx
import React from 'react';

export const metadata = {
  title: 'Contact Us | Lost Seeker',
  description: 'Get in touch with the Lost Seeker team for support, partnerships, or inquiries.',
};

const ContactUsPage = () => {
  return (
    <div className="py-12 md:py-16">
      <h1 className="text-4xl mb-4">Get In Touch</h1>
      <h2 className="text-xl mb-10" style={{color: 'var(--text-muted)'}}>
        We're here to assist with any inquiry you may have.
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        <section className="md:col-span-2">
          <div className="card">
            <h3>Send Us a Message</h3>
            <p className="mb-6" style={{color: 'var(--text-muted)'}}>
              Fill out the form below and we will get back to you within 24 hours.
            </p>
            
            {/* --- Basic Contact Form Structure --- */}
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
                <input type="text" id="name" required placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
                <input type="email" id="email" required placeholder="example@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Message</label>
                <textarea id="message" rows={5} required placeholder="Your inquiry..."></textarea>
              </div>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
            {/* ------------------------------------ */}

          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <h3>General Inquiries</h3>
            <p className="mt-2">
              **Email:** <br />
              <a href="mailto:support@lostseeker.com" style={{color: 'var(--primary)'}}>support@lostseeker.com</a>
            </p>
          </div>
          <div className="card p-6">
            <h3>Seller Support</h3>
            <p className="mt-2">
              **Email:** <br />
              <a href="mailto:seller@lostseeker.com" style={{color: 'var(--primary)'}}>seller@lostseeker.com</a>
            </p>
            <p className="small mt-2">
              For questions regarding listing, payments, and platform tools.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;