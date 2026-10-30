# RentHub - Apartment Rental Platform

> **Nagarro Angular Assignment (Level 1)**  
> Built with **Angular 22 (Latest Release)**, **TypeScript**, **Bootstrap 5**, and **Vitest**.

[![Angular](https://img.shields.io/badge/Angular-22.2.0-dd0031.svg?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3.svg?logo=bootstrap)](https://getbootstrap.com/)
[![Tests](https://img.shields.io/badge/Unit%20Tests-28%20Passing-success.svg)](#-unit-testing-component-service-module)
[![Deployment](https://img.shields.io/badge/Deployed-Netlify-00ad9f.svg?logo=netlify)](https://renthub-rohit.netlify.app/)

RentHub is a comprehensive, modern apartment rental platform connecting prospective renters with property owners and managers. Landlords can create, edit, and delete detailed property listings; renters can search, filter, and shortlist homes using interactive favorites; tenants can send direct private inquiries; and both parties can engage in transparent public discussions with nested multi-level reply threads.

---

## 📌 Deliverable Links & Evaluator Credentials

| Deliverable | Link / Details |
| :--- | :--- |
| **GitHub Repository** | [`https://github.com/rohitgupta12-nagarro/renthub1`](https://github.com/rohitgupta12-nagarro/renthub1) |
| **Live Deployed Application** | [`https://renthub-rohit.netlify.app/`](https://renthub-rohit.netlify.app/) |
| **Target Framework** | Angular CLI `22.2.5` / Angular `22.2.0` (Latest Version) |
| **CSS Library** | Bootstrap `5.3.8` & Bootstrap Icons `1.11.3` + Custom Nordic Teal Design System |

### 🔑 Pre-Seeded Evaluator Accounts

The application includes pre-seeded user accounts persisted via `localStorage`:

| Role | Email | Password | Pre-seeded Permissions & Content |
| :--- | :--- | :--- | :--- |
| **Landlord** | `landlord@renthub.com` | `Password123!` | Has active published listings, edit/delete privileges, receives direct inquiries |
| **Prospective Renter** | `renter@renthub.com` | `Password123!` | Can favorite listings, send direct landlord inquiries, comment & reply |
| **Dual Role (Both)** | `priya@renthub.com` | `Password123!` | Has landlord villa listing, can submit inquiries and comments |

> **Evaluator Tip**: On the `/login` screen, click the **"Quick Demo Login"** button for instant one-click authentication without typing!

---

## 📋 Evaluation Criteria & Requirements Matrix

| Requirement / Evaluation Criteria (from PDF) | Status | Implementation Details |
| :--- | :---: | :--- |
| **Latest Angular CLI Version** | ✅ Complete | Upgraded and verified on **Angular CLI 22.2.5** and **Angular 22.2.0**. |
| **User Registration & Auth** | ✅ Complete | Reactive sign-up & login forms with validations, role selection (`renter`, `landlord`, `both`), password matching, and session persistence. |
| **Auth Guards** | ✅ Complete | [`AuthGuard`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/guards/auth.guard.ts) protects `/create-post`, `/preview-post`, `/inquiries`, and `/profile`, redirecting guests to `/login?returnUrl=...`. |
| **Apartment Listings CRUD** | ✅ Complete | Full CRUD: Create, Read (3-col grid & detail view), Update (edit own post), and Delete (with confirmation modal & alerts). |
| **Create New Post Form (Page 5)** | ✅ Complete | Matches Wireframe Page 5: Apartment type, Building name, Shared property (Yes/No), Location (Street, City, State, Numeric Zip), Details (Sq Ft, Beds, Baths, Stay/Lease type), Expected Rent (₹) & Negotiable toggle & Price Mode, Furnished (Yes/No), Vegetarian preference (Radio), all 12 Amenities checkboxes, Title & Description (with live 1400-char counter), and custom image URL adder. |
| **Form Validations** | ✅ Complete | Granular Reactive Form validations (`required`, `min`, `max`, `pattern`, `email`) with inline dirty/touched error messages. |
| **⭐ BONUS QUESTION: Preview & Submit Screen** | ✅ Complete | Dedicated route [`/preview-post`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/components/preview-post/preview-post.component.html) implementing Wireframe Page 6: summary boxes, photo grid, "Edit Post" navigation, and "Confirm & Submit". |
| **Home Screen Featured Carousel** | ✅ Complete | Follows Wireframe Page 3: Top carousel showcasing highlighted apartments with slide indicators, `<` and `>` controls, auto-play, and side info card with quick action buttons. |
| **Search & Multi-Facet Filtering** | ✅ Complete | Real-time text search, Property type dropdown, Stay type dropdown, Price range slider/inputs (₹), Furnished toggle, Veg preference, and multi-select amenities pills with instant count. |
| **3-Column Paginated Listings Grid** | ✅ Complete | Wireframe Page 3 layout with compact spec chips (Beds, Baths, Area), property type badge, price tag, and custom circular pagination. |
| **Interest Expression (Page 2)** | ✅ Complete | **Save to Favorites** (heart button with navbar counter & dedicated `/favorites` screen) and **Send Direct Inquiries** (modal form with dedicated `/inquiries` dashboard). |
| **Interactive Comments & Replies** | ✅ Complete | Discussion board on listing details with timestamps, author role tags, comment deletion, and **nested multi-level reply threads**. |
| **CSS Library** | ✅ Complete | **Bootstrap 5.3** + **Bootstrap Icons 1.11** enhanced with a soothing Nordic Teal & Sage color palette. |
| **Unit Test Cases (Deliverable)** | ✅ Complete | **28 automated Vitest tests** passing across **Components** (`HomeComponent`, `CreatePostComponent`, `AppComponent`), **Services** (`ListingService`, `AuthService`), and **Modules** (`AppModule`). |
| **Deployment Readiness** | ✅ Complete | Zero-warning production build verified. Includes `vercel.json` and `public/_redirects` for single-page routing on Vercel and Netlify. |

---

## ⭐ Bonus Feature: Preview & Submit Screen (Wireframe Page 6)

Per the assignment's explicit instruction: *"If attempted the bonus points, do mention it in readme."*

* **Route**: [`/preview-post`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/components/preview-post/preview-post.component.html)
* **Design & Flow**:
  1. When a landlord completes the post form on `/create-post` and clicks **"Preview Post & Submit"**, the listing draft is temporarily staged in [`ListingService`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/services/listing.service.ts).
  2. The user is redirected to the **Preview and Submit Screen**, which renders structured preview panels matching Wireframe Page 6:
     * **Property Type & Building**: Type badge and property title.
     * **Number of Beds & Baths**: Spec chips and total square footage.
     * **Address**: Complete street, city, state, and zip code.
     * **Rent & Terms**: Formatted ₹ expected rent, negotiable badge, and price mode.
     * **Description**: Full 1400-char listing copy.
     * **Amenities**: Badges for every selected amenity.
     * **Photo Gallery Preview**: Responsive grid displaying all uploaded/linked property photos.
  3. **Actions**:
     * **"Back to Edit Form"**: Returns to `/create-post` with 100% of the filled data preserved in the reactive form.
     * **"Confirm & Submit Listing"**: Persists the apartment to storage, triggers a success toast, and navigates to the live listing page.

---

## 💡 Architecture Note: Client-Side Reactive State & Persistence

In strict accordance with the **Frontend Level 1 (L1)** specification:
* **No external backend required**: Free hosting providers (Vercel, Netlify, GitHub Pages) host static single-page apps. Rather than depending on an un-hosted local Express/Node server that would break in production, RentHub utilizes a **Client-Side Reactive Mock API Layer**.
* **RxJS Observables (`BehaviorSubject`)**: [`ListingService`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/services/listing.service.ts), [`AuthService`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/services/auth.service.ts), [`InquiryService`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/services/inquiry.service.ts), and [`CommentService`](file:///c:/Users/rohitgupta12/OneDrive%20-%20Nagarro/Desktop/renthub/src/app/services/comment.service.ts) emit asynchronous data streams to components, identical to HTTP response streams.
* **Persistent Local Storage**: All additions, edits, deletions, favorites, comments, and inquiries are synced to `localStorage`, ensuring complete persistence across browser reloads, navigation, and user switching.

---

## 🧪 Unit Testing (Component, Service, Module)

The assignment requires unit test cases for at least 1 component, service, and module. RentHub includes **28 comprehensive Vitest unit tests** covering all three layers:

```bash
# Run unit test suite
npm run test:ci
```

### Test Results (28 of 28 Passed):
```
 ✓ src/app/services/auth.service.spec.ts (6 tests)
 ✓ src/app/services/listing.service.spec.ts (6 tests)
 ✓ src/app/app.module.spec.ts (2 tests)
 ✓ src/app/app.component.spec.ts (1 test)
 ✓ src/app/components/home/home.component.spec.ts (7 tests)
 ✓ src/app/components/create-post/create-post.component.spec.ts (6 tests)

 Test Files  6 passed (6)
      Tests  28 passed (28)
```

1. **Module Tests (`app.module.spec.ts`)**: Verifies root `AppModule` instantiation and dependency graph integrity.
2. **Service Tests (`listing.service.spec.ts`, `auth.service.spec.ts`)**: Tests listing queries, filtering, draft buffering, CRUD persistence, authentication state, registration, and session storage.
3. **Component Tests (`home.component.spec.ts`, `create-post.component.spec.ts`, `app.component.spec.ts`)**: Tests reactive form initialization, validation triggers, search filtering, carousel navigation, and routing integration.

---

## 🛠️ Project Structure

```
renthub/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/              # Login & Register components (Wireframe Page 4)
│   │   │   ├── create-post/       # Create New Post & Edit reactive form (Wireframe Page 5)
│   │   │   ├── favorites/         # Dedicated Saved Favorites screen
│   │   │   ├── footer/            # Footer component with branding & links
│   │   │   ├── home/              # Carousel + Facet Filters + 3-col Grid (Wireframe Page 3)
│   │   │   ├── inquiries/         # Direct Inquiries management dashboard
│   │   │   ├── listing-detail/    # Detail view + Owner Controls + Comments (Wireframe Page 6)
│   │   │   ├── navbar/            # Responsive header with live badge counts & user menu
│   │   │   ├── not-found/         # 404 error handler
│   │   │   ├── preview-post/      # ⭐ Bonus Preview & Submit screen (Wireframe Page 6)
│   │   │   ├── profile/           # User dashboard & published property listings
│   │   │   └── toast/             # Reactive global toast notification system
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # CanActivate Auth Guard
│   │   ├── models/
│   │   │   ├── apartment.model.ts # Property interfaces, filter types, amenities list
│   │   │   ├── comment.model.ts   # Comments & nested replies interface
│   │   │   ├── inquiry.model.ts   # Direct inquiry model
│   │   │   └── user.model.ts      # User, credentials & role definitions
│   │   ├── services/
│   │   │   ├── auth.service.ts    # Authentication, registration & session state
│   │   │   ├── comment.service.ts # Public discussion board & nested replies
│   │   │   ├── favorites.service.ts # Persistent favorite shortlists
│   │   │   ├── inquiry.service.ts # Landlord inquiry messenger & storage
│   │   │   ├── listing.service.ts # Apartment CRUD & draft preview buffer
│   │   │   └── toast.service.ts   # Real-time animated notification alerts
│   │   ├── app.component.*
│   │   ├── app.module.ts          # Root NgModule
│   │   └── app-routing.module.ts  # Route definitions & guards
│   ├── styles.scss                # Bootstrap 5 & Nordic Teal color palette
│   └── index.html
├── public/
│   └── _redirects                 # SPA client-side routing for Netlify
├── angular.json
├── package.json
├── vercel.json                    # SPA client-side rewrite for Vercel
└── README.md
```

---

## 🚀 Running the Project Locally

### Prerequisites
* **Node.js**: `v18.x` or higher (tested on Node `v24`)
* **npm**: `v9.x` or higher

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/rohitgupta12-nagarro/renthub1.git
   cd renthub1
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
   Open [http://localhost:4200](http://localhost:4200) in your browser.

4. **Run Automated Unit Tests**:
   ```bash
   npm run test:ci
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled output will be generated in `dist/renthub`.

---

## 🌐 Deploying to Free Hosting (Vercel / Netlify)

### Option A: Vercel (Recommended - 1 Click)
1. Push the code to a GitHub repository (verify `node_modules` is excluded via `.gitignore`).
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `renthub` repository.
4. Framework Preset: **Angular**.
5. Build Command: `npm run build`
6. Output Directory: `dist/renthub/browser` (or `dist/renthub`)
7. Click **Deploy**. The included `vercel.json` handles all client-side SPA routing automatically!

### Option B: Netlify
1. Log into [Netlify](https://www.netlify.com/) and choose **"Import from Git"**.
2. Select your `renthub` repository.
3. Build command: `npm run build`
4. Publish directory: `dist/renthub/browser` (or `dist/renthub`)
5. Click **Deploy Site**. The included `public/_redirects` file handles client-side SPA routing.
