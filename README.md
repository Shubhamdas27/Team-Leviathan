# ReWear Platform

A complete full-stack sustainable fashion exchange platform that enables users to swap unused clothing through direct exchanges or a point-based redemption system.

## 🌍 Mission

ReWear aims to reduce fashion waste and promote sustainable consumption by creating a community where people can exchange clothing items, extending the lifecycle of garments and reducing environmental impact.

## ✨ Features

### Core Functionality

- **Item Listing**: Upload and manage clothing items with detailed descriptions and photos
- **Smart Swapping**: Direct item-to-item exchanges or point-based redemption system
- **Advanced Search**: Filter by category, size, condition, color, brand, and location
- **User Profiles**: Comprehensive profiles with ratings, swap history, and preferences
- **Points System**: Earn points through successful swaps and use them to acquire new items
- **Admin Moderation**: Content approval system to ensure quality and safety

### User Experience

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Real-time Notifications**: In-app and email notifications for swap updates
- **Secure Authentication**: JWT-based authentication with password reset functionality
- **Image Management**: High-quality image upload with automatic optimization
- **Search & Discovery**: Intelligent search with auto-suggestions and saved searches

### Safety & Trust

- **User Verification**: Email verification and optional identity verification
- **Secure Messaging**: Built-in messaging system for swap coordination
- **Dispute Resolution**: Admin-mediated dispute resolution system
- **Content Moderation**: AI-powered content filtering and human review

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer with Cloudinary integration
- **Email**: Nodemailer for transactional emails
- **Security**: Helmet, CORS, rate limiting, input validation

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **HTTP Client**: Axios with request/response interceptors
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **Icons**: Heroicons React
- **Animations**: Framer Motion

### DevOps & Tools

- **Version Control**: Git with conventional commits
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Testing**: Jest (backend), React Testing Library (frontend)
- **Build Tools**: TypeScript compiler, Webpack (via Create React App)
- **Deployment**: Docker containerization ready

## 📁 Project Structure

```
rewear-platform/
├── Backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   ├── config/         # Configuration
│   │   └── server.ts       # Main server file
│   ├── uploads/            # File upload directory
│   ├── package.json
│   └── README.md
├── Frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/rewear-platform.git
   cd rewear-platform
   ```

2. **Backend Setup**:

   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal):

   ```bash
   cd Frontend
   npm install
   # Create .env with REACT_APP_API_URL=http://localhost:5000/api
   npm start
   ```

4. **Seed Database** (optional):
   ```bash
   cd Backend
   npm run seed
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

### Default Admin Account

After seeding the database:

- Email: `admin@rewear.com`
- Password: `admin123`

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
GET    /api/auth/profile       # Get user profile
PUT    /api/auth/profile       # Update user profile
POST   /api/auth/forgot-password  # Password reset request
POST   /api/auth/reset-password   # Password reset
```

### Items Endpoints

```
GET    /api/items              # Get all items (with filters)
GET    /api/items/:id          # Get single item
POST   /api/items              # Create new item
PUT    /api/items/:id          # Update item
DELETE /api/items/:id          # Delete item
POST   /api/items/:id/images   # Upload item images
```

### Swaps Endpoints

```
POST   /api/swaps              # Create swap request
GET    /api/swaps              # Get user's swaps
PUT    /api/swaps/:id/accept   # Accept swap request
PUT    /api/swaps/:id/reject   # Reject swap request
PUT    /api/swaps/:id/complete # Complete swap
```

### Admin Endpoints

```
GET    /api/admin/users        # Get all users
GET    /api/admin/items/pending # Get pending items
PUT    /api/admin/items/:id/approve # Approve item
PUT    /api/admin/items/:id/reject  # Reject item
GET    /api/admin/stats        # Platform statistics
```

## 🔧 Configuration

### Backend Environment Variables

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
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm test                    # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Tests

```bash
cd Frontend
npm test                   # Run tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 📦 Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t rewear-backend ./Backend
docker build -t rewear-frontend ./Frontend
```

### Manual Deployment

#### Backend (Node.js)

```bash
cd Backend
npm run build
npm start
```

#### Frontend (Static Build)

```bash
cd Frontend
npm run build
# Deploy the build/ folder to your hosting provider
```

### Hosting Recommendations

- **Backend**: Heroku, DigitalOcean, AWS EC2, Railway
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas, DigitalOcean Managed MongoDB
- **Images**: Cloudinary, AWS S3

## 🔒 Security Features

- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Password Security**: bcrypt hashing with salt
- **Input Validation**: Server-side validation for all endpoints
- **Rate Limiting**: API endpoint protection against abuse
- **CORS**: Configured for specific frontend domains
- **File Upload Security**: Type and size validation
- **XSS Protection**: Input sanitization and output encoding
- **SQL Injection Prevention**: MongoDB with parameterized queries

## 📊 Database Schema

### User Model

```typescript
{
  fullName: string;
  email: string;           // unique
  password: string;        // hashed
  phone: string;
  avatar?: string;
  points: number;          // default: 100
  role: 'user' | 'admin';  // default: 'user'
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isVerified: boolean;     // default: false
  createdAt: Date;
  updatedAt: Date;
}
```

### Item Model

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
  pointValue: number;      // auto-calculated
  owner: ObjectId;         // ref: User
  status: 'available' | 'pending' | 'swapped' | 'rejected';
  isApproved: boolean;     // default: false
  createdAt: Date;
  updatedAt: Date;
}
```

### Swap Model

```typescript
{
  requester: ObjectId;     // ref: User
  owner: ObjectId;         // ref: User
  requestedItem: ObjectId; // ref: Item
  offeredItem?: ObjectId;  // ref: Item (optional)
  pointsOffered?: number;  // alternative to offeredItem
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  rejectionReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Include tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check the README files in each directory
- **Issues**: Report bugs and feature requests on GitHub Issues
- **Discussions**: Join discussions on GitHub Discussions
- **Email**: contact@rewear-platform.com

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the sustainable fashion movement and circular economy principles
- Built with love for the environment and future generations

---

**Made with ❤️ for a more sustainable future**
