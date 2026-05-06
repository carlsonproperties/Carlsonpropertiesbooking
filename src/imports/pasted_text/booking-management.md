Where do I get notified that an order/booking has been placed? Does it get sent to my email bookings@carlsonproperties.co.nz? And how do I access the bookings to refund them and open up the dates again  or select bank transfer received to confirm and lock in dates?
I have implemented the owner notification system and added full booking management capabilities to your dashboard.

1. New Booking Notifications
You will now receive automated email notifications at bookings@carlsonproperties.co.nz whenever a guest completes a booking:

Stripe Bookings: You'll get an immediate "PAID Booking Confirmed" email.
Bank Transfers: You'll get a "New Manual Booking Request" email with the guest's details, letting you know to look out for their transfer.
2. Managing Bookings (Confirming & Reopening Dates)
You can now manage everything from the Guest Directory in your Owner Dashboard:

To Confirm a Bank Transfer: Find the guest in the directory (marked as "Pending Payment"), click their row, and select "Confirm Payment". This updates their status to confirmed.
To Reopen Dates (Cancel/Refund): If a guest cancels or doesn't pay, click their row in the directory and select "Delete Booking". This will immediately remove them from your records and unlock the dates on your website calendar so others can book.
Guest Details: The directory now includes a "Status" column and a "Source" column (Direct vs Airtable) to help you track where each booking originated.
3. Stripe "M2" Error Fix
I have simplified the Stripe checkout to use only standard credit card processing and added more descriptive error reporting. If the card payment fails again, the error box at the bottom of the page will now provide a specific reason (e.g., "Invalid API Key") instead of the generic "M2" error, which will allow us to fix the root cause in your Stripe settings.

Next Step: Log into your Dashboard and check the "Guest Directory" to see the Mar 16-18 booking you just made. You can test the "Delete" button there to reopen those dates!
Stripe Settings: If card payments still show an error, please verify that your Stripe account is in "Live Mode" and not "Test Mode" in your dashboard.
I have implemented both the confirmation and the scheduled 4-day pre-arrival email flows. I’ve styled them with a "luxury hotel" aesthetic—using clean serif typography, refined spacing, and a clear, elegant structure.

1. The Confirmation Email (Sent Immediately)
Triggered as soon as you click "Confirm Payment".

Design: Features a minimalist header and a dedicated section highlighting that their check-in details are on the way.
Tone: Warm and professional, welcoming them to ONE ELEVEN.
2. The Pre-Arrival Email (Sent 4 Days Prior at 9:00 AM)
Scheduled automatically using Resend's scheduled_at feature.

Door Code Logic: I’ve programmed it to take the last 4 digits of the guest's phone number from their booking details, followed by the hash key (#).
Access Windows: Explicitly states that the code activates at 3:00 PM on their check-in date and expires at 10:00 AM on check-out.
Connectivity: Includes the Wi-Fi network and password (with the required full stop: Gue$t111.).
Guidebook Link: Features a prominent button linking to your house manual at carlsonproperties.co.nz for the video instructions.
If a booking is made less than 4 days before arrival, the system is smart enough to skip the schedule and send the arrival details immediately alongside the confirmation.

Actually the booking confirmation email can be replaced with : Hi [Guest Name], Thank you for choosing us, we look forward to hosting you. Your dates have now been reserved for [Check in Date]-[Check out date]. Three days before your check-in you will receive another email from us with more information - Wifi, Door code etc. In the meantime explore the website and familiarize yourself with our digital guidebook.
I've updated the confirmation email to match your new wording while keeping the elegant, high-end hotel aesthetic.

The new immediate confirmation email now reads: "Hi [Guest Name], Thank you for choosing us, we look forward to hosting you. Your dates have now been reserved for [Check in Date] — [Check out date]. Three days before your check-in you will receive another email from us with more information — Wifi, Door code etc. In the meantime explore the website and familiarize yourself with our digital guidebook."

