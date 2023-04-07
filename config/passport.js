const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
          }
          if (!user.password) {
            return done(null, false, {
              msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: "Invalid email or password." });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user) {
      done(null, user.id);
    }
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch((err) => done(err));
  });
};

//*original
// module.exports = function (passport) {
//   passport.use(
//     new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//       User.findOne({ email: email.toLowerCase() }, (err, user) => {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, { msg: `Email ${email} not found.` });
//         }
//         if (!user.password) {
//           return done(null, false, {
//             msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
//           });
//         }
//         user.comparePassword(password, (err, isMatch) => {
//           if (err) {
//             return done(err);
//           }
//           if (isMatch) {
//             return done(null, user);
//           }
//           return done(null, false, { msg: "Invalid email or password." });
//         });
//       });
//     })
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findById(id)
//       .then((user) => done(null, user))
//       .catch((err) => done(err, null));
//     // User.findById(id, (err, user) => done(err, user));
//   });
// };

//* findone()
// module.exports = function (passport) {
//   passport.use(
//     new LocalStrategy(
//       { usernameField: "email" },
//       async (email, password, done) => {
//         try {
//           const user = await User.find({ email: email.toLowerCase() }).limit(1);

//           if (!user.length) {
//             return done(null, false, { msg: `Email ${email} not found.` });
//           }

//           if (!user[0].password) {
//             return done(null, false, {
//               msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
//             });
//           }

//           const isMatch = await user[0].comparePassword(password);

//           if (isMatch) {
//             return done(null, user[0]);
//           }

//           return done(null, false, { msg: "Invalid email or password." });
//         } catch (err) {
//           return done(err);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findOne({ _id: id });
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   });
// };
