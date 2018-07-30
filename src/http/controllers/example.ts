import { Request, Response } from "express";

export let get = (req: Request, res: Response) => {
  const { params: { id }} = req;
  res.json({
    data: id,
  });
};

export let post = (req: Request, res: Response) => {
  const { body: { name, description }} = req;
  res.status(201).json({
    data: `${name} ${description}`
  });
};

export let put = (req: Request, res: Response) => {
  const { body: { name, description }} = req;
  res.json({
    data: `${name} ${description}`
  });
};

export let patch = (req: Request, res: Response) => {
  res.json({
    data: req.body
  });
};

export let del = (req: Request, res: Response) => {
  const { params: { id }} = req;
  res.status(200).json({
    data: id
  });
};