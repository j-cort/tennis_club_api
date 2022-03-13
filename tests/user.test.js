// const User = require("../model/user");
// const { resetDatabase, endPool } = require("./testHelpers");
// const persistedData = require("../persistedData");

// beforeEach(async () => {
//   await resetDatabase();
// });

// afterAll(async () => {
//   await endPool();
// });

// test("adds a new user to the db", async () => {
//   const userID = await User.create(
//     "jamesywamesy",
//     "jamesywamesy@jmail.com",
//     "jameson"
//   );

//   const userInfo = await persistedData("users", userID);
//   const { id, username, email, password } = userInfo

//   expect(id).toBe(userID);
//   expect(username).toBe("jamesywamesy");
//   expect(email).toBe("jamesywamesy@jmail.com");
//   expect(await User.checkPW("jameson", password)).toBe(true);
//   expect(await User.checkPW("wameson", password)).toBe(false);

// });

// test("does not create a user with duplicate credentials", async () => {
  
//   const newUser = await User.create('jamesywamesy', 'jamesywamesy@jmail.com', 'jameson');
//   expect(newUser).toBeTruthy;

//   const sameUsername = await User.create("jamesywamesy", "bamesywamesy@jmail.com", "jameson")
//   expect(sameUsername).toBeFalsy();

//   const sameEmail = await User.create("bamesywamesy", "jamesywamesy@jmail.com", "jameson")
//   expect(sameEmail).toBeFalsy();

//   const uniqueCredentials = await User.create("bamesywamesy", "bamesywamesy@jmail.com", "jameson")
//   expect(uniqueCredentials).toBeTruthy();

// });
