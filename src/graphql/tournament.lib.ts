import { PrismaClient, Tournament } from '@prisma/client';
import { formatEventDate } from '../lib/utils';

const prisma = new PrismaClient();

export const getTargetEventDate = (now: Date): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now);
};

const scoreMap: number[] = [10, 8, 5, 5, 2, 2, 2, 2];
export const updateStat = async (eventDate: string, rank: string[], marketString: string) => {
  const tournament: Tournament | null = await prisma.tournament.findOne({
    where: { eventDate },
  });
  if (!tournament) {
    return;
  }
  // *** scores
  const scores = JSON.parse(tournament.scores);
  rank.slice(0, 8).map((item: string, rank: number) => {
    scores[item] = scores[item] + scoreMap[rank];
  });

  // *** marketStat
  const marketStat = JSON.parse(tournament.marketStat);
  const market = JSON.parse(marketString);
  Object.keys(market).map((key) => {
    marketStat[key][market[key]] = marketStat[key][market[key]] + 1;
  });

  // db update
  await prisma.tournament.update({
    where: { eventDate },
    data: {
      scores: JSON.stringify(scores),
      marketStat: JSON.stringify(marketStat),
      turnCount: tournament.turnCount + 1,
    },
  });
};

export const getTournament = async (eventDate: string) => {
  const touranment = await prisma.tournament.findOne({
    where: { eventDate },
  });
  if (!touranment) return null;
  if (touranment.turnCount < 13) {
    // *** 참여 결과 13개 이하면 통계 제공 안 함
    const { scores, marketStat, ...sub } = touranment;
    return sub;
  } else {
    return touranment;
  }
};
