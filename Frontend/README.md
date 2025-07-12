# ReWear Frontend

React TypeScript frontend for the ReWear sustainable fashion exchange platform.

## Features

- **Modern React**: Built with React 18 and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication**: JWT-based authentication with protected routes
- **State Management**: Context API for global state
- **Item Management**: Browse, search, and filter clothing items
- **Swap System**: Request and manage clothing swaps
- **User Dashboard**: Profile management and activity tracking
- **Admin Panel**: Content moderation and user management
- **Real-time Notifications**: Toast notifications for user feedback
- **Image Upload**: Drag-and-drop image upload with preview
- **Advanced Search**: Filter by category, size, condition, color, and brand

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**:

   ```bash
   npm start
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── ItemCard.tsx    # Item display component
│   ├── SwapCard.tsx    # Swap request component
│   ├── Modal.tsx       # Modal dialog component
│   └── ...
├── pages/              # Page components
│   ├── LandingPage.tsx # Home page
│   ├── BrowsePage.tsx  # Item browsing page
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── DashboardPage.tsx # User dashboard
│   ├── ProfilePage.tsx # User profile
│   ├── SwapsPage.tsx   # Swap management
│   ├── AddItemPage.tsx # Add new item
│   └── admin/          # Admin pages
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useItems.ts     # Items data fetching
│   ├── useSwaps.ts     # Swaps data fetching
│   └── useDebounce.ts  # Search debouncing
├── services/           # API services
│   └── api.ts          # HTTP client and API calls
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── utils/              # Utility functions
│   └── constants.ts    # Constants and helpers
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## Key Features

### Authentication

- User registration and login
- JWT token management
- Protected routes
- Role-based access control (user/admin)
- Password reset functionality

### Item Management

- Browse items with advanced filtering
- Search by text, category, size, condition
- Sort by date, popularity, point value
- Image gallery with zoom
- Item details with owner information

### Swap System

- Create swap requests (item-to-item or points-based)
- Accept/reject swap requests
- Track swap status and history
- Messaging between users
- Email notifications

### User Dashboard

- Profile management
- Points balance and history
- My items management
- Swap requests (sent/received)
- Activity timeline

### Admin Panel

- User management
- Item moderation (approve/reject)
- Platform statistics
- Bulk actions
- Content filtering

## Components

### Reusable Components

#### ItemCard

```tsx
<ItemCard item={item} onSwapRequest={() => {}} showOwner={true} />
```

#### SwapCard

```tsx
<SwapCard
  swap={swap}
  onAccept={() => {}}
  onReject={() => {}}
  userRole="owner"
/>
```

#### Modal

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
  <p>Are you sure?</p>
</Modal>
```

### Form Components

- Input fields with validation
- File upload with drag-and-drop
- Select dropdowns
- Checkbox and radio buttons
- Form submission handling

### Navigation Components

- Header with user menu
- Breadcrumbs
- Pagination
- Sidebar navigation (admin)

## Styling

### Tailwind CSS Classes

The project uses custom CSS classes built on Tailwind:

- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Form input styles
- `.card` - Card container
- `.badge` - Status badges

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts that adapt to screen size
- Touch-friendly interface on mobile

### Dark Mode (Future)

Prepared for dark mode implementation with CSS custom properties.

## State Management

### AuthContext

Manages user authentication state:

- User profile information
- Authentication status
- Token management
- Login/logout functions

### Local State

Components use React hooks for local state:

- `useState` for component state
- `useEffect` for side effects
- `useReducer` for complex state logic

## API Integration

### Axios Configuration

- Base URL configuration
- Request/response interceptors
- Automatic token injection
- Error handling
- Response transformation

### API Services

Organized by feature:

- `authAPI` - Authentication endpoints
- `itemsAPI` - Item management
- `swapsAPI` - Swap operations
- `adminAPI` - Admin functions

## Performance Optimization

### Code Splitting

- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy libraries

### Image Optimization

- Responsive images
- Lazy loading
- Compression and resizing

### Caching

- API response caching
- localStorage for user preferences
- Service worker (future implementation)

## Testing

### Testing Strategy

- Unit tests for utilities
- Component testing with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress (future)

### Test Commands

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Deployment

### Build Process

```bash
npm run build
```

### Environment Variables

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_CLOUDINARY_CLOUD_NAME` - Image storage
- `REACT_APP_GOOGLE_ANALYTICS_ID` - Analytics

### Hosting Options

- Netlify (recommended)
- Vercel
- AWS S3 + CloudFront
- Traditional web hosting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.
