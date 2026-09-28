import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { logger } from "../../utils/logger.js";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          done(new Error("Google profile has no email"));
          return;
        }

        prisma.user
          .upsert({
            where: { googleId: profile.id },
            update: {
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
            create: {
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
          })
          .then((user) => done(null, user))
          .catch((err) => done(err));
      },
    ),
  );
} else {
  logger.warn("Google OAuth is not configured; /api/auth/google routes will fail.");
}

export { passport };
