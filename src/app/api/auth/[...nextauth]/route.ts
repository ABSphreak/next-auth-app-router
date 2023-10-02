import NextAuth, { type NextAuthOptions } from 'next-auth';

import { PrismaAdapter } from '@auth/prisma-adapter';

import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
	debug: true,
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
		newUser: '/register',
	},
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			id: 'email',
			name: 'email',
			type: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'text', placeholder: 'bruce@wayne.com' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await db.user.findFirst({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					return null;
				}

				if (!user.password) {
					return null;
				}

				const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

				if (passwordsMatch) {
					return user;
				}

				return null;
			},
		}),
		CredentialsProvider({
			id: 'otp',
			name: 'OTP',
			credentials: {
				mobile: { label: 'Mobile', type: 'text', placeholder: '1234567890' },
				otpId: { label: 'OtpId', type: 'text' },
				otp: { label: 'OTP', type: 'password' },
			},
			async authorize(credentials, req) {
				if (!credentials?.otpId || !credentials?.otp || !credentials?.mobile) {
					return null;
				}

				const { otpId, mobile, otp } = credentials;

				const otpRecord = await db.otp.findUnique({
					where: {
						id: otpId,
					},
				});

				if (!otpRecord || otpRecord.code !== otp || otpRecord.expires < new Date()) {
					return null;
				}

				const user = await db.user.findFirst({
					where: {
						mobile,
					},
				});

				if (!user) {
					return null;
				}

				if (user) {
					return user;
				}

				return null;
			},
		}),
	],
	callbacks: {
		async session({ token, session }: { token: any; session: any }) {
			const user = session.user;

			if (token && user) {
				user.id = token.id;
				user.name = token.name;
				user.email = token.email;
				user.image = token.picture;
			}

			return session;
		},
		async jwt({ token, user }: { token: any; user: any }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token?.email,
				},
			});

			if (!dbUser) {
				token.id = user.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				image: dbUser.image,
			};
		},
	},
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
