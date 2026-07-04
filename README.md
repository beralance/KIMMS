# KIMMS Furniture and Merchandise

A full-stack MERN capstone project developed in collaboration with Kimm's Furniture & Merchandise. The platform modernizes surplus retail by combining traditional e-commerce with a first-price sealed-bid auction system, providing a tailored solution for inventory, sales, and auction management.

Deployed Sample: *[https://kimms](https://kimms-py92r2rnb-self-studys-projects.vercel.app/)*

**Admin Dummy Account**
- username: *admin.kimms@2025*
- password: *Sample.admin.2502*

**Note**
- If manual sign-up/login does not work, use google instead
- This project is optimized for mobile view and may experience UI problems on desktop.
If using desktop, view using inpect for better experience.

---

## Overview

Kimms is a web-based e-commerce platform developed to help a local surplus furniture retailer transition from manual and social media-based selling into a centralized digital platform.

Unlike traditional online stores, surplus retailers manage mostly one-of-a-kind products with constantly changing inventory. The platform addresses this challenge by providing inventory management, online ordering, secure payments, and an integrated first-price sealed-bid auction for exclusive items.

The project was designed around the client's existing business workflow, allowing them to modernize operations without completely changing how they conduct business.

---

## The Problem 

Prior to the platform, the business relied heavily on Facebook Marketplace, Facebook Live Selling, Messenger conversations, and manual record keeping.

Although these tools enabled online selling, they created operational inefficiencies as the business expanded.

Some of the major challenges included:

- Manual inventory tracking that increased the risk of duplicate sales.
- Product availability updates that required repetitive manual work.
- Customer inquiries handled entirely through Messenger.
- Reservation tracking without centralized records.
- Auction events managed manually during live selling.
- Business information scattered across multiple platforms.

These limitations highlighted the need for a dedicated system capable of centralizing inventory, customer interactions, sales, and auction management.

---

## Solution
The platform centralizes the entire sales process into a single application by providing:

- Product and inventory management
- Customer accounts with Google Authentication
- Shopping cart and checkout
- Secure online payments via PayMongo
- Order management and tracking
- First-price sealed-bid auction system
- Real-time auction updates
- QR-based inventory identification
- Administrative dashboard
- Role-based access control

The result is a workflow that significantly reduces manual administrative work while improving customer experience.

---

## Technical Highlights

### Sealed-Bid Auction Engine

Designed and implemented a first-price sealed-bid auction where participant bids remain confidential until the auction concludes, ensuring fairness while preventing bid sniping.

### Automated Auction Decision Engine

Designed an automated auction fulfillment workflow that evaluates auction results after closing and progresses through a predefined winner hierarchy. The system automatically offers the item to the highest bidder, falls back to the second and third eligible bidders if necessary, and finally returns the item to the inventory if no winner successfully completes the purchase. 

### Unified Product Publishing Workflow

Designed a product management workflow where inventory items can be published directly as standard e-commerce listings with minimal additional configuration. This reduces duplicate data entry and allows administrators to quickly transition products from inventory to customer-facing listings.

### Shipping Calculation

Implemented a shipping engine that dynamically calculates available delivery options based on product characteristics, customer location, and business-specific logistics rules.

## QR-Based Product Identification

Designed a QR-based product identification system that automatically generates a printable QR code whenever a new inventory item is created. Since every surplus item is unique, the QR code acts as a permanent identifier that can be attached to the physical product, allowing staff to instantly access its corresponding record within the system by simply scanning it.

### Inventory Designed for Unique Products

Unlike conventional e-commerce systems that assume multiple units of the same SKU, every inventory item is treated as an individual product with its own images, condition, pricing, and lifecycle.

### Real-Time Auction Updates

Implemented WebSocket communication to provide immediate auction events and notifications without relying on continuous polling.

### Secure Payment Integration

Integrated PayMongo to support secure online payments while keeping payment processing separate from business logic.

### Authentication & Authorization

Implemented secure authentication using Firebase Authentication with Google Sign-In while enforcing role-based authorization across administrative and customer workflows.

---

## My Role
I served as the full-stack developer for the project. From initial planning to deployment, I was responsible for transforming business requirements into a production-ready application while making architectural and engineering decisions that prioritized maintainability, scalability, and usability.

My work included:

- **System Design** — Planned the application's architecture, module organization, and overall technical direction.
- **UI/UX Implementation** — Developed responsive user interfaces and translated business workflows into intuitive user experiences.
- **Backend Engineering** — Built RESTful APIs, business logic, authentication, authorization, and server-side processes.
- **Database Design** — Modeled the application's data structures, relationships, and persistence layer.
- **Business Logic Engineering** — Designed and implemented the e-commerce, inventory, auction, payment, and order management workflows.
- **Third-Party Integration** — Integrated Firebase Authentication, PayMongo, and WebSocket-based real-time communication.
- **Testing & Quality Assurance** — Validated features, resolved bugs, and refined business logic through continuous testing.
- **Deployment & Maintenance** — Managed version control, deployment, and ongoing improvements throughout the development process.

---

## Engineering Decisions

### Business-Driven Design

Instead of adapting the client's workflow to fit existing software, the application was designed around the business's actual day-to-day operations.

### Separate Auction Domain

Rather than extending the normal checkout process, auctions were implemented as an independent domain with their own lifecycle, bidding rules, payment flow, and fulfillment process.

### Inventory as Individual Assets

Each product is treated as a unique inventory item instead of using quantity-based stock management, reflecting the realities of surplus retail.

### Real-Time Communication

WebSockets were selected over periodic polling to provide immediate auction updates while reducing unnecessary server requests.

### Modular Architecture

Features are organized into independent modules to improve maintainability, simplify debugging, and support future scalability.

---

## Features

- Product browsing with categories and searchable listings
- Shopping cart and checkout workflow
- Auction creation, bidding, and auction result tracking
- Inventory management for product stock and availability
- Order history and transaction tracking
- Staff access control and admin management features
- Real-time notifications and updates via WebSocket
- Email notifications for order and auction events
- Responsive UI with dashboards, charts, and carousels

---

## Tech Stack

Frontend
- *React* – User interface
- *Vite* – Build tool and development server
- *Material UI (MUI)* – Component library
- *React Router* – Client-side routing
- *Axios* – HTTP client
- *Formik & Yup* – Form handling and validation
- *Framer Motion* – Animations
- *Recharts* – Data visualization
- *Swiper* – Responsive carousels
- *Socket.IO Client* – Real-time communication
- *Firebase* – Authentication and cloud services
- *Day.js* – Date and time manipulation
- *Lucide React* – Icon library

Backend
- *Node.js*
- *Express.js* – REST API
- *MongoDB* – NoSQL database
- *Mongoose* – MongoDB ODM
- *Socket.IO* – Real-time communication
- *JWT (jsonwebtoken)* – Authentication
- *Bcrypt* – Password hashing
- *Multer* – File uploads
- *Nodemailer* – Email services
- *Node Cron* – Scheduled background tasks
- *Express Rate Limit* – API rate limiting
- *Validator.js* – Input validation
- *Supabase* – Cloud storage and backend services
- *Firebase* – Authentication and cloud integration

Development Tools
- *ESLint* – Code linting
- *Nodemon* – Automatic backend reloading
- *Git & GitHub* – Version control


## Note
This repository is intended solely for portfolio purposes. Certain implementation details, configuration files, credentials, and business-specific information have been omitted or modified to protect confidential data while preserving the project's technical architecture and engineering approach.
