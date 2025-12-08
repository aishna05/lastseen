// /src/app/contact-us/page.tsx
import React from 'react';

export const metadata = {
  title: 'Contact Us | Lost Seeker',
  description: 'Get in touch with the Lost Seeker team for support, partnerships, or inquiries.',
};

const ContactUsPage = () => {
  return (
    <div className="contact-page-wrapper">
      
      {/* HEADINGS */}
      <h1 className="contact-heading">Get In Touch</h1>
      <h2 className="contact-subheading">
        We're here to assist with any inquiry you may have.
      </h2>

      <div className="contact-grid">
        
        {/* LEFT COLUMN - CONTACT FORM */}
        <section className="contact-form-section">
          <div className="card">
            <h3>Send Us a Message</h3>
            {/* Replaced inline style with the existing 'small' tag which uses --text-muted */}
            <p className="small mb-6">             Fill out the form below and we will get back to you within 24 hours.
            </p>
           
           {/* --- Basic Contact Form Structure --- */}
           <form className="contact-form">
         <div className="contact-form-field">      {/* Replaced Tailwind classes with dedicated class */}
         <label htmlFor="name">Your Name</label> 
         {/* Note: Input styling is handled by global input selector */}
         <input type="text" id="name" required placeholder="John Doe" /> 
         </div>
         <div className="contact-form-field">
         <label htmlFor="email">Email Address</label>
         <input type="email" id="email" required placeholder="example@email.com" />
         </div>
         <div className="contact-form-field">
          <label htmlFor="message">Message</label>
         <textarea id="message" rows={5} required placeholder="Your inquiry..."></textarea>
         </div>
         <button type="submit" className="btn-primary">
          Send Message
         </button>
        </form>  {/* ------------------------------------ */}

 </div>
 </section>

 {/* RIGHT COLUMN - INFO BOXES */}
<section className="contact-info-section">
 {/* Removed redundant p-6, as .card now has appropriate padding */}
 <div className="card"> 
<h3>General Inquiries</h3>
<p className="mt-2">
 Email: <br />
 {/* Removed inline style, global <a> styling handles color */}
<a href="mailto:support@lostseeker.com">support@lostseeker.com</a> 
</p>
 </div>
 <div className="card">
   <h3>Seller Support</h3>
   <p className="mt-2">
     Email: <br /> <a href="mailto:seller@lostseeker.com">seller@lostseeker.com</a>
</p>
{/* Used global 'small' class for consistency */}
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