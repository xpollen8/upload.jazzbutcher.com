import NextAuth from "next-auth"
//import Providers from "next-auth/providers"
import GitHubProvider from "next-auth/providers/github";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		/*
		Providers.Email({
			server: process.env['SENDGRID_SERVER'],
			from: process.env['SENDGRID_FROM'],
		}),
		*/
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			scope: "read:user",
		}),
	],
	// Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
	// https://next-auth.js.org/configuration/databases
	//
	// Notes:
	// * You must install an appropriate node_module for your database
	// * The Email provider requires a database (OAuth providers do not)
	//database: process.env.DATABASE_URL,
	/*
	database:  {
		type: 'mysql',
		host: process.env['MYSQL_HOST'],
		username: process.env['MYSQL_USERNAME'],
		user: process.env['MYSQL_USER'],
		password: process.env['MYSQL_PASSWORD'],
		database: process.env['MYSQL_DATABASE'],
	},
	*/

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a separate secret is defined explicitly for encrypting the JWT.
	secret: process.env.SECRET,

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `jwt` is automatically set to `true` if no database is specified.
		jwt: true,

		// Seconds - How long until an idle session expires and is no longer valid.
		// maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},

	// JSON Web tokens are only used for sessions if the `jwt: true` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		// A secret to use for key generation (you should set this explicitly)
		// secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
		// Set to true to use encryption (default: false)
		// encryption: true,
		// You can define your own encode/decode functions for signing and encryption
		// if you want to override the default behaviour.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
	},

	// You can define custom pages to override the built-in ones. These will be regular Next.js pages
	// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	pages: {
		// signIn: '/auth/signin/email',  // Displays signin buttons
		// signOut: '/auth/signout', // Displays form with sign out button
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	// Callbacks are asynchronous functions you can use to control what happens
	// when an action is performed.
	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		/*
		async signIn(user, account, profile) {
			console.log("SEND INVITE", { user, account, profile });
			return true;
		},
		async redirect(url, baseUrl) {
			console.log("REDIRECT", { url, baseUrl });
			return `${baseUrl}/account`;
		},
		*/
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	events: {
		signIn: async ({ isNewUser, user, account }) => {
			if (isNewUser) {
				/*
				const res = await createAccount(user)
					.catch(e => {
						// TODO 
						console.log("FAILURE createAccount");
					});
				console.log("AFTER createAccount", res);
				*/
			}
			console.log("SIGNIN", { isNewUser, user, account });
		}
	},

	// Enable debug messages in the console if you are having problems
	debug: true,
})
