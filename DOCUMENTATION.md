# Plaza OS - Complete Application Guide

Welcome to **Plaza OS**, a premium property and tenant management operating system designed for modern plazas. This guide explains how the application works, what to expect, and how to use its core features.

## 🏢 What is Plaza OS?
Plaza OS is a centralized web application that connects plaza administrators (landlords/managers) with their tenants. It handles rent collections, maintenance requests, plaza-wide announcements, and reminders in one sleek, unified interface.

The application is split into two portals:
1. **The Admin Portal:** For property managers to oversee everything.
2. **The Tenant Portal:** For shop owners/tenants to pay rent, report issues, and stay updated.

---

## 👨‍💼 Admin Portal (How to Use)

When you log in as an Admin, you have full control over the plaza.

### 1. Units & Tenants Management
- **Units:** You can create and manage physical units (e.g., "Shop 101", "Kiosk A"). You can see if a unit is vacant or occupied.
- **Tenants:** You can onboard new tenants and assign them to a unit. When a tenant is added, their account is created in the system.

### 2. Payments & Rent Collection
- The system integrates with **Paystack** to handle automated online payments.
- You can view a complete ledger of all payments made by tenants.
- You can manually record cash/transfer payments if a tenant pays outside the system.

### 3. Maintenance Requests
- Tenants will submit maintenance tickets (e.g., "Leaking pipe in Shop 101").
- You can view these tickets, update their status (Pending, In Progress, Resolved), and assign maintenance workers.

### 4. Announcements & Reminders
- **Announcements:** Broadcast messages to all tenants at once (e.g., "Plaza will be closed for sanitation on Saturday").
- **Reminders:** Set up automated or manual reminders for specific tenants regarding rent renewals or rule violations.

### 5. Calendar & Notifications
- Use the calendar to schedule plaza events, inspections, or maintenance days.
- Real-time notifications alert you when a tenant pays rent or submits a maintenance request.

---

## 🏪 Tenant Portal (What to Expect)

When a tenant logs in, they see a simplified, focused dashboard tailored to their specific shop.

### 1. Rent & Payments
- Tenants can see their outstanding balance and rent due dates.
- They can click **"Pay Now"** to securely pay their rent online via Paystack.

### 2. Maintenance
- Tenants can easily submit photos and descriptions of issues in their shop.
- They can track the status of their requests in real-time.

### 3. Staying Informed
- Important plaza announcements appear directly on their dashboard.
- They have a personal calendar for plaza-wide events and individual reminders.

---

## 🛠️ Technical Details & Security
- **Data Security:** All passwords are cryptographically hashed using bcrypt. JSON Web Tokens (JWT) are used for secure session management.
- **File Uploads:** Maintenance photos are securely hosted via Cloudinary.
- **Progressive Web App (PWA):** Both admins and tenants can install Plaza OS directly to their phone's home screen for a native app experience without visiting an App Store.

## 🚀 Q&A / Troubleshooting

**Q: I deployed the app but cannot log in.**
A: Ensure your `VITE_API_BASE_URL` in the frontend exactly matches your backend URL. Ensure your `CORS_ORIGIN` in the backend exactly matches your frontend URL. 

**Q: How do I create my first admin account?**
A: The system automatically bootstraps a default admin on the first boot using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

**Q: A tenant forgot their password.**
A: In a future update, admins will be able to trigger a password reset link. Currently, the tenant can use the "Forgot Password" flow if configured with Resend emails.