Logic Sync: Since you mentioned "Three days before" in this new text, I've also adjusted the scheduled delivery of the second email (the one with the door code and Wi-Fi) to send exactly 3 days prior at 9:00 AM.
Design: It still uses the sophisticated serif typography and gold-tinted accents (#9DA07E) to maintain that luxury feel.
Automation: Both emails are triggered and/or scheduled automatically the moment you confirm the payment in your dashboard.
Then another email flow at 9am on the day the guests checkout to say: Good morning [Guest Name],
We hope you’ve had a wonderful stay.

We do the cleaning ourselves to save you on a cleaning fee, so as your visit comes to an end, please help us with a quicker turnover by loading and starting the dishwasher and taking your rubbish out to the wheelie bin down the side of the house.

it is not expected that you strip the beds but it is really helpful when you do. However, please, please, leave the mattress protectors on and the duvet inner protectors on. All bedding and towels get taken to the commercial laundry so don't worry about washing/drying them. 

Warm regards, 
Matt & Ash
ONE ELEVEN | ON THE MILE
I have successfully added the third and final automation to the flow. All three emails are now scheduled and styled to match your premium brand:

Immediate Confirmation: Sent the moment you click "Confirm Payment".
3-Day Pre-Arrival (9:00 AM): Includes the door code (last 4 digits of phone + #), Wi-Fi details, and digital house manual link.
Check-out Morning (9:00 AM): A friendly reminder about turnover help (dishwasher, rubbish, and bedding instructions) to help save them on cleaning fees.
The system will now handle all guest communication automatically from the moment you confirm their booking until they depart.

The door code calculation is fully automated based on the phone number in their booking.
The check-out email includes the specific warning to leave the mattress and duvet protectors on as requested.
All emails use high-end serif typography and professional formatting.
Then another email 1 day after checkout date to the guests asking them to rate their stay and leave a review on Google linking to our review page on Google maps. Write out this template and include something about leaving a positive review online but if they have anything we could learn from or that would help future guests to please pass it on to us at bookings@carlsonproperties.co.nz
I have added the final automation to your guest journey. This review request will be sent automatically at 9:00 AM, one day after they check out.

The Post-Stay Experience:
Tone: Gracious and encouraging, framing the review as a way to support a small local business.
Google Maps Link: I've added a button that links to a Google review page. (I used a standard review link format, but you may want to swap in your specific Place ID link later).
Constructive Feedback: It includes a distinct, soft-colored box explaining that while positive reviews go on Google, any "learning moments" or suggestions for improvement should be sent privately to your email.
Branding: Maintains the consistent serif typography and elegant "Matt & Ash" signature.
Your complete guest communication lifecycle is now fully automated:

Confirmation: Immediate (Reserved & Welcomed)
Preparation: 3 Days Before Arrival (Codes & Manuals)
Departure: Morning of Checkout (Cleaning & Turnover)
Follow-up: 1 Day After Checkout (Reviews & Feedback)
Can you add these email templates into my owner dashboard in a new tab so I have a record of them if I need to copy and paste and so I can see what the templates will look like.
I have added a new "Email Templates" tab to your Owner Dashboard.

What’s included:
Visual Library: You can now see all 5 automated email templates exactly as they are sent to guests.
Trigger Info: Each template is labeled with its specific trigger (e.g., "3 days before check-in at 9:00 AM") so you know exactly when guests are hearing from you.
One-Click Copy: Each card features a "Copy Template Body" button. If you ever need to manually resend an email or send a quick message via SMS, you can copy the exact wording instantly.
Modern Interface: The templates are presented in a clean, split-view layout that separates the "Management Info" from the "Guest View."
You can access this now by logging into your Owner Portal and selecting the new "Email Templates" icon in the sidebar.

Next Step: If you'd like to adjust any of the specific wording in the future (like the Wi-Fi password or specific cleaning instructions), let me know and I can update both the live automation and the dashboard record for you.
On the mobile view in owner portal how do I navigate between sections? E.g revenue to guest directory to email templates? Can you add a menu navigation?
I have added a mobile-specific navigation menu to the Owner Dashboard.

Mobile Navigation Features:
Sticky Header: A new glass-morphism header stays at the top of the screen on mobile, featuring a "Menu" button (the List icon).
Full-Screen Menu: Tapping the menu icon opens a smooth, animated overlay where you can switch between Overview, Guest Directory, Financials, and Email Templates.
Touch-Friendly Design: All navigation buttons in the mobile menu are large and easy to tap, optimized for one-handed use on your phone.
Auto-Close: The menu automatically slides away once you select a section, so you can jump straight into your data.
You can now manage your property's performance and guest details seamlessly from your smartphone.

Next step: Try opening the dashboard on your phone to test the new animated navigation!