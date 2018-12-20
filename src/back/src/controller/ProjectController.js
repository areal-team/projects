'use strict';

class  ProjectModel {
  constructor({
    getProjects,
    getProject,
    updateProject,
    createProject,
    deleteProject,
    backupProject,
    updateStatus,
  }) {
    this.getProjects = getProjects;
    this.getProject = getProject;
    this.updateProject = updateProject;
    this.createProject = createProject;
    this.deleteProject = deleteProject;
    this.backupProject = backupProject;
    this.updateStatusCommand = updateStatus;
  }

  async getList() {
    return await this.getProjects.get();
  }

  async get(params) {
    console.log('getProject', params);
    
    return await this.getProject.get(params);
  }

  async update(filter, update) {
    console.log('updateProject', filter, update);
    
    return await this.updateProject.execute(filter, update);
  }

  async create(params) {
    return await this.createProject.execute(params);
  }

  async delete(params) {
    return await this.deleteProject.execute(params);
  }

  async backup(id) {
    return await this.backupProject.execute(id);
  }

  async updateStatus(params) {
    return await this.updateStatusCommand.execute(params);
  }
}

module.exports = ProjectModel;
