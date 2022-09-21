import * as trpc from "@trpc/server";
import { z } from "zod";
import md5 from "crypto-js/md5";

import { Context } from "./context";

export const serverRouter = trpc
  .router<Context>()
  .query("findAll", {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.link.findMany();
    },
  })
  .query("findByHash", {
    input: z.object({
      hash: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.link.findUnique({
        where: {
          shortenedPath: input.hash,
        },
      });
    },
  })
  .mutation("shortenURL", {
    input: z.object({
      url: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      // check if URL already existins in DB
      const existingLink = await ctx.prisma.link.findUnique({
        where: {
          url: input.url,
        },
      })
      if (existingLink) {
        // return shortenedPath if it already exists
        return existingLink.shortenedPath
      }
      // MD5 hash the URL and get the first 8 characters
      let hashed = md5(input.url).toString().slice(0, 7)
      // check if hash already exists in DB
      let existingHash = await ctx.prisma.link.findUnique({
        where: {
          shortenedPath: hashed.toString(),
        },
      })
      while (existingHash) {
        // if hash already exists, generate a new one
        hashed = md5(hashed).toString().slice(0, 8)
        existingHash = await ctx.prisma.link.findUnique({
          where: {
            shortenedPath: hashed.toString(),
          },
        })
      }
      await ctx.prisma.link.create({
        data: {
          url: input.url,
          shortenedPath: hashed,
        },
      })
      return hashed
    },
  });

export type ServerRouter = typeof serverRouter;
