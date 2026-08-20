const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduFlow Backend REST API',
      version: '1.0.0',
      description: 'Interactive API documentation for EduFlow LMS project',
      contact: {
        name: 'EduFlow Development Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths: {
      /* ==================== AUTHENTICATION ==================== */
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User Login with Email & Password',
          description: 'Authenticates user and returns a JWT access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'name@company.com' },
                    password: { type: 'string', example: 'userPassword123' },
                    rememberMe: { type: 'boolean', example: true }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Login successful' },
                      token: { type: 'string', example: 'jwt_token_sample_12345' },
                      expiresIn: { type: 'string', example: '30d' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'usr_101' },
                          fullName: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'name@company.com' },
                          role: { type: 'string', example: 'student' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: { description: 'Missing or invalid parameters' }
          }
        }
      },
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register New User',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fullName', 'email', 'password'],
                  properties: {
                    fullName: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'user@company.com' },
                    password: { type: 'string', example: 'securePassword123' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User registered successfully' }
          }
        }
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request Password Reset Link',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', example: 'name@company.com' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Password reset email sent' }
          }
        }
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Confirm Password Reset with Token or OTP',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'newPassword'],
                  properties: {
                    email: { type: 'string', example: 'user@company.com' },
                    token: { type: 'string', example: 'rst_123456' },
                    otp: { type: 'string', example: '123456' },
                    newPassword: { type: 'string', example: 'newSecurePassword123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Password reset successfully' },
            400: { description: 'Invalid token or parameters' }
          }
        }
      },
      '/api/auth/send-otp': {
        post: {
          tags: ['Authentication'],
          summary: 'Send 6-digit OTP code for email verification',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', example: 'user@company.com' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'OTP code sent successfully' }
          }
        }
      },
      '/api/auth/verify-otp': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify OTP code and confirm user email address',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp'],
                  properties: {
                    email: { type: 'string', example: 'user@company.com' },
                    otp: { type: 'string', example: '123456' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Email verified successfully' },
            400: { description: 'Invalid or expired OTP code' }
          }
        }
      },
      '/api/auth/verify-email': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify email address via OTP code (Alias)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp'],
                  properties: {
                    email: { type: 'string', example: 'user@company.com' },
                    otp: { type: 'string', example: '123456' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Email verified successfully' }
          }
        }
      },
      '/api/auth/refresh-token': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh JWT Access Token using Refresh Token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string', example: 'refresh_token_sample_string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'New access token and refresh token generated' },
            401: { description: 'Invalid or expired refresh token' }
          }
        }
      },
      '/api/auth/social-login': {
        post: {
          tags: ['Authentication'],
          summary: 'Social OAuth Login (Google / Apple / LinkedIn)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['provider', 'providerToken'],
                  properties: {
                    provider: { type: 'string', example: 'Google' },
                    providerToken: { type: 'string', example: 'oauth_token_from_google_sdk' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Social login successful' }
          }
        }
      },
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Server Logout & Token Revocation',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string', example: 'refresh_token_sample_string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Logged out successfully' }
          }
        }
      },

      /* ==================== DASHBOARD ==================== */
      '/api/dashboard': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get Composite Student Dashboard Payload',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Complete dashboard object returned' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/dashboard/stats': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get User Learning Streak & Hours Stats',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dashboard stats returned' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/dashboard/live-classes': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get List of Upcoming Live Classes',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Live classes array returned' }
          }
        }
      },
      '/api/dashboard/live-classes/{id}/reminder': {
        post: {
          tags: ['Dashboard'],
          summary: 'Toggle Reminder for a Live Class',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'lc_1'
            }
          ],
          responses: {
            200: { description: 'Reminder state toggled' },
            404: { description: 'Live class not found' }
          }
        }
      },
      '/api/dashboard/continue-learning': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get In-Progress Courses & Progress Percentage',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'In-progress courses list returned' }
          }
        }
      },
      '/api/dashboard/recommended': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get Recommended Courses List',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Recommended courses returned' }
          }
        }
      },
      '/api/dashboard/module-explorer': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get Module Explorer Navigation',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Module navigation returned' }
          }
        }
      },
      '/api/dashboard/download-resources': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get Course Learning Resource Download Link',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Resource download payload returned' }
          }
        }
      },

      /* ==================== PROFILE & ONBOARDING ==================== */
      '/api/profile/my-profile': {
        get: {
          tags: ['Profile & Onboarding'],
          summary: 'Get current user profile & onboarding step',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile retrieved successfully' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/profile/personal-info': {
        put: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 1: Save Personal Info',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fullName: { type: 'string', example: 'John Doe' },
                    location: { type: 'string', example: 'San Francisco, CA' },
                    bio: { type: 'string', example: 'Web developer & UX enthusiast' },
                    avatarUrl: { type: 'string', example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Personal info updated' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/profile/locations': {
        get: {
          tags: ['Profile & Onboarding'],
          summary: 'Get Global Countries and Major Cities Locations (Searchable)',
          parameters: [
            {
              in: 'query',
              name: 'search',
              schema: { type: 'string' },
              description: 'Optional search query (e.g. San, London, India)'
            },
            {
              in: 'query',
              name: 'country',
              schema: { type: 'string' },
              description: 'Filter by country name'
            }
          ],
          responses: {
            200: { description: 'List of matching countries and locations' }
          }
        }
      },
      '/api/profile/interests-options': {
        get: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 3: Get Available Interest Categories & Topics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of interest options returned' }
          }
        }
      },
      '/api/profile/interests': {
        put: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 3: Save Selected Interest Topics',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    interests: { type: 'array', items: { type: 'string' }, example: ['ai_ml', 'web_dev', 'graphic_design'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Interests saved' }
          }
        }
      },
      '/api/profile/goals': {
        put: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 2: Save Learning Goals',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    goals: { type: 'array', items: { type: 'string' }, example: ['career_upskill', 'master_react'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Goals saved' }
          }
        }
      },
      '/api/profile/skills': {
        put: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 4: Save Skill Assessment Ratings',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    skills: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', example: 'Web Development' },
                          level: { type: 'string', example: 'Intermediate' },
                          rating: { type: 'number', example: 65 }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Skills saved' }
          }
        }
      },
      '/api/profile/portfolio': {
        put: {
          tags: ['Profile & Onboarding'],
          summary: 'Save Portfolio & Professional Work Links',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    portfolioUrl: { type: 'string', example: 'https://myportfolio.dev' },
                    githubUrl: { type: 'string', example: 'https://github.com/username' },
                    linkedinUrl: { type: 'string', example: 'https://linkedin.com/in/username' },
                    projects: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string', example: 'E-Commerce Platform' },
                          link: { type: 'string', example: 'https://github.com/username/project' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Portfolio links updated' }
          }
        }
      },
      '/api/profile/avatar': {
        post: {
          tags: ['Profile & Onboarding'],
          summary: 'Upload / Generate Avatar Picture',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    seed: { type: 'string', example: 'EduflowUser1' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Avatar updated' }
          }
        }
      },
      '/api/profile/complete': {
        post: {
          tags: ['Profile & Onboarding'],
          summary: 'Step 5: Complete Onboarding Flow',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Onboarding completed' }
          }
        }
      },
      '/api/profile/avatar': {
        post: {
          tags: ['Profile & Onboarding'],
          summary: 'Upload or Generate Avatar / Photo Picture',
          description: 'Upload an actual photo file (Base64 data URI), direct image URL, or generate an avatar seed.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    file: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgo...', description: 'Base64 image file data URI' },
                    avatarUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', description: 'Direct photo image URL' },
                    seed: { type: 'string', example: 'custom_seed', description: 'DiceBear avatar seed' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Profile picture uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Profile picture uploaded successfully' },
                      avatarUrl: { type: 'string', example: 'http://localhost:5000/uploads/avatars/avatar_123.jpg' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/profile/settings': {
        get: {
          tags: ['Profile & Settings'],
          summary: 'Get All User Settings & Profile Details',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Returns settings payload' }
          }
        },
        put: {
          tags: ['Profile & Settings'],
          summary: 'Save All Profile & Settings Updates',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fullName: { type: 'string', example: 'Alex Rivera' },
                    headline: { type: 'string', example: 'Senior Product Designer' },
                    timezone: { type: 'string', example: 'Central European Time (CET) - UTC+1' },
                    phoneNumber: { type: 'string', example: '+1 (555) 000-0000' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Settings updated' }
          }
        }
      },
      '/api/profile/notifications': {
        put: {
          tags: ['Profile & Settings'],
          summary: 'Update Notification Preferences',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    courseActivity: { type: 'boolean', example: true },
                    liveSessions: { type: 'boolean', example: true },
                    newsletter: { type: 'boolean', example: false }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Notification preferences updated' }
          }
        }
      },

      /* ==================== COURSES & CATALOG ==================== */
      '/api/courses': {
        get: {
          tags: ['Courses'],
          summary: 'Get Filtered, Searchable & Paginated Course Catalog',
          description: 'Returns a list of courses with support for category filter, difficulty level, search query, sorting, and pagination.',
          parameters: [
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'All' },
              description: 'Filter courses by category'
            },
            {
              name: 'level',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'All Levels' },
              description: 'Filter courses by difficulty level'
            },
            {
              name: 'sort',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'Popularity' },
              description: 'Sort order (Popularity, Newest, Rating)'
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search string'
            },
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 1 }
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 6 }
            }
          ],
          responses: {
            200: { description: 'Course list retrieved successfully' }
          }
        }
      },
      '/api/courses/categories': {
        get: {
          tags: ['Courses'],
          summary: 'Get List of All Available Course Categories',
          responses: {
            200: { description: 'List of unique course categories' }
          }
        }
      },
      '/api/courses/my-learning': {
        get: {
          tags: ['Courses'],
          summary: 'Get User Enrolled and Saved Courses (My Learning Page)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string', default: 'All' } },
            { name: 'sort', in: 'query', schema: { type: 'string', default: 'Recently Accessed' } },
            { name: 'tab', in: 'query', schema: { type: 'string', default: 'all' } }
          ],
          responses: {
            200: { description: 'Categorized enrolled/saved/completed course lists returned' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/courses/create': {
        post: {
          tags: ['Courses'],
          summary: 'Create New Course',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'Node.js Microservices Architecture' },
                    description: { type: 'string', example: 'Build scalable enterprise REST APIs.' },
                    category: { type: 'string', example: 'Development' },
                    level: { type: 'string', example: 'Intermediate' },
                    instructor: { type: 'string', example: 'Alex Johnson' },
                    thumbnail: { type: 'string', example: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' },
                    totalLessons: { type: 'integer', example: 30 },
                    totalModules: { type: 'integer', example: 10 },
                    duration: { type: 'string', example: '18h content' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Course created successfully' }
          }
        }
      },
      '/api/courses/details': {
        get: {
          tags: ['Courses'],
          summary: 'Get Single Course Details by Query Parameter (Alias)',
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          responses: {
            200: { description: 'Course detail object returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/details/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get Single Course Details by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          responses: {
            200: { description: 'Course detail object returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get Single Course Details by ID (Direct Path Alias)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          responses: {
            200: { description: 'Course detail object returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/learn/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get Full Course Player & Learn Page Payload',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          responses: {
            200: { description: 'Course player payload with active lesson, video URL, modules, and notes returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/details/{id}/learn': {
        get: {
          tags: ['Courses'],
          summary: 'Get Full Course Player Payload (Alias Path)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          responses: {
            200: { description: 'Course player payload returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/enroll/{id}': {
        post: {
          tags: ['Courses'],
          summary: 'Enroll Logged-In User into Course',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Successfully enrolled in course' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/courses/save/{id}': {
        post: {
          tags: ['Courses'],
          summary: 'Save or Bookmark Course for Logged-In User',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Course save status toggled successfully' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/api/courses/complete-lesson/{id}': {
        post: {
          tags: ['Courses'],
          summary: 'Mark Lesson as Completed & Update Progress',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Course ID'
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    lessonId: { type: 'string', example: 'l_1' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Lesson completed and user progress updated' }
          }
        }
      },

      /* ==================== COURSE NOTES, Q&A, RESOURCES & LESSONS ==================== */
      '/api/courses/{id}/notes': {
        get: {
          tags: ['Course Interactive Features'],
          summary: 'Get Notes Created by User for a Course',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
          ],
          responses: {
            200: { description: 'Array of user notes returned' }
          }
        },
        post: {
          tags: ['Course Interactive Features'],
          summary: 'Add a New Note to a Course',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content'],
                  properties: {
                    lessonId: { type: 'string', example: 'l_1' },
                    timestamp: { type: 'string', example: '03:45' },
                    content: { type: 'string', example: 'Remember to check customer empathy mapping diagrams.' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Note created successfully' }
          }
        }
      },
      '/api/courses/{id}/notes/{noteId}': {
        delete: {
          tags: ['Course Interactive Features'],
          summary: 'Delete a Course Note',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'noteId', in: 'path', required: true, schema: { type: 'string' }, description: 'Note ID' }
          ],
          responses: {
            200: { description: 'Note deleted successfully' }
          }
        }
      },
      '/api/courses/{id}/qna': {
        get: {
          tags: ['Course Interactive Features'],
          summary: 'Get Q&A Discussion Forum Threads for a Course',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
          ],
          responses: {
            200: { description: 'Q&A discussion threads array returned' }
          }
        },
        post: {
          tags: ['Course Interactive Features'],
          summary: 'Post a New Question in Course Q&A',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['question'],
                  properties: {
                    lessonId: { type: 'string', example: 'l_1' },
                    question: { type: 'string', example: 'How do we handle state persistence in SSR?' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Question posted successfully' }
          }
        }
      },
      '/api/courses/{id}/qna/{questionId}/reply': {
        post: {
          tags: ['Course Interactive Features'],
          summary: 'Post a Reply to a Q&A Question',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'questionId', in: 'path', required: true, schema: { type: 'string' }, description: 'Question ID' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['text'],
                  properties: {
                    text: { type: 'string', example: 'Use React Query or SWR for client cache sync.' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Reply posted successfully' },
            404: { description: 'Question not found' }
          }
        }
      },
      '/api/courses/{id}/qna/{questionId}/upvote': {
        post: {
          tags: ['Course Interactive Features'],
          summary: 'Upvote a Q&A Question Thread',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'questionId', in: 'path', required: true, schema: { type: 'string' }, description: 'Question ID' }
          ],
          responses: {
            200: { description: 'Question upvoted successfully' },
            404: { description: 'Question not found' }
          }
        }
      },
      '/api/courses/{id}/resources': {
        get: {
          tags: ['Course Interactive Features'],
          summary: 'Get List of Course Resources & File Attachments',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' }
          ],
          responses: {
            200: { description: 'Resource attachments array returned' }
          }
        }
      },
      '/api/courses/{id}/resources/{resourceId}/download': {
        get: {
          tags: ['Course Interactive Features'],
          summary: 'Download a Specific Course Resource File',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'resourceId', in: 'path', required: true, schema: { type: 'string' }, description: 'Resource ID' }
          ],
          responses: {
            200: { description: 'Resource download payload returned' },
            404: { description: 'Resource attachment not found' }
          }
        }
      },
      '/api/courses/{id}/lessons/{lessonId}': {
        get: {
          tags: ['Course Interactive Features'],
          summary: 'Get Detailed Lesson Info & User Playback Progress',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'lessonId', in: 'path', required: true, schema: { type: 'string' }, description: 'Lesson ID' }
          ],
          responses: {
            200: { description: 'Lesson details object returned' },
            404: { description: 'Course not found' }
          }
        }
      },
      '/api/courses/{id}/lessons/{lessonId}/progress': {
        post: {
          tags: ['Course Interactive Features'],
          summary: 'Update Video Playback Progress & Timestamp for a Lesson',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Course ID' },
            { name: 'lessonId', in: 'path', required: true, schema: { type: 'string' }, description: 'Lesson ID' }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'number', example: 145 },
                    percentage: { type: 'number', example: 85 },
                    isCompleted: { type: 'boolean', example: true }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Progress saved successfully' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
