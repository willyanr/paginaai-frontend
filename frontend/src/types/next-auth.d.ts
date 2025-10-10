/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { DataUser } from "../interfaces/user.interface";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DataUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }

  interface User extends DataUser {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: DataUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
