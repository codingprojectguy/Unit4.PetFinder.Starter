const prisma = require("../prisma");
const seed = async (numUsers = 10, postsPerUser = 3) => {
  for (let i = 0; i < numUsers; i++) {
    const posts = [];
    for (let j = 0; j < postsPerUser; j++) {
      posts.push({
        title: `Book ${i} ${j}`,
        content: `Content post`,
      });
    }

    await prisma.user.create({
      data: {
        username: `User${i}`,
        password: `123${i}`,
        post: {
          create: posts,
        },
      },
    });
  }
};

/** This is an alternative solution - it uses Array.from instead. */
const seedWithoutLoops = async (numUsers = 20, booksPerUser = 3) => {
  /*
      Array.from() is a quick way to create an array of a certain length
      and fill it with dynamically generated data.
    */
  const createUserPromises = Array.from({ length: numUsers }, (_, i) => {
    const posts = Array.from({ length: booksPerUser }, (_, j) => ({
      title: `post ${i}${j}`,
    }));
    return prisma.user.create({
      data: {
        username: `User${i}`,
        password: `123${i}`,
        posts: {
          create: books,
        },
      },
    });
  });

  /*
      Promise.all allows us to start all the `create` requests
      at the same time, rather than waiting for each one to finish.
      We then wait for all of them to finish with `await`.
    */
  await Promise.all(createUserPromises);
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.Exit(1);
  });
