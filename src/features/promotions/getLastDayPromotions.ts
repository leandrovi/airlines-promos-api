import { format, sub, isSameDay } from "date-fns";
import { Metaphor } from "@/lib/metaphor";
import { getPrisma } from "@/lib/prisma";
import { normalizeExtract } from "@/utils/normalizeExtract";

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

  const searchResponse = await metaphor.search(query, {
    numResults: 25,
    includeDomains: ["twitter.com"],
    startPublishedDate: format(startDate, "yyyy-MM-dd"),
    startCrawlDate: format(startDate, "yyyy-MM-dd"),
  });

  const filteredResults = searchResponse.results.filter(
    // Keep the result if author is null or if author is part of the known authors
    (result) => !result.author || authors.includes(result.author)
  );

  const ids = filteredResults.map((result) => result.id);
  const { contents } = await metaphor.getContents(ids);

  const finalResults = filteredResults.map((result) => {
    const content = contents.find((content) => content.url === result.url);
    return {
      id: result.id,
      url: result.url,
      publishedDate: result.publishedDate,
      author: result.author,
      score: result.score,
      tweetContent: {
        id: content.id,
        title: content.title,
        extract: normalizeExtract(content.extract),
        tweetResultId: result.id,
      },
    };
  });

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
}
