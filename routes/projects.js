const router = require('express').Router()
const passport = require('../config/auth')
const { Project } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadProjects = (req, res, next) => {

  Project.find()
    .then((projects) => {
      req.projects = projects
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router

    .get('/projects', (req, res, next) => {

      Project.find()
        .then((projects) => {
          res.json(projects)})

        .catch((error) => next(error))
    })

    .get('/projects/:id', (req, res, next) => {
      const id = req.params.id

      Project.findById(id)
        .then((project) => {
          if (!project) { return next() }
          res.json(project)
        })
        .catch((error) => next(error))
    })

    .post('/projects', authenticate, loadProjects, (req, res, next) => {

      const newProject = {
        title: req.body.title,
        text: req.body.text,
        status: [{name: 'Flowcharts'}],
      }

      Project.create(newProject)
        .then((project) => {
          io.emit('action', {
            type: 'PROJECT_CREATED',
            payload: project
          })
          res.json(project)
        })
        .catch((error) => next(error))
      })

    .patch('/projects/:id/status', authenticate, (req, res, next) => {
      const id = req.params.id

      Project.findById(id)
        .then((project) => {
          if (!project) { return next() }

          let updatedVillage = {...project.village[0], name: req.body.name}
          let updatedPlayer = {...project, village: [updatedVillage]}

          Project.findByIdAndUpdate(id, { $set: updatedPlayer }, { new: true })
            .then((project) => {
              io.emit('action', {
                type: 'PLAYER_UPDATED',
                payload: project
              })
              res.json(project)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    // .patch('/projects/:id/moveprojects', authenticate, (req, res, next) => {
    //   const id = req.params.id
    //
    //   Project.findById(id)
    //     .then((project) => {
    //       if (!project) { return next() }
    //       if (project.dead ) { return next()}
    //       let updatedVillage = {...project.village[0], name: req.body.name}
    //       let updatedPlayer = {...project, village: [updatedVillage]}
    //
    //   Project.findByIdAndUpdate(id, { $set: updatedPlayer }, { new: true })
    //         .then((project) => {
    //           io.emit('action', {
    //             type: 'PLAYERS_UPDATED',
    //             payload: project
    //           })
    //           res.json(project)
    //         })
    //         .catch((error) => next(error))
    //     })
    //     .catch((error) => next(error))
    // })

    .delete('/projects/:id', authenticate, loadProjects, (req, res, next) => {
      const id = req.params.id

      Project.findByIdAndRemove(id)
        .then((project) => {
          io.emit('action', {
            type: 'PROJECT_REMOVED',
            payload: project
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
