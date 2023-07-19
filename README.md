# Nest To-Do App

This is a basic to-do list web application built with NestJS.

## Description

The app provides REST API endpoints for CRUD operations on a to-do list. Users can:

- Get all to-do items
- Add a new to-do item
- Update an existing to-do item
- Delete a to-do item
- Mark a to-do item as completed

The to-do items are stored in memory using a NestJS service.

The main technologies used are:

- NestJS framework
- REST API principles
- TypeScript

## Usage

To run the app locally:

1. Clone the repository
2. Run `npm install`
3. Run `npm run start`
4. The server will start on port 3000
5. Use a tool like Postman to test the API endpoints

## Endpoints

The main endpoints are:

- GET /todos - Get all to-do items
- POST /todos - Create a new to-do
- PUT /todos/:id - Update an existing to-do
- DELETE /todos/:id - Delete a to-do
- PATCH /todos/:id/status - Update a to-do status
