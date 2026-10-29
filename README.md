# RentHub - Apartment Rental Platform

> **Nagarro Angular Assignment (Level 1)**  
> Built with **Angular 22 (Latest Release)**, **TypeScript**, **Bootstrap 5**, and **Vitest**.

RentHub is a modern, comprehensive web platform that bridges prospective renters and landlords seamlessly. Landlords can create and manage detailed apartment listings, renters can discover and shortlist properties, express interest via direct inquiries, and both parties can engage in transparent discussions with nested replies.

---

## 📌 Deliverable Links & User Credentials

| Deliverable | Details |
| :--- | :--- |
| **GitHub Repository** | `https://github.com/<your-username>/renthub` *(Replace with your GitHub repository link)* |
| **Live Deployed App** | `https://renthub-app.vercel.app` *(Deployable in 1 click to Vercel/Netlify; see Deployment section)* |

### 🔑 Demo User Credentials (Pre-seeded & Ready for Evaluation)

The application comes pre-loaded with mock accounts in `localStorage`:

| Role | Email | Password | Pre-seeded Permissions & Content |
| :--- | :--- | :--- | :--- |
| **Landlord** | `landlord@renthub.com` | `Password123!` | Has active listings, can post apartments, reply to comments, view inquiries received |
| **Prospective Renter** | `renter@renthub.com` | `Password123!` | Can favorite listings, send inquiries, comment on listings |
| **Dual Role (Both)** | `priya@renthub.com` | `Password123!` | Has landlord villa listing, can submit inquiries and comments |

> *Tip: On the Login screen, click the **"Landlord Demo"** or **"Renter Demo"** quick-fill buttons for instant one-click login!*

---

## 🌟 Key Features & Requirements Matrix

All requirements specified in the assignment PDF have been comprehensively implemented:

### 1. User Registration & Authentication (Wireframe Page 4)
- Secure registration with validation for **Name, Email, Role, Phone, Password, and Password Confirmation**.
- Login form with validation, error feedback, and session persistence in `localStorage`.
- Current user profile menu with avatar initials, role badge, quick stats, and logout functionality.
- **Auth Guard (`AuthGuard`)** protecting sensitive routes (`/create-post`, `/preview-post`, `/inquiries`, `/profile`). Unauthenticated access redirects to `/login` with `returnUrl`.

### 2. Apartment Listings Management (Wireframe Page 5)
- **Reactive Forms (`FormGroup`)** with comprehensive validation rules (`required`, `minLength`, `min`, `max`, `email`, `pattern`).
- **Choose Apartment / Building**: Property type dropdown (`Apartment`, `Independent House`, `Villa`, `Studio`, `Penthouse`) and Society/Building name.
- **Shared Property Radio**: Yes (Shared unit/room) / No (Entire apartment).
- **Property Location**: Street Address, City, State, Zip Code.
- **Property Details**: Square Feet, Bedrooms (1-4+), Bathrooms, Stay/Lease type (`Long term (6+ months)`, `Short term`, `Both`).
- **Expected Rent**: Rent amount, Negotiable toggle, Price Mode (`Per Month` or `Utilities included in rent`).
- **Furnished Status**: Radio buttons (`Yes` / `No`).
- **Vegetarian Preference**: Radio buttons (`Any`, `Vegetarian Only`, `Non-Vegetarian`).
- **Amenities Checklist**: All 12 wireframe amenities (`Gym/Fitness Center`, `Swimming Pool`, `Car Park`, `Visitors Parking`, `Power Backup`, `Garbage Disposal`, `Private Lawn`, `Water Heater`, `Plant Security System`, `Laundry Service`, `Elevator`, `Club House`).
- **Description & AD Title**: AD Title and detailed description up to 1400 characters with **real-time character counter**.
- **Photos Gallery**: Select from curated sample photos or add custom image URLs.
- **Quick Fill Demo Button**: One-click button in the form for fast evaluator testing.

### 3. ⭐ Bonus Feature: Preview & Submit Screen (Wireframe Page 6)
- Fully implements the wireframe bonus requirement!
- Prior to final submission, users are directed to the **Preview and Submit Screen** (`/preview-post`).
- Clean summary layout showcasing Property Type, Beds/Baths, Address, Rent & Mode, Description, Amenities tags, and Photo gallery.
- **"Edit Post Information"** button safely returns to the form with all input preserved.
- **"Confirm and Submit Listing"** publishes the apartment and navigates directly to the live listing page.

### 4. Home Screen with Featured Carousel & Pagination (Wireframe Page 2 & 3)
- **Top Featured Carousel**:
  - Highlights featured apartments.
  - Image slider with left/right `<` `>` navigation arrows, slide indicators, and auto-play with pause on hover.
  - Side info panel matching wireframe with Title, Price, Specs, Description snippet, and quick actions: **"View Details"** and **"Mark as Favorite"**.
- **Search & Multi-Facet Filtering**:
  - Live search input matching title, building, city, address, description.
  - Property Type filter.
  - Stay/Lease Type filter.
  - Price range inputs (Min & Max).
  - Furnished status filter.
  - Vegetarian preference filter.
  - Amenities multi-select filter pills.
  - Sort by: Most Recent, Price: Low to High, Price: High to Low, Largest Sq Ft.
  - Active filter counter and one-click "Reset All" button.
