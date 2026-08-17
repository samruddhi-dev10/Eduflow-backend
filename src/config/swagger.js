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
              description: 'Filter courses by category (e.g., Data Science, Design, Business, Finance, Development, Analytics, or All)'
            },
            {
              name: 'level',
              in: 'query',
              required: false,
              schema: { type: 'string', default: 'All Levels' },
              description: 'Filter courses by difficulty level (All Levels, Beginner, Intermediate, Advanced)'
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
              description: 'Search string to match title, description, instructor, or category'
            },
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 6 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            200: {
              description: 'Successfully fetched course list with pagination metadata',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 6 },
                      totalCourses: { type: 'integer', example: 12 },
                      page: { type: 'integer', example: 1 },
                      totalPages: { type: 'integer', example: 2 },
                      hasMore: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: '756e898a-949a-41a5-90bb-035b625ac95a' },
                            title: { type: 'string', example: 'Advanced Machine Learning with Python' },
                            description: { type: 'string', example: 'Master deep learning architectures and reinforcement learning.' },
                            category: { type: 'string', example: 'Data Science' },
                            level: { type: 'string', example: 'Advanced' },
                            instructor: { type: 'string', example: 'Dr. Sarah Jenkins' },
                            thumbnail: { type: 'string', example: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80' },
                            totalLessons: { type: 'integer', example: 48 },
                            totalModules: { type: 'integer', example: 12 },
                            duration: { type: 'string', example: '24h content' },
                            rating: { type: 'number', example: 4.9 },
                            studentsCount: { type: 'string', example: '4.5k students' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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
      '/api/courses/categories': {
        get: {
          tags: ['Courses'],
          summary: 'Get List of All Available Course Categories',
          responses: {
            200: {
              description: 'List of unique course categories',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['All', 'Data Science', 'Design', 'Business', 'Finance', 'Development', 'Analytics']
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/courses/my-learning': {
        get: {
          tags: ['Courses'],
          summary: 'Get Logged-In User Enrolled and Saved Courses',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User enrolled and saved course lists returned' },
            401: { description: 'Unauthorized' }
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
      '/api/courses/learn/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get Full Course Player & Learn Page Payload for Continue Lesson UI',
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
            200: { description: 'Course player payload with active lesson, video URL, objectives, and playlist returned' },
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
              schema: { type: 'string' },
              description: 'Course ID to enroll in'
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
              schema: { type: 'string' },
              description: 'Course ID to save'
            }
          ],
          responses: {
            200: { description: 'Course saved/bookmarked successfully' },
            401: { description: 'Unauthorized' }
          }
        }
      },
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
            200: {
              description: 'List of matching countries and locations',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      total: { type: 'integer', example: 50 },
                      countries: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            code: { type: 'string', example: 'US' },
                            name: { type: 'string', example: 'United States' }
                          }
                        }
                      },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'loc_1' },
                            city: { type: 'string', example: 'San Francisco' },
                            state: { type: 'string', example: 'CA' },
                            country: { type: 'string', example: 'United States' },
                            label: { type: 'string', example: 'San Francisco, CA, USA' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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
      '/api/courses/my-learning': {
        get: {
          tags: ['Courses & My Learning'],
          summary: 'Get User Enrolled Courses for My Learning Page',
          description: 'Returns categorized courses (inProgress, savedForLater, completed, all)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Returns My Learning payload' }
          }
        }
      },
      '/api/courses/{id}/save': {
        post: {
          tags: ['Courses & My Learning'],
          summary: 'Toggle Saving Course for Later',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Toggled save status' }
          }
        }
      },
      '/api/courses/{id}/complete-lesson': {
        post: {
          tags: ['Courses & My Learning'],
          summary: 'Mark Lesson as Completed & Update Progress',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
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
            200: { description: 'Lesson completed and progress updated' }
          }
        }
      },
      '/api/profile/settings': {
        get: {
          tags: ['Profile & Settings'],
          summary: 'Get All User Settings & Profile Details',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Returns settings payload (identity, contactRegion, security, notifications, subscription)' }
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
                    headline: { type: 'string', example: 'Senior Product Designer & Lifelong Learner' },
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
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
