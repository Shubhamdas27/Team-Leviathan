import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().map((err) => {
      const field = (err as any).param || (err as any).path || "field";
      extractedErrors.push({ [field]: err.msg });
    });

    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: extractedErrors,
    });
  };
};
