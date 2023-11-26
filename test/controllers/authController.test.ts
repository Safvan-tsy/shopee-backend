import { Request, Response, NextFunction } from "express";
import * as authController from "../../src/controllers/authController";
import AppError from '../../src/utils/appError';
import User from "../../src/models/user/userModel";
import Seller from "../../src/models/seller/sellerModel";
import bcrypt from "bcryptjs";

let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
    req = {};
    res = {
        status: jest.fn(),
        json: jest.fn(),
        cookie: jest.fn(),
    };
    next = jest.fn();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Register User", () => {
  it("should register user", async () => {
  })
});