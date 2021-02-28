import { resolve } from "path";
import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";


class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const userRepository = await getCustomRepository(UserRepository);
    const surveysRepository = await getCustomRepository(SurveysRepository);
    const surveyUserRepository = await getCustomRepository(SurveyUserRepository);

    const user = await userRepository.findOne({ email });
    if (!user) {
      throw new AppError("User does not exist");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });
    if (!survey) {
      throw new AppError("Survey does not exist");
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");

    const surveyUserAlreadyExists = await surveyUserRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"]
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    })

    await surveyUserRepository.save(surveyUser);
    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return res.status(200).json({ surveyUser });
  }
}

export { SendMailController }