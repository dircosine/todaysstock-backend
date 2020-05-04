import Axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { formatEventDate } from '../lib/utils';
import { Response, Request } from 'express';

const craeteTournament = async (now: Date) => {
  const prisma = new PrismaClient();
  const eventDate = formatEventDate(now);

  try {
    const exists = await prisma.tournament.findOne({ where: { eventDate } });
    if (!exists) {
      const response = await Axios.get(
        `https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/${eventDate}_stock_infos.json`,
      );
      const stockInfoString = JSON.stringify(response.data);

      await prisma.tournament.create({
        data: { eventDate, stockInfo: stockInfoString },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTodaysInfos = (req: Request, res: Response) => {
  setTimeout(() => craeteTournament(new Date()), 10000);
  res.send('Start Updating todaysInfo');
};
