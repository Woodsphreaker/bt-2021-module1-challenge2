const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const {title, url, techs} = req.body
  const uniqueID = uuid()

  const newRepositoryData = {
    id: uniqueID,
    title, 
    url, 
    techs,
    likes: 0,
  }
  
  repositories.push(newRepositoryData)
  res.json(newRepositoryData)
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params
  const {title, url, techs} = req.body
  const currentItemIndex = repositories.findIndex(({id: repoID}) => repoID === id)

  if (currentItemIndex < 0) {
    return res.status(400).json({error: 'repository not found'})
  }

  const currentRepository = repositories[currentItemIndex]
  const validFields = Object
                          .entries({title, url, techs})
                          .reduce((acc, [key, value]) => {
                            if (value) {
                              acc[key] = value
                            }
                            return acc
                          }, {})
  const updatedRepository = {
   ...currentRepository,
   ...validFields
  }

  repositories.splice(currentItemIndex, 1, updatedRepository)
  res.json(updatedRepository)
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params
  const currentItemIndex = repositories.findIndex(({id: repoID}) => repoID === id)

  if (currentItemIndex < 0) {
    return res.status(400).json({error: 'repository not found'})
  }

  repositories.splice(currentItemIndex, 1)
  res.status(204).send()
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params
  const currentItemIndex = repositories.findIndex(({id: repoID}) => repoID === id)

  if (currentItemIndex < 0) {
    return res.status(400).json({error: 'repository not found'})
  }

  const currentRepository = repositories[currentItemIndex]
  currentRepository.likes += 1

  res.json(currentRepository)

});

module.exports = app;
