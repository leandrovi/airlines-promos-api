import { format, sub, isSameDay } from "date-fns";
import { Prisma, TweetContent, TweetResult } from "@prisma/client";

import { Metaphor } from "../../lib/metaphor";
import { getPrisma } from "../../lib/prisma";
import { generateExtractContent } from "../../lib/openai";
import { normalizeExtract } from "../../utils/normalizeExtract";

interface FinalResult extends Omit<TweetResult, "createdAt"> {
  tweetContent: Omit<TweetContent, "createdAt">;
}

const authors = [
  "AmericanAir",
  "Delta",
  "united",
  "SouthwestAir",
  "JetBlue",
  "AlaskaAir",
  "HawaiianAir",
  "British_Airways",
  "lufthansa",
  "airfrance",
  "KLM",
  "emirates",
  "qatarairways",
  "VirginRed",
  "Virgin",
];

export async function getLastDayPromotions() {
  const prisma = getPrisma();
  const today = new Date();

  const tweetsResults = await prisma.tweetResult.findMany({
    orderBy: { createdAt: "desc" },
    include: { tweetContent: true },
  });

  const [lastTweetResult] = tweetsResults;

  /**
   * If the last tweet result is from today, we don't need to query new tweets
   */
  if (isSameDay(lastTweetResult?.createdAt, today)) {
    return tweetsResults;
  }

  const metaphor = Metaphor.instance;
  const startDate = sub(today, { days: 1 });

  const query = "These are the best airline program promotions:";

  try {
    const searchResponse = await metaphor.search(query, {
      numResults: 10,
      includeDomains: ["twitter.com"],
      startPublishedDate: format(startDate, "yyyy-MM-dd"),
      endPublishedDate: format(startDate, "yyyy-MM-dd"),
    });

    const filteredResults = searchResponse.results.filter(
      // Keep the result if author is null or if author is part of the known authors
      (result) => !result.author || authors.includes(result.author)
    );

    const ids = filteredResults.map((result) => result.id);
    const { contents } = await metaphor.getContents(ids);

    const finalResults: FinalResult[] = [];

    for (let result of filteredResults) {
      const content = contents.find((content) => content.url === result.url);

      if (!content) continue;

      const extractNormalized = normalizeExtract(content.extract);
      const { title, summary } = await generateExtractContent(
        extractNormalized
      );

      finalResults.push({
        id: result.id,
        url: result.url,
        publishedDate: result.publishedDate ?? null,
        author: result.author ?? null,
        score: new Prisma.Decimal(result.score),
        tweetContent: {
          id: content.id,
          title,
          extract: summary,
          tweetResultId: result.id,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.tweetResult.createMany({
        data: finalResults.map((result) => {
          const { tweetContent, ...rest } = result;
          return rest;
        }),
      });
      await tx.tweetContent.createMany({
        data: finalResults.map((result) => result.tweetContent),
      });
    });

    return prisma.tweetResult.findMany({
      orderBy: { createdAt: "desc" },
      include: { tweetContent: true },
    });
  } catch (err) {
    console.log("err", err);
    return [];
  }
}
