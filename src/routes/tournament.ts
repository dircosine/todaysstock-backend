import Axios from 'axios';
import { formatEventDate } from '../lib/utils';
import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

export const craeteTournament = async (eventDate: string) => {
  const prisma = new PrismaClient();
  // const eventDate = '20200503';

  try {
    const exists = await prisma.tournament.findOne({
      where: { eventDate },
    });
    if (!exists) {
      const response = await Axios.get(
        `https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/${eventDate}_stock_infos.json`,
      );
      const defaultScores = {};
      response.data.map((info: any) => {
        Object.assign(defaultScores, { [info.name]: 0 });
      });
      const defaultMarketStat = {
        kospi: { buy: 0, hold: 0, sell: 0 },
        kosdaq: { buy: 0, hold: 0, sell: 0 },
      };

      await prisma.tournament.create({
        data: {
          eventDate,
          turnCount: 0,
          stockInfo: JSON.stringify(response.data),
          scores: JSON.stringify(defaultScores),
          marketStat: JSON.stringify(defaultMarketStat),
        },
      });
      console.log('Update done');
    } else {
      console.log('Already exist');
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTodaysInfos = (req: Request, res: Response) => {
  if (req.params.eventdate) {
    craeteTournament(req.params.eventdate);
  } else {
    const eventDate = formatEventDate(new Date());
    setTimeout(() => craeteTournament(eventDate), 10000);
  }
  res.send('Start Creating todaysInfo');
};
