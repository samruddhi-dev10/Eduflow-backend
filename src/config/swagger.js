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
                          id: { type: 'string', example: 'usr_eduflow_101' },
                          name: { type: 'string', example: 'Learner User' },
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
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Alex Smith' },
                    email: { type: 'string', example: 'alex@company.com' },
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
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
