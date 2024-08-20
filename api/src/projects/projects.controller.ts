import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

import { ProjectsService } from './projects.service';

import type { CreateProjectDto, ProjectDatasetDto, UpdateProjectDto } from './zod/projects';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Add a Dataset to a Project' })
  @Post('add-dataset')
  @RouteAccess({ role: 'STANDARD' })
  addDatasetToProject(
    @CurrentUser('id') currentUserId: string,
    projectId: string,
    projectDatasetDto: ProjectDatasetDto
  ) {
    return this.projectsService.addDataset(currentUserId, projectId, projectDatasetDto);
  }

  @ApiOperation({ summary: 'Add a User to a Project' })
  @Post('add-user/:id')
  @RouteAccess({ role: 'STANDARD' })
  addProjectDataset(
    @CurrentUser('id') currentUserId: string,
    @Param('id') projectId: string,
    @Body('projectDatasetDto') projectDatasetDto: ProjectDatasetDto
  ) {
    return this.projectsService.addDataset(currentUserId, projectId, projectDatasetDto);
  }

  @ApiOperation({ summary: 'Add a User to a Project' })
  @Post('add-user/:id')
  @RouteAccess({ role: 'STANDARD' })
  addUserToProject(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string, newUserEmail: string) {
    return this.projectsService.addUser(currentUserId, projectId, newUserEmail);
  }

  @ApiOperation({ summary: 'Get All Available Projects' })
  @Post('create')
  @RouteAccess({ role: 'STANDARD' })
  createProject(@CurrentUser('id') currentUserId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(currentUserId, createProjectDto);
  }

  @ApiOperation({ summary: 'Delete a Project' })
  @RouteAccess({ role: 'STANDARD' })
  @Delete(':id')
  deleteProject(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string) {
    return this.projectsService.deleteProject(currentUserId, projectId);
  }

  @ApiOperation({ summary: 'Get All Available Projects' })
  @Get()
  @RouteAccess({ role: 'STANDARD' })
  getAllProjects(@CurrentUser('id') currentUserId: string) {
    return this.projectsService.getAllProjects(currentUserId);
  }

  @ApiOperation({ summary: 'Get One Project by ID' })
  @RouteAccess({ role: 'STANDARD' })
  @Get(':id')
  getProjectById(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string) {
    return this.projectsService.getProjectById(currentUserId, projectId);
  }

  @ApiOperation({ summary: 'Get Project Datasets by ID' })
  @RouteAccess({ role: 'STANDARD' })
  @Get('datasets/:id')
  getProjectDatasets(@Param('id') projectId: string) {
    return this.projectsService.getProjectDatasets(projectId);
  }

  @ApiOperation({ summary: 'Check if current user is project manager' })
  @Get('is-manager/:id')
  @RouteAccess({ role: 'STANDARD' })
  isProjectManager(@CurrentUser('id') currentUserId: string, @Param('id') projectId: string) {
    return this.projectsService.isProjectManager(currentUserId, projectId);
  }

  @ApiOperation({ summary: 'Delete a Project' })
  @RouteAccess({ role: 'STANDARD' })
  @Delete('/remove-user/:projectId/:id')
  removeUser(
    @CurrentUser('id') currentUserId: string,
    @Param('projectId') projectId: string,
    @Param('id') userIdToRemove: string
  ) {
    return this.projectsService.removeUser(currentUserId, projectId, userIdToRemove);
  }

  @ApiOperation({ summary: 'Delete a Project' })
  @RouteAccess({ role: 'STANDARD' })
  @Patch('/update/:id')
  updateProject(
    @CurrentUser('id') currentUserId: string,
    @Param('id') projectId: string,
    @Body('updateProjectDto') updateProjectDto: UpdateProjectDto
  ) {
    return this.projectsService.updateProject(currentUserId, projectId, updateProjectDto);
  }
}
