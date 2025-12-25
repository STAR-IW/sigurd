import { PrismaClient, Role, Specialty, ClassType } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('${PASSWORD_HASH}', 10);

  // ========== ADMINS ==========
  console.log('Creating admins...');
  const joe = await prisma.user.upsert({
    where: { email: 'joe@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'joe@gmail.com',
      name: 'Joe Admin',
      role: Role.ADMIN,
      phone: '+1234567890',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'bob@gmail.com',
      name: 'Bob Admin',
      role: Role.ADMIN,
      phone: '+1234567891',
    },
  });

  // ========== STUDENTS ==========
  console.log('Creating students...');
  const alice = await prisma.user.upsert({
    where: { email: 'alice@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'alice@gmail.com',
      name: 'Alice Student',
      role: Role.STUDENT,
      phone: '+1234567892',
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'charlie@gmail.com',
      name: 'Charlie Student',
      role: Role.STUDENT,
      phone: '+1234567893',
    },
  });

  const diana = await prisma.user.upsert({
    where: { email: 'diana@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'diana@gmail.com',
      name: 'Diana Student',
      role: Role.STUDENT,
      phone: '+1234567894',
    },
  });

  const evan = await prisma.user.upsert({
    where: { email: 'evan@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'evan@gmail.com',
      name: 'Evan Student',
      role: Role.STUDENT,
      phone: '+1234567895',
    },
  });

  const fiona = await prisma.user.upsert({
    where: { email: 'fiona@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'fiona@gmail.com',
      name: 'Fiona Student',
      role: Role.STUDENT,
      phone: '+1234567896',
    },
  });

  // ========== INSTRUCTORS ==========
  console.log('Creating instructors...');
  const instructor1User = await prisma.user.upsert({
    where: { email: 'mike.trainer@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'mike.trainer@gmail.com',
      name: 'Mike Trainer',
      role: Role.INSTRUCTOR,
      phone: '+1234567897',
    },
  });

  const instructor1 = await prisma.instructor.upsert({
    where: { userId: instructor1User.id },
    update: {},
    create: {
      userId: instructor1User.id,
      bio: 'Certified personal trainer with 10 years of experience in weight lifting and strength training.',
      isActive: true,
      specialties: Specialty.WEIGHT_LIFTING,
    },
  });

  const instructor2User = await prisma.user.upsert({
    where: { email: 'sarah.cardio@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'sarah.cardio@gmail.com',
      name: 'Sarah Cardio',
      role: Role.INSTRUCTOR,
      phone: '+1234567898',
    },
  });

  const instructor2 = await prisma.instructor.upsert({
    where: { userId: instructor2User.id },
    update: {},
    create: {
      userId: instructor2User.id,
      bio: 'Marathon runner and cardio specialist. Passionate about heart health and endurance training.',
      isActive: true,
      specialties: Specialty.CARDIO,
    },
  });

  const instructor3User = await prisma.user.upsert({
    where: { email: 'tom.fitness@gmail.com' },
    update: {},
    create: {
      password: hashedPassword,
      email: 'tom.fitness@gmail.com',
      name: 'Tom Fitness',
      role: Role.INSTRUCTOR,
      phone: '+1234567899',
    },
  });

  const instructor3 = await prisma.instructor.upsert({
    where: { userId: instructor3User.id },
    update: {},
    create: {
      userId: instructor3User.id,
      bio: 'Nutrition and fitness expert specializing in weight management programs.',
      isActive: true,
      specialties: Specialty.WEIGHT_LOSS,
    },
  });

  // ========== CLASSES ==========
  console.log('Creating classes...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const classes: Promise<any>[] = [];
  // Day 1 - Today
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LIFTING,
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        endTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        capacity: 15,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM
        endTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12 PM
        capacity: 20,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LOSS,
        startTime: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        endTime: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        capacity: 12,
        currentBookings: 0,
        instructorId: instructor3.id,
      },
    }),
  );

  // Day 2 - Tomorrow
  const day2 = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(day2.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        endTime: new Date(day2.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        capacity: 18,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.MASS_GAIN,
        startTime: new Date(day2.getTime() + 14 * 60 * 60 * 1000), // 2 PM
        endTime: new Date(day2.getTime() + 15 * 60 * 60 * 1000), // 3 PM
        capacity: 10,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LIFTING,
        startTime: new Date(day2.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        endTime: new Date(day2.getTime() + 19 * 60 * 60 * 1000), // 7 PM
        capacity: 15,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
  );

  // Day 3
  const day3 = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LOSS,
        startTime: new Date(day3.getTime() + 7 * 60 * 60 * 1000), // 7 AM
        endTime: new Date(day3.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        capacity: 20,
        currentBookings: 0,
        instructorId: instructor3.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(day3.getTime() + 12 * 60 * 60 * 1000), // 12 PM
        endTime: new Date(day3.getTime() + 13 * 60 * 60 * 1000), // 1 PM
        capacity: 16,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
  );

  // Day 4
  const day4 = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.MASS_GAIN,
        startTime: new Date(day4.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        endTime: new Date(day4.getTime() + 11 * 60 * 60 * 1000), // 11 AM
        capacity: 12,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LIFTING,
        startTime: new Date(day4.getTime() + 16 * 60 * 60 * 1000), // 4 PM
        endTime: new Date(day4.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        capacity: 15,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(day4.getTime() + 19 * 60 * 60 * 1000), // 7 PM
        endTime: new Date(day4.getTime() + 20 * 60 * 60 * 1000), // 8 PM
        capacity: 20,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
  );

  // Day 5
  const day5 = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LOSS,
        startTime: new Date(day5.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        endTime: new Date(day5.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        capacity: 14,
        currentBookings: 0,
        instructorId: instructor3.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(day5.getTime() + 13 * 60 * 60 * 1000), // 1 PM
        endTime: new Date(day5.getTime() + 14 * 60 * 60 * 1000), // 2 PM
        capacity: 18,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
  );

  // Day 6
  const day6 = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.MASS_GAIN,
        startTime: new Date(day6.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        endTime: new Date(day6.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        capacity: 10,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LIFTING,
        startTime: new Date(day6.getTime() + 15 * 60 * 60 * 1000), // 3 PM
        endTime: new Date(day6.getTime() + 16 * 60 * 60 * 1000), // 4 PM
        capacity: 15,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LOSS,
        startTime: new Date(day6.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        endTime: new Date(day6.getTime() + 19 * 60 * 60 * 1000), // 7 PM
        capacity: 12,
        currentBookings: 0,
        instructorId: instructor3.id,
      },
    }),
  );

  // Day 7
  const day7 = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
  classes.push(
    prisma.class.create({
      data: {
        classType: ClassType.CARDIO,
        startTime: new Date(day7.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        endTime: new Date(day7.getTime() + 11 * 60 * 60 * 1000), // 11 AM
        capacity: 20,
        currentBookings: 0,
        instructorId: instructor2.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.MASS_GAIN,
        startTime: new Date(day7.getTime() + 14 * 60 * 60 * 1000), // 2 PM
        endTime: new Date(day7.getTime() + 15 * 60 * 60 * 1000), // 3 PM
        capacity: 12,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
    prisma.class.create({
      data: {
        classType: ClassType.WEIGHT_LIFTING,
        startTime: new Date(day7.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        endTime: new Date(day7.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        capacity: 16,
        currentBookings: 0,
        instructorId: instructor1.id,
      },
    }),
  );

  await Promise.all(classes);

  console.log('Seeding completed successfully!');
  console.log('Created:');
  console.log('- 2 Admins');
  console.log('- 5 Students');
  console.log('- 3 Instructors');
  console.log('- 20 Classes over 7 days');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