- **3-Column All Listings Grid (Wireframe Page 3)**:
  - Responsive cards with photo, badges, title, address, specs, price tag, and description snippet.
  - Quick action buttons on every card: **"View Details"** and **"Mark as Favorite"**.
- **Pagination**:
  - Configurable items per page (3, 6, 9) with Previous, Page numbers, and Next controls.

### 5. Interest Expression (Wireframe Page 2)
- **Mark as Favorite**: Toggle favorite on any apartment card or detail page. Heart icon changes state dynamically; badge count updates in navbar; dedicated **"Saved Favorites"** page (`/favorites`).
- **Send Direct Inquiries**: "Send Direct Inquiry" modal on listing detail page allows prospective renters to message landlords with contact info and preferred move-in date.
- **Inquiries Dashboard (`/inquiries`)**: Tabbed view for **Received Inquiries** (landlords) and **Sent Inquiries** (renters).

### 6. Interactive Comments & Nested Replies (Wireframe Page 6)
- Dedicated discussion section on every listing.
- View comments with author name, role badge, timestamp, and message.
- **Nested Replies**: Users and landlords can click "Reply" to post nested responses directly under any comment.
- Comment authors can delete their own comments.

---

## 🧪 Unit Testing (Component, Service, Module)

As required by the deliverables, automated unit tests are written for **components**, **services**, and **modules**:

```bash
npm run test:ci
```

### Test Suite Summary (25 Tests Passing):
1. **Module Unit Tests (`src/app/app.module.spec.ts`)**:
   - `should create the AppModule instance`
   - `should compile the module without errors`
2. **Service Unit Tests (`src/app/services/listing.service.spec.ts` & `auth.service.spec.ts`)**:
   - `ListingService`: creation, fetching seeded listings, filtering featured, get by ID, adding listing with persistence, deleting listing, draft post buffering.
   - `AuthService`: creation, default account initialization, valid login, invalid credentials rejection, registration, session persistence, logout.
3. **Component Unit Tests (`home.component.spec.ts`, `create-post.component.spec.ts`, `app.component.spec.ts`)**:
   - `HomeComponent`: creation, carousel navigation (next/prev slides), search query filtering, property type filtering, reset filters.
   - `CreatePostComponent`: form initialization, required field validations, demo data prefill, draft post creation, navigation to preview screen.
   - `App`: root component creation and routing integration.

---

## 🛠️ Project Structure

```
renthub/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/              # Login & Register components (Wireframe Page 4)
│   │   │   ├── create-post/       # Create New Post reactive form (Wireframe Page 5)
│   │   │   ├── favorites/         # Saved Favorites page
│   │   │   ├── footer/            # Footer layout
│   │   │   ├── home/              # Hero Carousel + Filters + 3-col Grid (Wireframe Page 3)
│   │   │   ├── inquiries/         # Direct Inquiries management
│   │   │   ├── listing-detail/    # Detail page + Nested Comments (Wireframe Page 6)
│   │   │   ├── navbar/            # Responsive navigation & user menu
│   │   │   ├── not-found/         # 404 handler
│   │   │   ├── preview-post/      # Bonus Preview & Submit screen (Wireframe Page 6)
│   │   │   ├── profile/           # User dashboard & published posts
│   │   │   └── toast/             # Reactive toast notification alerts
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # CanActivate Auth Guard
│   │   ├── models/
│   │   │   ├── apartment.model.ts # Listing interfaces & amenities constants
│   │   │   ├── comment.model.ts   # Comments & nested replies interface
│   │   │   ├── inquiry.model.ts   # Direct inquiry model
│   │   │   └── user.model.ts      # User and auth models
│   │   ├── services/
│   │   │   ├── auth.service.ts    # User auth, registration & session state
│   │   │   ├── comment.service.ts # Discussion threads & replies
│   │   │   ├── favorites.service.ts # LocalStorage favorite persistence
│   │   │   ├── inquiry.service.ts # Landlord inquiry messenger
│   │   │   ├── listing.service.ts # Apartment CRUD & draft preview buffer
│   │   │   └── toast.service.ts   # Real-time alert notifications
│   │   ├── app.component.*
│   │   ├── app.module.ts          # Root NgModule
│   │   └── app-routing.module.ts  # Route definitions & guards
│   ├── styles.scss                # Bootstrap 5 & custom theme styling
│   └── index.html
├── angular.json
├── package.json
├── vercel.json                    # SPA routing rewrite for Vercel
└── README.md
```

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/renthub.git
   cd renthub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm start
   # or
   ng serve
   ```
   Open `http://localhost:4200` in your browser.

4. **Run Unit Tests**:
   ```bash
   npm run test:ci
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled bundle will be generated in `dist/renthub`.

---

## 🌐 Deploying to Free Hosting (Vercel / Netlify)

### Option A: Vercel (Recommended - 1 Click)
1. Push the code to a GitHub repository (ensure `node_modules` is excluded via `.gitignore`).
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `renthub` repository.
4. Framework Preset: **Angular**.
5. Build Command: `npm run build`
6. Output Directory: `dist/renthub/browser` (or `dist/renthub`)
7. Click **Deploy**. The included `vercel.json` ensures full SPA routing!

### Option B: Netlify
1. Log into [Netlify](https://www.netlify.com/) and choose **"Import from Git"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist/renthub/browser` (or `dist/renthub`)
5. The included `public/_redirects` file automatically handles SPA route rewrites!
