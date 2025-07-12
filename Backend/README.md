# ReWear Backend

Backend API for the ReWear sustainable fashion exchange platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Item Management**: CRUD operations for fashion items with image upload
- **Swap System**: Direct item-to-item swaps and point-based redemption
- **Points System**: Reward system for sustainable fashion exchanges
- **Admin Panel**: Content moderation and user management
- **Email Notifications**: Automated emails for swap updates
- **File Upload**: Image upload with validation and compression
- **Search & Filtering**: Advanced search with multiple criteria
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API protection against abuse
- **Error Handling**: Centralized error management

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rewear
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Seed Database** (Optional):

   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### Items

- `GET /api/items` - Get all approved items (with filters)
- `GET /api/items/:id` - Get single item details
- `POST /api/items` - Create new item listing (protected)
- `PUT /api/items/:id` - Update item (protected, owner only)
- `DELETE /api/items/:id` - Delete item (protected, owner only)
- `POST /api/items/:id/images` - Upload item images (protected)
- `GET /api/items/user` - Get user's items (protected)

### Swaps

- `POST /api/swaps` - Create swap request (protected)
- `GET /api/swaps` - Get user's swaps (protected)
- `PUT /api/swaps/:id/accept` - Accept swap request (protected)
- `PUT /api/swaps/:id/reject` - Reject swap request (protected)
- `PUT /api/swaps/:id/complete` - Mark swap as completed (protected)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/items/pending` - Get pending items (admin only)
- `PUT /api/admin/items/:id/approve` - Approve item (admin only)
- `PUT /api/admin/items/:id/reject` - Reject item (admin only)
- `DELETE /api/admin/items/:id` - Delete item (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `POST /api/admin/items/bulk-approve` - Bulk approve items (admin only)

## Query Parameters

### Items

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `size` - Filter by size
- `condition` - Filter by condition
- `color` - Filter by color
- `brand` - Filter by brand
- `search` - Full-text search
- `sortBy` - Sort options: newest, oldest, points-low, points-high

### Swaps

- `page` - Page number (default: 1)
- `limit` - Swaps per page (default: 10)
- `status` - Filter by status: pending, accepted, rejected, completed

## Database Models

### User

```typescript
{
  fullName: string;
  email: string;
  password: string; // hashed
  phone: string;
  avatar?: string;
  points: number; // default 100
  role: 'user' | 'admin';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
```

### Item

```typescript
{
  title: string;
  description: string;
  category: 'dresses' | 'tops' | 'bottoms' | 'accessories' | 'shoes' | 'outerwear';
  type: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  condition: 'new' | 'like-new' | 'good' | 'fair';
  color: string;
  brand?: string;
  images: string[];
  tags: string[];
  pointValue: number; // auto-calculated
  owner: ObjectId;
  status: 'available' | 'pending' | 'swapped' | 'rejected';
  isApproved: boolean;
  rejectionReason?: string;
}
```

### Swap

```typescript
{
  requester: ObjectId;
  owner: ObjectId;
  requestedItem: ObjectId;
  offeredItem?: ObjectId;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  rejectionReason?: string;
  completedAt?: Date;
}
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Environment Variables

| Variable         | Description                          | Required           |
| ---------------- | ------------------------------------ | ------------------ |
| `NODE_ENV`       | Environment (development/production) | No                 |
| `PORT`           | Server port                          | No (default: 5000) |
| `MONGODB_URI`    | MongoDB connection string            | Yes                |
| `JWT_SECRET`     | JWT signing secret                   | Yes                |
| `JWT_EXPIRES_IN` | JWT expiration time                  | No (default: 7d)   |
| `EMAIL_HOST`     | SMTP server host                     | Yes                |
| `EMAIL_PORT`     | SMTP server port                     | Yes                |
| `EMAIL_USER`     | Email username                       | Yes                |
| `EMAIL_PASS`     | Email password                       | Yes                |
| `FRONTEND_URL`   | Frontend application URL             | Yes                |

## Development

1. **Code Structure**:

   ```
   src/
   ├── config/         # Database and app configuration
   ├── controllers/    # Route handlers
   ├── middleware/     # Custom middleware
   ├── models/         # Database models
   ├── routes/         # API routes
   ├── services/       # Business logic services
   ├── utils/          # Utility functions
   └── server.ts       # Main server file
   ```

2. **Adding New Features**:

   - Create model in `models/`
   - Add controller in `controllers/`
   - Define routes in `routes/`
   - Add validation middleware
   - Update documentation

3. **Testing**:
   - Unit tests for controllers
   - Integration tests for API endpoints
   - Database seeding for test data

## Deployment

1. **Production Environment**:

   ```bash
   npm run build
   npm start
   ```

2. **Environment Variables**: Update production values
3. **Database**: Use production MongoDB instance
4. **File Storage**: Configure cloud storage (Cloudinary)
5. **Email Service**: Configure production email service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
