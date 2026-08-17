require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const Course = require('./models/Course');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Dashboard = require('./models/Dashboard');

const initialCourses = [
  {
    title: 'Advanced Machine Learning with Python',
    description: 'Master deep learning architectures, reinforcement learning, and productionizing ML models with Python.',
    category: 'Data Science',
    level: 'Advanced',
    instructor: 'Dr. Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
    totalLessons: 48,
    totalModules: 12,
    duration: '24h content',
    rating: 4.9,
    studentsCount: '4.5k students'
  },
  {
    title: 'Design Thinking Foundations',
    description: 'Learn human-centered problem solving, wireframing, prototyping, and user journey mapping.',
    category: 'Design',
    level: 'Beginner',
    instructor: 'Marcus Thorne',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80',
    totalLessons: 32,
    totalModules: 8,
    duration: '15h content',
    rating: 4.8,
    studentsCount: '2.1k students'
  },
  {
    title: 'Strategic Project Management',
    description: 'Drive high-impact enterprise projects using Agile, Scrum, Kanban, and modern leadership frameworks.',
    category: 'Business',
    level: 'Intermediate',
    instructor: 'Elena Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
    totalLessons: 40,
    totalModules: 10,
    duration: '18h content',
    rating: 4.7,
    studentsCount: '3.8k students'
  },
  {
    title: 'Blockchain & Future Markets',
    description: 'Understand decentralized protocols, smart contracts, Web3 economics, and crypto assets.',
    category: 'Finance',
    level: 'Advanced',
    instructor: 'Jameson Blackwood',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80',
    totalLessons: 56,
    totalModules: 14,
    duration: '30h content',
    rating: 4.9,
    studentsCount: '1.9k students'
  },
  {
    title: 'Emotional Intelligence for Leaders',
    description: 'Develop executive presence, empathy, dispute resolution skills, and resilient team management.',
    category: 'Development',
    level: 'Beginner',
    instructor: 'Dr. Linda Zhang',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80',
    totalLessons: 24,
    totalModules: 6,
    duration: '10h content',
    rating: 4.6,
    studentsCount: '1.2k students'
  },
  {
    title: 'Data-Driven Decision Making',
    description: 'Transform raw corporate data into actionable business intelligence using statistical analysis & dashboards.',
    category: 'Analytics',
    level: 'Intermediate',
    instructor: 'Robert Chen',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80',
    totalLessons: 44,
    totalModules: 11,
    duration: '20h content',
    rating: 4.8,
    studentsCount: '2.9k students'
  },
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and Express by building production-ready apps.',
    category: 'Development',
    level: 'Beginner',
    instructor: 'Alex Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
    totalLessons: 64,
    totalModules: 16,
    duration: '40h content',
    rating: 4.9,
    studentsCount: '5.4k students'
  },
  {
    title: 'Generative AI & LLM Engineering',
    description: 'Build RAG pipelines, fine-tune open source LLMs, and deploy AI assistants with LangChain.',
    category: 'Data Science',
    level: 'Advanced',
    instructor: 'Dr. Sophia Vance',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80',
    totalLessons: 60,
    totalModules: 15,
    duration: '35h content',
    rating: 4.95,
    studentsCount: '6.1k students'
  },
  {
    title: 'Product Strategy & Growth Marketing',
    description: 'Scale products from 0 to 1 million users using data funnel optimization and modern product design.',
    category: 'Business',
    level: 'Intermediate',
    instructor: 'Sarah Connor',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80',
    totalLessons: 36,
    totalModules: 9,
    duration: '16h content',
    rating: 4.75,
    studentsCount: '3.1k students'
  },
  {
    title: 'Cybersecurity Fundamentals & Threat Intel',
    description: 'Learn ethical hacking, network defense mechanisms, zero trust architecture, and cloud security.',
    category: 'Development',
    level: 'Intermediate',
    instructor: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80',
    totalLessons: 48,
    totalModules: 12,
    duration: '22h content',
    rating: 4.85,
    studentsCount: '2.7k students'
  },
  {
    title: 'UI/UX Design Systems & Figma Mastery',
    description: 'Architect scalable design tokens, component libraries, and interactive prototypes for web & mobile.',
    category: 'Design',
    level: 'Intermediate',
    instructor: 'Emily Carter',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80',
    totalLessons: 40,
    totalModules: 10,
    duration: '18h content',
    rating: 4.8,
    studentsCount: '4.2k students'
  },
  {
    title: 'Financial Modeling & Venture Capital',
    description: 'Master discounted cash flow analysis, cap tables, valuation techniques, and startup financing pitch decks.',
    category: 'Finance',
    level: 'Advanced',
    instructor: 'Jameson Blackwood',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&q=80',
    totalLessons: 52,
    totalModules: 13,
    duration: '28h content',
    rating: 4.9,
    studentsCount: '1.7k students'
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

const seedData = async (exitOnFinish = true) => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    const connected = await connectDB();
    if (!connected) {
      console.error('❌ Could not connect to database. Make sure MySQL/Postgres is running.');
      if (exitOnFinish) process.exit(1);
      return;
    }

    console.log('🔄 Syncing models...');
    await sequelize.sync({ force: false });

    // Seed Courses
    const existingCourses = await Course.count();
    if (existingCourses === 0) {
      console.log('📦 Seeding sample courses into database...');
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
    if (exitOnFinish) process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (exitOnFinish) process.exit(1);
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = seedData;

