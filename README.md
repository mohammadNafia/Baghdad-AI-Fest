# Baghdad AI Summit 2026 - Complete Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Pages & Routing](#pages--routing)
- [Components](#components)
- [Admin Dashboard](#admin-dashboard)
- [Forms & Data Management](#forms--data-management)
- [TypeScript Migration](#typescript-migration)
- [UI/UX Features](#uiux-features)
- [Responsive Design System](#responsive-design-system)
- [Theme System](#theme-system)
- [Language Support](#language-support)
- [Utilities & Hooks](#utilities--hooks)
- [API & Data Layer](#api--data-layer)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Development Guide](#development-guide)
- [Recent Updates](#recent-updates)

---

## 🎯 Project Overview

The **Baghdad AI Summit 2026** is a modern, professional single-page application (SPA) built with React, Vite, and TailwindCSS. The website serves as the official platform for the premier artificial intelligence summit in the Middle East, scheduled for **October 15-17, 2026** at the Baghdad International Fairground.

### Key Highlights
- **Bilingual Support**: Full English and Arabic with RTL/LTR switching
- **Dark/Light Mode**: Complete theme system with localStorage persistence
- **Responsive Design**: 4-tier device system (Mobile, Tablet, Laptop, Desktop)
- **Admin Dashboard**: Full admin panel with analytics, charts, and data management
- **Modern UI/UX**: Glassmorphism, gradients, micro-interactions, and smooth animations
- **TypeScript Support**: Incremental migration with type definitions
- **Advanced Search**: Global Spotlight Search (Cmd+K / Ctrl+K)
- **Data Visualization**: Interactive charts and analytics
- **Export & Print**: CSV/JSON export and print-friendly views
- **Accessibility**: ARIA labels, keyboard navigation, focus management

---

## ✨ Key Features

### 1. **Global Spotlight Search (Cmd+K / Ctrl+K)**
- **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open
- **Search Button**: Available in Navbar
- **Search Sources**:
  - Pages (Home, About, Agenda, Ecosystem, Sign In, Register, Admin Login)
  - Speakers (by name, role, company, topic)
  - Agenda Items (by title, description, type)
  - Partners (by organization name, category)
- **Features**:
  - Full-screen modal overlay with glassmorphism
  - Grouped results by category
  - Keyboard navigation (Arrow Up/Down, Enter, Esc)
  - Click outside to close
  - Theme-aware and RTL-compatible
  - Pre-computed search index for performance

### 2. **Animated Particles Background**
- **Location**: Hero section background
- **Features**:
  - Subtle animated particles (80-120 on desktop, 30-60 on mobile)
  - Theme-aware colors (blue/cyan/purple for dark, pastel for light)
  - Performance-optimized (reduced motion support)
  - Non-intrusive (pointer-events-none)
  - Canvas-based animation

### 3. **Testimonials Section**
- **Location**: Home page, below Speakers section
- **Features**:
  - Responsive grid (1 column mobile, 2 tablet, 3 desktop)
  - Testimonial cards with quotes, names, roles, organizations
  - Scroll-triggered animations (RevealOnScroll)
  - Hover effects with scale and glow
  - Quote icons and avatars
  - RTL and theme support

### 4. **Admin Dashboard Analytics**
- **Charts**:
  - **Daily Submissions Line Chart**: Shows submissions over time with multiple series (Total, Attendees, Speakers, Partners)
  - **Partnership Categories Bar Chart**: Visualizes partnership category distribution
  - **Occupation Distribution Pie Chart**: Shows attendee occupation breakdown
- **Features**:
  - Interactive tooltips
  - Theme-aware colors
  - RTL support for Arabic
  - Responsive layout
  - Empty states when no data

### 5. **Export & Print Tools**
- **CSV Export**: 
  - Attendees, Speakers, Partners
  - Localized headers (English/Arabic)
  - Timestamp in filename
- **JSON Export**:
  - Partners data
  - Formatted JSON with indentation
  - Timestamp in filename
- **Print View**:
  - Dedicated print-optimized page (`/admin/print`)
  - Query parameters: `?type=attendees|speakers|partners|all`
  - Auto-triggers print dialog
  - Print-friendly styling (white background, black text)
  - RTL support

### 6. **TypeScript Migration (Incremental)**
- **Type Definitions**: `src/types/index.d.ts`
  - Speaker, AgendaItem, Partner, Testimonial interfaces
  - Form data types (AttendeeFormData, SpeakerFormData, PartnerFormData)
  - Theme and Lang types
  - Chart data types
- **Converted Files**:
  - Data files: `speakers.ts`, `agenda.ts`, `partners.ts`, `testimonials.ts`
  - Hooks: `useCounter.ts`
  - Components: All chart components (`.tsx`)
  - Utilities: `chartData.ts`, `export.ts`
  - Pages: `AdminPrintView.tsx`
- **Configuration**: `tsconfig.json` with strict mode enabled

### 7. **Bilingual Support (English/Arabic)**
- Complete translation system with `CONTENT` object
- RTL (Right-to-Left) layout for Arabic
- Dynamic `dir` and `lang` attributes
- All UI elements support both languages
- Arabic numerals utility
- RTL-aware component layouts

### 8. **Theme System (Dark/Light Mode)**
- Toggle button in navbar
- localStorage persistence
- Theme-aware styling across all components
- Smooth transitions between themes
- Professional light mode palette
- CSS color scheme support

### 9. **Responsive Design System**
- **Mobile** (< 640px): Optimized spacing, single column layouts
- **Tablet** (640px - 1024px): 2-column grids, medium padding
- **Laptop** (1024px - 1440px): 3-column grids, larger typography
- **Desktop** (≥ 1440px): 4-column grids, maximum spacing

### 10. **Interactive Chatbot**
- Floating chatbot button (bottom-right/left for RTL)
- Glassmorphism popup modal
- FAQ quick buttons
- Chat history with user/assistant messages
- RTL/LTR support

### 11. **Page Transitions**
- Smooth fade/slide animations
- `PageTransition` component wrapper
- CSS keyframe animations
- Lazy loading with React.lazy

### 12. **Scroll to Top Button**
- Appears after 300px scroll
- Smooth scroll behavior
- Theme and RTL aware
- Positioned above chatbot

### 13. **Mobile Bottom Navigation**
- Fixed bottom bar for screens < 768px
- 5 navigation items with icons
- Active state indicators
- RTL support

### 14. **Live Attending Counter**
- Floating card showing "Attending Now" count
- Auto-updates every 15 seconds
- Smooth count animation
- Random number between 30-250

### 15. **AI Aura Background**
- Floating animated gradient orbs behind Hero section
- Scroll parallax effect
- 2 orbs (cyan/blue and purple/blue)
- Keyframe animations

### 16. **Micro-Interactions**
- Hover scaling on cards (`hover:scale-[1.03]`)
- Ambient glow effects
- Press animations (scale to 0.97)
- Animated section headings with gradient underlines
- Image lazy fade-in (grayscale to color)

### 17. **3D Tilt Effects**
- Partner cards with 3D hover tilt
- Shine overlay animation
- CSS transforms and transitions

### 18. **Accessibility Features**
- ARIA labels on all interactive elements
- Focus rings (`focus:ring-2 focus:ring-blue-500/70`)
- Skip-to-content button
- Keyboard navigation support
- ESC key closes modals
- Improved color contrast
- Reduced motion support

### 19. **Smooth Anchor Scrolling**
- Section IDs: `#speakers`, `#stats`, `#agenda`, `#ecosystem`, `#partners`
- Smooth scroll behavior
- Navbar links scroll to sections

### 20. **Calendar Export**
- Google Calendar integration
- One-click event export
- Pre-filled event details

---

## 📄 Pages & Routing

### Main Pages

#### **Home Page** (`/`)
- Hero section with countdown timer
- Marquee with partner logos
- Statistics section (animated counters)
- Speakers section (grid of speaker cards)
- Testimonials section
- Call-to-action section
- Particles background in Hero

#### **About Page** (`/about`)
- Summit information
- Mission and vision
- Key highlights
- Event details

#### **Agenda Page** (`/agenda`)
- Timeline visualization
- Day-by-day schedule
- Event types (Keynotes, Panels, Workshops, Competitions)
- Calendar export functionality

#### **Ecosystem Page** (`/ecosystem`)
- Partnership opportunities
- Partner showcase
- Application wizards
- Partnership categories

### Authentication Pages

#### **Sign In Page** (`/signin`)
- Full-page sign-in
- Google Sign-in button (UI only)
- Email/password form with validation
- Admin login support (admin@gmail.com / admin)
- Forgot password link
- Switch to Register
- Form validation with react-hook-form and Zod

#### **Register Page** (`/register`)
- Full-page registration
- Name, email, password, confirm password
- Google Sign-in option
- Switch to Sign In
- Form validation

### Admin Pages

#### **Admin Login** (`/admin/login`)
- Email: `admin@gmail.com`
- Password: `admin`
- Full-page authentication
- Error handling
- Session management

#### **Admin Dashboard** (`/admin/dashboard`)
- **Analytics Overview**:
  - Total Registrations, Speakers, Partners cards
  - Daily Submissions Line Chart
  - Partnership Categories Bar Chart
  - Occupation Distribution Pie Chart
  - Activity Log
  - Most Common Occupation
  - Top Partnership Category
- **Data Tables**:
  - Attendees, Speakers, Partners tabs
  - Search and filter functionality
  - Pagination (10 items per page)
  - Export to CSV/JSON
  - Print functionality
- **Features**:
  - Tab-based navigation
  - Multi-language support
  - Theme-aware styling
  - RTL support

#### **Admin Print View** (`/admin/print`)
- Print-optimized layout
- Query parameters: `?type=attendees|speakers|partners|all`
- Auto-triggers print dialog
- Print-friendly styling
- RTL support
- Back to dashboard button

#### **404 Not Found** (`/404`)
- Custom 404 page
- Navigation back to home

---

## 🧩 Components

### Layout Components

#### **Navbar** (`src/components/Navbar.jsx`)
- Fixed top navigation
- Logo and branding
- Navigation links (Home, About, Agenda, Ecosystem)
- Theme toggle button
- Language toggle button
- Sign In button
- Register button
- Search button (opens Spotlight Search)
- Responsive: collapses on mobile
- RTL support

#### **Footer** (`src/components/Footer.jsx`)
- Logo and description
- Quick links
- Social media icons
- Copyright information
- Theme-aware styling
- RTL support

#### **ModalBase** (`src/components/forms/ModalBase.jsx`)
- Reusable modal wrapper
- Glassmorphism styling
- ESC key to close
- Click outside to close
- Theme-aware
- RTL support

### Page Components

#### **Hero** (in `HomePage.jsx`)
- Large title with gradient text
- Subtitle and description
- Countdown timer
- CTA buttons
- Stats card overlay
- AI Aura background orbs
- Particles background
- Responsive typography

#### **SpeakersSection** (in `HomePage.jsx`)
- Section heading
- Grid of speaker cards (1-4 columns based on screen size)
- Scroll-triggered animations
- RTL support

#### **SpeakerCard** (in `HomePage.jsx`)
- Speaker image (lazy fade-in)
- Name, role, company
- Social media links
- Hover effects (scale, glow)
- 3D tilt on hover

#### **StatsSection** (in `HomePage.jsx`)
- Animated counters using `useCounter` hook
- Icon badges
- Hover effects
- Responsive grid (1-3 columns)

#### **TestimonialsSection** (`src/components/TestimonialsSection.jsx`)
- Responsive grid layout
- Testimonial cards with quotes
- Scroll animations
- Hover effects
- Quote icons
- RTL and theme support

#### **AgendaTimeline** (in `AgendaPage.jsx`)
- Timeline visualization
- Event cards
- Time and description
- Type badges
- Calendar export buttons

#### **EcosystemMarquee** (in `EcosystemPage.jsx`)
- Infinite scrolling partner logos
- Hover pause
- Gradient fade edges

### Form Components

#### **GeneralRegistrationForm** (`src/components/forms/GeneralRegistrationForm.jsx`)
- Name, age, occupation, institution
- Email, phone
- Motivation text
- Form validation with react-hook-form and Zod
- Saves to `localStorage.attendees`
- Success/error messages
- RTL support

#### **SpeakerRegistrationForm** (`src/components/forms/SpeakerRegistrationForm.jsx`)
- Name, occupation, institution
- Email, phone
- Technical skills
- Speaking experience
- Proposed topics
- Achievements
- Form validation
- Saves to `localStorage.speakers`
- RTL support

#### **PartnershipWizard** (in `EcosystemPage.jsx`)
- 3-step wizard
- Step 1: Organization info
- Step 2: Requirements
- Step 3: Review
- Progress bar
- Form validation
- Saves to `localStorage.partners`
- RTL support

### Utility Components

#### **Chatbot** (`src/components/Chatbot.jsx`)
- Floating button
- Popup modal with glassmorphism
- FAQ buttons
- Chat history
- Text input
- RTL/LTR support
- Theme-aware

#### **ScrollTopButton** (`src/components/ScrollTopButton.jsx`)
- Floating button
- Appears after 300px scroll
- Smooth scroll to top
- Theme-aware
- RTL-aware positioning

#### **MobileBottomNav** (in `Navbar.jsx`)
- Fixed bottom navigation
- 5 items: Home, Speakers, Agenda, Ecosystem, Register
- Active state indicators
- Icons + text
- RTL support

#### **PageTransition** (in `AppRouter.jsx`)
- Wrapper for page animations
- Fade and slide effects
- CSS keyframes

#### **LoadingSkeleton** (in `AppRouter.jsx`)
- Animated placeholder
- Theme-aware colors
- Used with React.lazy

#### **AttendingNowCounter** (in `HomePage.jsx`)
- Floating card
- Live count display
- Auto-updates every 15 seconds
- Smooth animations

#### **SpotlightSearch** (`src/components/SpotlightSearch.jsx`)
- Full-screen modal overlay
- Search input with icon
- Grouped results (Pages, Speakers, Agenda, Partners)
- Keyboard navigation (Arrow Up/Down, Enter, Esc)
- Click outside to close
- Theme-aware and RTL-compatible
- Global keyboard shortcut (Cmd+K / Ctrl+K)

#### **ParticlesBackground** (`src/components/ParticlesBackground.jsx`)
- Canvas-based particle animation
- Theme-aware colors
- Performance-optimized
- Reduced motion support
- Responsive particle count

#### **CountdownTimer** (`src/components/shared/CountdownTimer.jsx`)
- Countdown to summit date
- Days, hours, minutes, seconds
- Animated number transitions
- RTL support

#### **RevealOnScroll** (`src/components/shared/RevealOnScroll.jsx`)
- Scroll-triggered animations
- Fade and slide effects
- Intersection Observer API
- Performance-optimized

#### **SectionHeading** (`src/components/shared/SectionHeading.jsx`)
- Consistent section headings
- Gradient underlines
- RTL support
- Theme-aware

#### **SummitLogo** (`src/components/SummitLogo.jsx`)
- Reusable logo component
- Theme-aware colors
- Responsive sizing

### Admin Components

#### **AdminAnalyticsSection** (`src/components/admin/charts/AdminAnalyticsSection.tsx`)
- Wrapper for all admin charts
- Responsive grid layout
- Empty state handling
- RTL and theme support

#### **SubmissionsLineChart** (`src/components/admin/charts/SubmissionsLineChart.tsx`)
- Daily submissions over time
- Multiple series (Total, Attendees, Speakers, Partners)
- Interactive tooltips
- Theme-aware colors
- Responsive container

#### **PartnershipCategoryBarChart** (`src/components/admin/charts/PartnershipCategoryBarChart.tsx`)
- Partnership category distribution
- Bar chart visualization
- Interactive tooltips
- Theme-aware colors
- RTL support

#### **OccupationPieChart** (`src/components/admin/charts/OccupationPieChart.tsx`)
- Attendee occupation distribution
- Pie chart with legend
- Color-coded slices
- Interactive tooltips
- Theme-aware colors

### Error Handling

#### **ErrorBoundary** (`src/components/ErrorBoundary.jsx`)
- GeneralErrorBoundary for public pages
- AdminErrorBoundary for admin pages
- Error fallback UI
- Error logging

---

## 🔐 Admin Dashboard

### Authentication
- **Login Page**: `/admin/login` or `/signin` with admin credentials
- **Credentials**: `admin@gmail.com` / `admin123`
- **Session Management**: localStorage-based (front-end only)
- **Logout Functionality**: Clears session and redirects

### Analytics Dashboard
- **Total Registrations**: Count of all attendee submissions
- **Total Speakers**: Count of speaker applications
- **Total Partners**: Count of partnership requests
- **Total Submissions**: Combined count
- **Most Common Occupation**: Calculated from attendee data
- **Top Partnership Category**: Calculated from partner data
- **Activity Log**: Recent submissions sorted by timestamp

### Data Visualization
- **Daily Submissions Line Chart**: 
  - Shows submissions over time
  - Multiple series for different submission types
  - Interactive tooltips
  - Theme-aware styling
- **Partnership Categories Bar Chart**:
  - Visualizes distribution of partnership categories
  - Clickable bars (optional filtering)
  - Responsive design
- **Occupation Distribution Pie Chart**:
  - Shows breakdown of attendee occupations
  - Color-coded slices
  - Legend with percentages

### Data Tables
- **Attendees Table**: Name, Email, Phone, Occupation, Date Submitted
- **Speakers Table**: Name, Email, Topics, Date Submitted
- **Partners Table**: Organization, Email, Category, Date Submitted

### Table Features
- **Search**: Filter by name or email (case-insensitive)
- **Pagination**: 10 items per page with navigation controls
- **Sorting**: By date (ascending/descending)
- **Export**: 
  - CSV for all tables (localized headers)
  - JSON for partners
  - Timestamp in filename
- **Print**: 
  - Dedicated print view
  - Query parameter support
  - Print-optimized styling
- **RTL Support**: Full Arabic layout support

### Navigation
- Tab-based navigation (Dashboard, Attendees, Speakers, Partners)
- Logout button
- Search functionality
- Export/Print buttons

---

## 📝 Forms & Data Management

### Form Storage
All form submissions are stored in `localStorage`:

```javascript
// Attendees
localStorage.setItem('attendees', JSON.stringify([...existing, newEntry]));

// Speakers
localStorage.setItem('speakers', JSON.stringify([...existing, newEntry]));

// Partners
localStorage.setItem('partners', JSON.stringify([...existing, newEntry]));
```

### Data Structure

#### **Attendee Entry**
```typescript
{
  id: string,
  name: string,
  age: number | string,
  occupation: string,
  institution: string,
  email: string,
  phone: string,
  motivation: string,
  dateSubmitted: string (ISO)
}
```

#### **Speaker Entry**
```typescript
{
  id: string,
  name: string,
  occupation: string,
  institution: string,
  email: string,
  phone: string,
  skills: string,
  experience: string,
  topics: string,
  achievements: string,
  dateSubmitted: string (ISO)
}
```

#### **Partner Entry**
```typescript
{
  id: string,
  organization: string,
  email: string,
  category: string,
  requirements?: string,
  dateSubmitted: string (ISO)
}
```

### Form Validation
- **Library**: react-hook-form with Zod resolver
- **Schemas**: Defined in `src/schemas/formSchemas.js`
- **Validation Rules**:
  - Email format validation
  - Password strength requirements
  - Required field validation
  - Phone number format
  - Age range validation

### Export Functionality
- **CSV Export**: 
  - All tables can export to CSV format
  - Localized headers (English/Arabic)
  - Automatic file download
  - Includes all filtered data
  - Timestamp in filename
- **JSON Export**: 
  - Partners table can export to JSON
  - Formatted with indentation
  - Timestamp in filename
- **Print View**: 
  - Print-optimized layout
  - Query parameter support
  - Auto-triggers print dialog

---

## 📘 TypeScript Migration

### Setup
- **Configuration**: `tsconfig.json` with strict mode enabled
- **Node Config**: `tsconfig.node.json` for Vite
- **Dependencies**: `typescript`, `@types/react`, `@types/react-dom`

### Type Definitions
Located in `src/types/index.d.ts`:
- `Theme`: "light" | "dark"
- `Lang`: "en" | "ar"
- `Speaker`: Interface for speaker data
- `AgendaItem`: Interface for agenda items
- `Partner`: Interface for partner data
- `Testimonial`: Interface for testimonials
- `AttendeeFormData`: Interface for attendee form submissions
- `SpeakerFormData`: Interface for speaker form submissions
- `PartnerFormData`: Interface for partner form submissions
- `DailySubmissionData`: Interface for chart data
- `CategoryCountData`: Interface for category counts
- `OccupationDistributionData`: Interface for occupation data

### Converted Files
- **Data Files**: `speakers.ts`, `agenda.ts`, `partners.ts`, `testimonials.ts`
- **Hooks**: `useCounter.ts`
- **Components**: All chart components (`.tsx`), `AdminPrintView.tsx`
- **Utilities**: `chartData.ts`, `export.ts`

### Migration Strategy
- Incremental migration (files converted gradually)
- JavaScript files still work alongside TypeScript
- Type definitions shared across the project
- Strict mode enabled for new TypeScript files

---

## 🎨 UI/UX Features

### Glassmorphism
- Frosted glass effect on modals and cards
- `backdrop-blur-xl` for blur effect
- Semi-transparent backgrounds
- Border highlights
- Theme-aware opacity

### Gradients
- Hero title gradients
- Section heading underlines
- Background gradients
- Button gradients
- Theme-aware color schemes

### Animations
- **Scroll Animations**: RevealOnScroll component
- **Count Animations**: useCounter hook
- **Page Transitions**: Fade and slide effects
- **Hover Effects**: Scale, glow, tilt
- **Loading States**: Skeleton loaders
- **Particle Animations**: Canvas-based particles

### Micro-Interactions
- Button press animations
- Card hover effects
- Input focus states
- Link hover states
- Icon animations

### Visual Effects
- 3D tilt on partner cards
- Shine overlay animations
- Parallax scrolling
- Gradient orbs (AI Aura)
- Particle backgrounds

### Accessibility
- ARIA labels on interactive elements
- Focus rings for keyboard navigation
- Skip-to-content button
- Keyboard shortcuts (Cmd+K, Esc)
- Reduced motion support
- High contrast mode support
- Screen reader friendly

---

## 📱 Responsive Design System

### Breakpoints
- **Mobile**: `< 640px` (default)
- **Tablet**: `≥ 640px` and `< 1024px` (sm + md)
- **Laptop**: `≥ 1024px` and `< 1440px` (lg)
- **Desktop**: `≥ 1440px` (xl + 2xl)

### Adaptive Spacing
- **Mobile**: `p-4`, `gap-4`
- **Tablet**: `p-6`, `gap-6`
- **Laptop**: `p-10`, `gap-8`
- **Desktop**: `p-16`, `gap-12`

### Adaptive Typography
- **Mobile**: `text-3xl` hero titles, `text-sm` body
- **Tablet**: `text-5xl` hero titles
- **Laptop**: `text-6xl` hero titles
- **Desktop**: `text-7xl` or `text-8xl` hero titles

### Grid Layouts
- **Speakers Grid**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Laptop: 3 columns
  - Desktop: 4 columns
- **Stats Grid**:
  - Mobile: Stacked
  - Tablet: 3 in a row
  - Laptop: 3 columns
  - Desktop: 3 columns
- **Testimonials Grid**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

### Touch Interactions
- Minimum tap target: 44px
- Increased spacing between interactive elements
- Stronger hover/press states
- Touch-friendly button sizes

---

## 🎨 Theme System

### Dark Mode (Default)
- Background: `#00040F`
- Text: White/Gray shades
- Cards: `bg-white/5`, `border-white/10`
- Gradients: Blue/Cyan/Purple
- Glassmorphism: `backdrop-blur-xl`
- Chart colors: Bright lines on dark background

### Light Mode
- Background: `bg-gray-50` / `bg-white`
- Text: Gray-900/Gray-700
- Cards: `bg-white`, `border-gray-200`, `shadow-lg`
- Gradients: Softer blue/cyan tones
- Glassmorphism: `bg-white/90`
- Chart colors: Darker lines on light background

### Theme Persistence
- Stored in `localStorage` as `'theme'`
- Applied on page load
- Updates `document.documentElement.classList`
- Sets `colorScheme` CSS property
- Context API for global theme state

### Theme Context
- `ThemeProvider`: Wraps the application
- `useTheme()`: Hook to access theme state
- `toggleTheme()`: Function to switch themes
- Theme-aware components automatically update

---

## 🌐 Language Support

### Translation System
All text content is stored in the `CONTENT` object in `src/data/translations.js`:

```javascript
const CONTENT = {
  en: { /* English translations */ },
  ar: { /* Arabic translations */ }
};
```

### Translation Keys
- `nav.*`: Navigation items
- `hero.*`: Hero section content
- `stats.*`: Statistics labels
- `speakers.*`: Speakers section
- `ecosystem.*`: Ecosystem section
- `forms.*`: Form labels
- `chatbot.*`: Chatbot content
- `auth.*`: Authentication content
- `admin.*`: Admin dashboard content
- `spotlight.*`: Spotlight search content
- `testimonials.*`: Testimonials section

### RTL Support
- Dynamic `dir` attribute: `dir={lang === 'ar' ? 'rtl' : 'ltr'}`
- Icon direction reversal: `className={lang === 'ar' ? 'rotate-180' : ''}`
- Layout mirroring: `flex-row-reverse` for Arabic
- Text alignment: Right-aligned for Arabic
- Chart legends: Right-aligned for Arabic
- Table headers: Right-aligned for Arabic

### Language Context
- `LanguageProvider`: Wraps the application
- `useLanguage()`: Hook to access language state
- `toggleLanguage()`: Function to switch languages
- `t`: Translation function for accessing content
- Language persisted in localStorage

### Arabic Numerals
- Utility function in `src/utils/arabicNumerals.js`
- Converts numbers to Arabic-Indic numerals
- Used in countdown timer and statistics

---

## 🛠 Utilities & Hooks

### Custom Hooks

#### **useCounter** (`src/hooks/useCounter.ts`)
- Animated counter hook
- Intersection Observer for trigger
- Smooth number animation
- Parameters: `end` (target number), `duration` (animation time)
- Returns: `{ count, countRef }`

### Utility Functions

#### **chartData.ts** (`src/utils/chartData.ts`)
- `getDailySubmissionCounts()`: Groups submissions by date
- `getTopPartnershipCategories()`: Counts partnership categories
- `getOccupationDistribution()`: Counts attendee occupations

#### **export.ts** (`src/utils/export.ts`)
- `exportToCSV()`: Generic CSV export function
- `exportToJSON()`: Generic JSON export function
- `exportAttendeesCSV()`: Attendees-specific CSV export
- `exportSpeakersCSV()`: Speakers-specific CSV export
- `exportPartnersCSV()`: Partners-specific CSV export
- `exportPartnersJSON()`: Partners JSON export

#### **calendarExport.js** (`src/utils/calendarExport.js`)
- `openGoogleCalendar()`: Opens Google Calendar with pre-filled event details

#### **arabicNumerals.js** (`src/utils/arabicNumerals.js`)
- Converts numbers to Arabic-Indic numerals
- Used in countdown and statistics

---

## 🔌 API & Data Layer

### API Simulation Layer

#### **formsAPI** (`src/api/forms.js`)
- `submitAttendee(data)`: Saves attendee form to localStorage
- `getAttendees()`: Retrieves all attendees
- `submitSpeaker(data)`: Saves speaker form to localStorage
- `getSpeakers()`: Retrieves all speakers
- `submitPartner(data)`: Saves partner form to localStorage
- `getPartners()`: Retrieves all partners

#### **adminAPI** (`src/api/admin.js`)
- `getAllSubmissions()`: Fetches all submissions (attendees, speakers, partners)
- `getAnalytics()`: Calculates analytics data
- Creates activity log from submissions
- Returns structured data with success/error states

### Data Files

#### **Static Data**
- `speakers.ts`: Speaker data array
- `agenda.ts`: Agenda items array
- `partners.ts`: Partners data array
- `testimonials.ts`: Testimonials data array
- `translations.js`: Translation content object

### Data Flow
1. User submits form → Form component
2. Form validation → Zod schema
3. API call → formsAPI
4. Save to localStorage → Browser storage
5. Admin dashboard → adminAPI fetches data
6. Display in tables/charts → AdminDashboard component

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baghdad-ai-summit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Output in `dist/` directory

5. **Preview production build**
   ```bash
   npm run preview
   ```

6. **Lint code**
   ```bash
   npm run lint
   ```

### Environment Variables
No environment variables required for basic functionality.

---

## 📁 Project Structure

```
baghdad-ai-summit/
├── src/
│   ├── api/
│   │   ├── admin.js              # Admin API simulation
│   │   └── forms.js              # Forms API simulation
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── admin/
│   │   │   └── charts/
│   │   │       ├── AdminAnalyticsSection.tsx
│   │   │       ├── OccupationPieChart.tsx
│   │   │       ├── PartnershipCategoryBarChart.tsx
│   │   │       └── SubmissionsLineChart.tsx
│   │   ├── forms/
│   │   │   ├── GeneralRegistrationForm.jsx
│   │   │   ├── ModalBase.jsx
│   │   │   └── SpeakerRegistrationForm.jsx
│   │   ├── shared/
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── RevealOnScroll.jsx
│   │   │   └── SectionHeading.jsx
│   │   ├── Chatbot.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ParticlesBackground.jsx
│   │   ├── ScrollTopButton.jsx
│   │   ├── SpotlightSearch.jsx
│   │   ├── SummitLogo.jsx
│   │   └── TestimonialsSection.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── LanguageContext.jsx   # Language state
│   │   └── ThemeContext.jsx      # Theme state
│   ├── data/
│   │   ├── agenda.ts
│   │   ├── partners.ts
│   │   ├── speakers.ts
│   │   ├── summitData.js
│   │   ├── testimonials.ts
│   │   └── translations.js
│   ├── hooks/
│   │   └── useCounter.ts
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminPrintView.tsx
│   │   ├── AgendaPage.jsx
│   │   ├── EcosystemPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── NotFound.jsx
│   │   ├── Register.jsx
│   │   └── SignIn.jsx
│   ├── router/
│   │   └── AppRouter.jsx         # React Router configuration
│   ├── schemas/
│   │   └── formSchemas.js        # Zod validation schemas
│   ├── types/
│   │   └── index.d.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── arabicNumerals.js
│   │   ├── calendarExport.js
│   │   ├── chartData.ts
│   │   └── export.ts
│   ├── App.css
│   ├── App.jsx                   # Legacy file (kept for reference)
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
├── public/
├── dist/                         # Production build output
├── node_modules/
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript node config
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### File Organization
- **pages/**: Standalone page components
- **components/**: Reusable UI components
- **hooks/**: Custom React hooks
- **data/**: Static data and translations
- **contexts/**: React Context providers
- **api/**: API simulation layer
- **utils/**: Utility functions
- **types/**: TypeScript type definitions
- **router/**: React Router configuration
- **schemas/**: Form validation schemas

---

## 🛠 Technologies Used

### Core
- **React 19.2.0**: UI library
- **Vite 7.2.4**: Build tool and dev server
- **TailwindCSS 3.4.17**: Utility-first CSS framework
- **React Router DOM 7.10.1**: Client-side routing

### Form Management
- **react-hook-form 7.68.0**: Form state management
- **Zod 4.1.13**: Schema validation
- **@hookform/resolvers 5.2.2**: Zod integration

### Icons
- **Lucide React 0.555.0**: Icon library

### Data Visualization
- **Recharts 3.5.1**: Charting library for React

### TypeScript
- **TypeScript 5.9.3**: Type system
- **@types/react 19.2.7**: React type definitions
- **@types/react-dom 19.2.3**: React DOM type definitions

### Development Tools
- **ESLint 9.39.1**: Code linting
- **Autoprefixer 10.4.22**: CSS vendor prefixing
- **PostCSS 8.5.6**: CSS processing

### Features
- **localStorage**: Client-side data storage
- **Intersection Observer API**: Scroll animations
- **CSS Animations**: Keyframes and transitions
- **Canvas API**: Particle animations

---

## 💻 Development Guide

### Adding New Features

1. **New Component**: 
   - Create in `src/components/`
   - Use TypeScript if possible (`.tsx`)
   - Follow theme and RTL patterns

2. **New Page**: 
   - Create in `src/pages/`
   - Add route in `src/router/AppRouter.jsx`
   - Use lazy loading with React.lazy

3. **New Translation**: 
   - Add keys to `src/data/translations.js`
   - Update both `en` and `ar` objects

4. **New Form**: 
   - Create form component
   - Add Zod schema in `src/schemas/formSchemas.js`
   - Use formsAPI to save data

5. **New Chart**: 
   - Create in `src/components/admin/charts/`
   - Use Recharts library
   - Follow theme-aware patterns
   - Add to AdminAnalyticsSection

### Styling Guidelines
- Use TailwindCSS utility classes
- Follow theme-aware patterns: `theme === 'light' ? '...' : '...'`
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Maintain RTL support: Check `lang === 'ar'` for layout adjustments
- Use glassmorphism for modals: `bg-white/5 backdrop-blur-xl border-white/10`

### State Management
- Use `useState` for component state
- Use `useEffect` for side effects
- Use Context API for global state (Theme, Language, Auth)
- Pass props down, callbacks up
- Store theme/language in `localStorage`

### Performance
- Use `React.lazy` for code splitting
- Use `Suspense` with loading fallbacks
- Optimize images (lazy loading)
- Minimize re-renders with proper dependencies
- Use `useMemo` and `useCallback` where appropriate
- Pre-compute search indexes

### TypeScript Guidelines
- Use TypeScript for new files
- Define types in `src/types/index.d.ts`
- Use interfaces for object shapes
- Use type unions for string literals
- Avoid `any` type (use `unknown` if needed)

### Accessibility
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain focus management
- Support reduced motion preferences
- Test with screen readers

---

## 📊 Admin Access

### Login Credentials
- **Email**: `admin@gmail.com`
- **Password**: `admin`

### Access Methods
1. **Sign In Page**: Navigate to `/signin` and use admin credentials
2. **Admin Login Page**: Navigate to `/admin/login`
3. **Direct Dashboard**: `/admin/dashboard` (requires authentication)

### Admin Features
- View all form submissions (Attendees, Speakers, Partners)
- Search and filter data
- Export to CSV/JSON
- Print reports
- Analytics dashboard with charts
- Activity log
- Pagination for large datasets

---

## 🔄 Recent Updates

### Group 3 Implementation (Latest)
- ✅ **TypeScript Migration**: Incremental migration with type definitions
- ✅ **Admin Charts**: Daily submissions, partnership categories, occupation distribution
- ✅ **Export Tools**: CSV/JSON export with localized headers
- ✅ **Print View**: Print-optimized page with query parameters
- ✅ **Chart Components**: Recharts integration with theme support

### Group 2 Implementation
- ✅ **Spotlight Search**: Global search with Cmd+K shortcut
- ✅ **Particles Background**: Animated particles in Hero section
- ✅ **Testimonials Section**: Social proof section on homepage

### Router Implementation
- ✅ **React Router**: URL-based routing with lazy loading
- ✅ **Page Extraction**: Pages extracted from App.jsx
- ✅ **Protected Routes**: Admin route protection
- ✅ **Error Boundaries**: Separate boundaries for public/admin

### Authentication System
- ✅ **Sign In Page**: Full-page sign-in with admin support
- ✅ **Register Page**: Full-page registration
- ✅ **Admin Login**: Dedicated admin login page
- ✅ **Session Management**: localStorage-based sessions

### Component Extraction
- ✅ **Modular Components**: Components extracted to separate files
- ✅ **Shared Components**: Reusable components in shared folder
- ✅ **Form Components**: Separate form components
- ✅ **Admin Components**: Chart components for admin dashboard

---

## 🎯 Future Improvements

### Planned Enhancements
- [ ] Complete TypeScript migration (convert remaining .jsx files)
- [ ] Backend integration for form submissions
- [ ] Real authentication system (JWT, OAuth)
- [ ] Email notifications
- [ ] Advanced analytics (funnel analysis, conversion rates)
- [ ] Real-time updates (WebSockets)
- [ ] Image upload functionality
- [ ] PDF export for reports
- [ ] Advanced search filters
- [ ] Data export scheduling
- [ ] User dashboard for attendees
- [ ] Email verification
- [ ] Password reset functionality

---

## 📝 Notes

- All form data is stored in `localStorage` (front-end only)
- Admin authentication is front-end only (for demo purposes)
- Google Sign-in is UI only (no backend integration)
- All animations use CSS (no external animation libraries)
- The application is fully client-side (no API calls to external servers)
- Charts use Recharts library (client-side rendering)
- Export functions trigger browser downloads
- Print view uses browser's print dialog

---

## 📄 License

This project is proprietary software for the Baghdad AI Summit 2026.

---

## 👥 Credits

Developed for the Baghdad AI Summit 2026 organizing committee.

---

**Last Updated**: 2026  
**Version**: 3.0  
**Status**: Production Ready  
**TypeScript Support**: Partial (Incremental Migration)
