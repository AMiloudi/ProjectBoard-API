const request = require('superagent')
const user = require('./fixtures/user.json')
const projects = require('./fixtures/projects.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}${path}`
}

const createProjects = (token) => {
  return projects.map((project) => {
    return request
      .post(createUrl('/projects'))
      .set('Authorization', `Bearer ${token}`)
      .send(project)
      .then((res) => {
        console.log('Project seeded...', res.body.title)
      })
      .catch((err) => {
        console.error('Error seeding project!', err)
      })
  })
}

const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log('Authenticated!')
      return createProjects(res.body.token)
    })
    .catch((err) => {
      console.error('Failed to authenticate!', err.message)
    })
}

request
  .post(createUrl('/users'))
  .send(user)
  .then((res) => {
    console.log('User created!')
    return authenticate(user.email, user.password)
  })
  .catch((err) => {
    console.error('Could not create user', err.message)
    console.log('Trying to continue...')
    authenticate(user.email, user.password)
  })
