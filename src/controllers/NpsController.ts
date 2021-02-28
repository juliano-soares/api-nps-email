import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractor = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passive = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswer = surveyUsers.length;

    const calculate = Number((((promoters - detractor) / totalAnswer) * 100).toFixed(2));

    return res.json({
      detractor,
      promoters,
      passive,
      totalAnswer,
      nps: calculate
    })
  }
}

export { NpsController }