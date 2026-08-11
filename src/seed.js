require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const Course = require('./models/Course');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Dashboard = require('./models/Dashboard');

const initialCourses = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and Express by building real-world projects.',
    category: 'Web Development',
    level: 'Beginner',
    instructor: 'Alex Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
    totalLessons: 42,
    rating: 4.9,
    studentsCount: '3.2k students'
  },
  {
    title: 'Advanced React & Next.js Masterclass',
    description: 'Learn modern React patterns, Server Components, State Management, and Next.js App Router.',
    category: 'Web Development',
    level: 'Advanced',
    instructor: 'Sarah Connor',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80',
    totalLessons: 28,
    rating: 4.8,
    studentsCount: '1.8k students'
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Comprehensive guide to Pandas, NumPy, Matplotlib, Scikit-Learn, and Neural Networks.',
    category: 'Data Science',
    level: 'Intermediate',
    instructor: 'Dr. Emily Carter',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
    totalLessons: 35,
    rating: 4.9,
    studentsCount: '4.5k students'
  },
  {
    title: 'UI/UX Design Essentials & Figma Workflow',
    description: 'Create beautiful user interfaces, wireframes, prototypes, and user flows in Figma.',
    category: 'Design',
    level: 'Beginner',
    instructor: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80',
    totalLessons: 20,
    rating: 4.7,
    studentsCount: '2.1k students'
  },
  {
    title: 'Node.js Microservices & RESTful API Architecture',
    description: 'Build scalable RESTful APIs, JWT authentication, MySQL/Sequelize integration, and Docker deployments.',
    category: 'Backend Development',
    level: 'Intermediate',
    instructor: 'Alex Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
    totalLessons: 25,
    rating: 4.8,
    studentsCount: '1.5k students'
  }
];

const initialUsers = [
  {
    fullName: 'Demo Student',
    email: 'student@eduflow.com',
    password: 'password123',
    role: 'student',
    primaryGoal: 'Become a Full Stack Developer',
    experienceLevel: 'Beginner',
    targetRole: 'Software Engineer'
  },
  {
    fullName: 'Alex Johnson',
    email: 'instructor@eduflow.com',
    password: 'password123',
    role: 'instructor',
    primaryGoal: 'Teach Web Architecture',
    experienceLevel: 'Advanced',
    targetRole: 'Senior Staff Engineer'
  }
];

const seedData = async () => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    const connected = await connectDB();
    if (!connected) {
      console.error('❌ Could not connect to database. Make sure MySQL is running.');
      process.exit(1);
    }

    console.log('🔄 Syncing models...');
    await sequelize.sync({ force: false });

    // Seed Courses
    const existingCourses = await Course.count();
    if (existingCourses === 0) {
      console.log('📦 Seeding sample courses into MySQL database...');
      await Course.bulkCreate(initialCourses);
      console.log(`✅ Successfully seeded ${initialCourses.length} courses!`);
    } else {
      console.log(`ℹ️ Courses table already has ${existingCourses} record(s).`);
      await Course.bulkCreate(initialCourses, { ignoreDuplicates: true });
    }

    // Seed Users, Profiles, Dashboards
    for (const u of initialUsers) {
      let userDoc = await User.findOne({ where: { email: u.email } });
      if (!userDoc) {
        console.log(`👤 Seeding demo user: ${u.email}...`);
        userDoc = await User.create({
          fullName: u.fullName,
          email: u.email,
          password: u.password,
          role: u.role
        });

        await Profile.create({
          userId: userDoc.id,
          isOnboarded: true,
          onboardingStep: 4,
          primaryGoal: u.primaryGoal,
          experienceLevel: u.experienceLevel,
          targetRole: u.targetRole,
          bio: 'Passionate about coding and continuous learning on Eduflow.'
        });

        await Dashboard.create({
          userId: userDoc.id,
          stats: {
            currentStreakDays: 5,
            timeLearnedHours: 14.5,
            coursesCompleted: 2
          },
          liveClasses: [
            {
              id: 'lc_1',
              title: 'Live Q&A: React Server Components',
              instructor: 'Sarah Connor',
              startTime: 'Today, 5:00 PM',
              isReminderSet: true
            }
          ],
          continueLearning: [],
          recommended: []
        });

        console.log(`✅ Seeded user ${u.email} with Profile & Dashboard!`);
      } else {
        console.log(`ℹ️ User ${u.email} already exists in database.`);
      }
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
