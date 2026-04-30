import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

let title = document.querySelector("h1.projects-title");
let countarticles = document.getElementsByClassName('project').length;
title.textContent = countarticles + " " + title.textContent;
