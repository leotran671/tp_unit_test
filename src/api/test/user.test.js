const ctrlUtilisateur = require('../controllers/userController');
const Utilisateur = require('../models/userModel');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

describe('register', () => {
  test('returns a success message when a user is created', () => {
    const requete = { body: { email: 'test@example.com', password: 'password' } };
    const reponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const utilisateur = new Utilisateur(requete.body);
    Utilisateur.mockReturnValueOnce({
      save: jest.fn().mockImplementationOnce(callback => {
        callback(null, utilisateur);
      }),
    });

    ctrlUtilisateur.register(requete, reponse);

    expect(reponse.status).toHaveBeenCalledWith(201);
    expect(reponse.json).toHaveBeenCalledWith({
      message: `user created : ${utilisateur.email} `,
    });
  });

  test('returns an error message when a user cannot be created', () => {
    const requete = { body: { email: 'test@example.com', password: 'password' } };
    const reponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const erreur = new Error('Unable to save user');
    Utilisateur.mockReturnValueOnce({
      save: jest.fn().mockImplementationOnce(callback => {
        callback(erreur, null);
      }),
    });

    ctrlUtilisateur.register(requete, reponse);

    expect(reponse.status).toHaveBeenCalledWith(401);
    expect(reponse.json).toHaveBeenCalledWith({ message: erreur });
  });
});

describe('login', () => {
  test('returns success message and token if credentials are valid', () => {
    const requete = { body: { email: 'test@example.com', password: 'password' } };
    const reponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const utilisateur = {
      email: 'test@example.com',
      password: 'password',
      _id: 'user_id',
    };
    Utilisateur.findOne.mockImplementationOnce((query, callback) => {
      callback(null, utilisateur);
    });
    jwt.sign.mockImplementationOnce((payload, secret, options, callback) => {
      callback(null, 'token');
    });

    ctrlUtilisateur.login(requete, reponse);

    expect(reponse.status).toHaveBeenCalledWith(200);
    expect(reponse.json).toHaveBeenCalledWith({
      message: 'login success',
      token: 'token',
    });
  });

  test('returns an error message when user is not found', () => {
    const requete = { body: { email: 'test@example.com', password: 'password' } };
    const reponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Utilisateur.findOne.mockImplementationOnce((query, callback) => {
      callback('User not found', null);
    });

    ctrlUtilisateur.login(requete, reponse);

    expect(reponse.status).toHaveBeenCalledWith(401);
    expect(reponse.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('returns an error message when password is incorrect', () => {
    const requete = { body: { email: 'test@example.com', password: 'wrong_password' } };
    const reponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const utilisateur = {
      email: 'test@example.com',
      password: 'password',
      _id: 'user_id',
    };

    Utilisateur.findOne.mockImplementationOnce((query, callback) => {
      callback(null, utilisateur);
    });

    ctrlUtilisateur.login(requete, reponse);

    expect(reponse.status).toHaveBeenCalledWith(401);
    expect(reponse.json).toHaveBeenCalledWith({ message: 'login failed' });

  });
});