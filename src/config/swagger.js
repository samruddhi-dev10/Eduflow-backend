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
          summary: 'Get List of All Courses',
          responses: {
            200: { description: 'List of courses returned' }
          }
        },
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
                    title: { type: 'string', example: 'Node.js Essentials' },
                    instructor: { type: 'string', example: 'Samruddhi' },
                    duration: { type: 'string', example: '6 weeks' }
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
      '/api/profile/me': {
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
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
