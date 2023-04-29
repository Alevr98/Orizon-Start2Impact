const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')
const PORT = process.env.API_PORT_UNIT_TEST || 3001;
