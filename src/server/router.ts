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
  .mutation("findByHash", {
    input: z.object({
      hash: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const link = await ctx.prisma.link.findUnique({
        where: {
          shortenedPath: input.hash,
        },
      });
      if (link && link.remainingClicks) {
        const newMaxClick = link.remainingClicks > 0 ? link.remainingClicks - 1 : 0
        await ctx.prisma.link.update({
          where: {
            shortenedPath: link.shortenedPath
          },
          data: {
            remainingClicks: newMaxClick
          }
        })
      }
      return link;
    },
  })
  .mutation("shortenURL", {
    input: z.object({
      url: z.string(),
      alias: z.string().optional(),
      numberOfClicks: z.string().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      let shortenedPath = undefined;
      const noOfClicks = input.numberOfClicks ? + input.numberOfClicks : undefined;
      if (input.alias) {
        // check if the alias already exists
        let existingAlias = await ctx.prisma.link.findUnique({
          where: {
            shortenedPath: input.alias
          }
        })
        if (!existingAlias) {
          // if alias doesnt exist, shorten url with alias
          shortenedPath = input.alias
        }
      } else {
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
        shortenedPath = hashed.toString();
      }
      if (shortenedPath) {
        await ctx.prisma.link.create({
          data: {
            url: input.url,
            shortenedPath: shortenedPath,
            remainingClicks: noOfClicks ?? null
          },
        })
      }
      return shortenedPath
    },
  });

export type ServerRouter = typeof serverRouter;
