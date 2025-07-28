
// server/config/permissions.js

const rolePermissions = {
  admin: [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'task:create',
    'task:read',
    'task:update',
    'task:delete',
    'department:create',
    'department:read',
    'department:update',
    'department:delete',
    'asset:create',
    'asset:read',
    'asset:update',
    'asset:delete',
    'report:read',
    'chat:read',
    'chat:write',
    'branch:create',
    'branch:read',
    'branch:update',
    'branch:delete',
    'role:assign',
    'role:read',
    'role:update',
    'role:delete',
    'permission:assign',
    'permission:read',
    'permission:update',
    'permission:delete',
    'settings:update',
    'department:assign-leads',
    'department:hierarchy',
    'department:performance',
    'department:map', // for fetching departments with location
    'department:all', // for fetching all departments
    'department:fetch', // for fetching department by ID
    'department:update', // for updating department
    'department:delete', // for deleting department
    'department:create', // for creating new department
    'department:assign-leads', // for assigning leads to department
    'department:fetch-leads', // for fetching leads of a department
    'department:fetch-hierarchy', // for fetching department hierarchy
    'department:fetch-performance', // for fetching department performance
    'department:fetch-map', // for fetching department map
    'department:fetch-all', // for fetching all departments with leads
    'department:fetch-by-id', // for fetching department by ID
    'department:update-by-id', // for updating department by ID
    'department:delete-by-id', // for deleting department by ID 
    'department:assign-leads-by-id', // for assigning leads to department by ID
    'department:fetch-leads-by-id', // for fetching leads of a department by ID
    'department:fetch-hierarchy-by-id', // for fetching department hierarchy by ID
    'department:fetch-performance-by-id', // for fetching department performance by ID
    'department:fetch-map-by-id', // for fetching department map by ID
    'department:fetch-all-with-location', // for fetching all departments with location
    'department:fetch-by-name', // for fetching department by name
    'department:fetch-by-location', // for fetching department by location
    'department:fetch-by-lead', // for fetching department by lead
    'department:fetch-by-branch', // for fetching department by branch
    'department:fetch-by-role', // for fetching department by role
    'department:fetch-by-user', // for fetching department by user
    'department:fetch-by-asset', // for fetching department by asset
    'department:fetch-by-task', // for fetching department by task
    'department:fetch-by-report', // for fetching department by report
    'department:fetch-by-chat', // for fetching department by chat
    'department:fetch-by-branch-id', // for fetching department by branch ID
    'department:fetch-by-branch-name', // for fetching department by branch name
    'department:fetch-by-branch-location', // for fetching department by branch location
    'department:fetch-by-branch-lead', // for fetching department by branch lead
    'department:fetch-by-branch-role', // for fetching department by branch role
    'department:fetch-by-branch-user', // for fetching department by branch user
    'department:fetch-by-branch-asset', // for fetching department by branch asset
    'department:fetch-by-branch-task', // for fetching department by branch task
    'department:fetch-by-branch-report', // for fetching department by branch report
    'department:fetch-by-branch-chat', // for fetching department by branch chat
    'department:fetch-by-branch-id-and-name', // for fetching department by branch ID
    'department:fetch-by-branch-id-and-location', // for fetching department by branch ID and location
    'department:fetch-by-branch-id-and-lead', // for fetching department by branch ID and lead
    'department:fetch-by-branch-id-and-role', // for fetching department by branch ID and role
    'department:fetch-by-branch-id-and-user', // for fetching department by branch ID
    'department:fetch-by-branch-id-and-asset', // for fetching department by branch ID and asset
    'department:fetch-by-branch-id-and-task', // for fetching department by branch ID
    'department:fetch-by-branch-id-and-report', // for fetching department by branch ID and report
    'department:fetch-by-branch-id-and-chat', // for fetching department by branch ID and chat
    'department:fetch-by-branch-name-and-location', // for fetching department by branch name and location
    'department:fetch-by-branch-name-and-lead', // for fetching department by branch

    'department:fetch-by-branch-name-and-role', // for fetching department by branch name and role
    'department:fetch-by-branch-name-and-user', // for fetching department by branch name
    'department:fetch-by-branch-name-and-asset', // for fetching department by branch name and asset
    'department:fetch-by-branch-name-and-task', // for fetching department by branch name

    'department:fetch-by-branch-name-and-report', // for fetching department by branch name and report
    'department:fetch-by-branch-name-and-chat', // for fetching department by branch name and chat
    'department:fetch-by-branch-location-and-lead', // for fetching department by branch
    'department:fetch-by-branch-location-and-role', // for fetching department by branch location and role
    'department:fetch-by-branch-location-and-user', // for fetching department by branch location
    'department:fetch-by-branch-location-and-asset', // for fetching department by branch location and asset
    'department:fetch-by-branch-location-and-task', // for fetching department by branch location
    'department:fetch-by-branch-location-and-report', // for fetching department by branch location and report
    'department:fetch-by-branch-location-and-chat', // for fetching department by branch location and chat
    'department:fetch-by-branch-lead-and-role', // for fetching department by branch lead and role
    'department:fetch-by-branch-lead-and-user', // for fetching department by branch lead
    'department:fetch-by-branch-lead-and-asset', // for fetching department by branch lead and asset
    'department:fetch-by-branch-lead-and-task', // for fetching department by branch lead and task
    'department:fetch-by-branch-lead-and-report', // for fetching department by branch lead and report
    'department:fetch-by-branch-lead-and-chat', // for fetching department by branch lead and chat
    'department:fetch-by-branch-role-and-user', // for fetching department by branch role and user
    'department:fetch-by-branch-role-and-asset', // for fetching department by branch role and asset
    'department:fetch-by-branch-role-and-task', // for fetching department by branch role and task
    'department:fetch-by-branch-role-and-report', // for fetching department by branch role and report
    'department:fetch-by-branch-role-and-chat', // for fetching department by branch role and chat
    'department:fetch-by-branch-user-and-asset', // for fetching department by branch
    'department:fetch-by-branch-user-and-task', // for fetching department by branch user and task
    'department:fetch-by-branch-user-and-report', // for fetching department by branch user and report
    'department:fetch-by-branch-user-and-chat', // for fetching department by branch user and chat
    'department:fetch-by-branch-asset-and-task', // for fetching department by branch asset and task
    'department:fetch-by-branch-asset-and-report', // for fetching department by branch asset and report
    'department:fetch-by-branch-asset-and-chat', // for fetching department by branch asset and chat
    'department:fetch-by-branch-task-and-report', // for fetching department by branch task and report
    'department:fetch-by-branch-task-and-chat', // for fetching department by branch task and chat
    'department:fetch-by-branch-report-and-chat', // for fetching department by branch report and chat
    'department:fetch-by-branch-id-and-name-and-location', // for fetching department by branch ID, name and location
    'department:fetch-by-branch-id-and-name-and-lead', // for fetching department by branch ID, name and lead
    'department:fetch-by-branch-id-and-name-and-role', // for fetching department by branch ID, name and role
    'department:fetch-by-branch-id-and-name-and-user', // for fetching department by branch ID, name and user
    'department:fetch-by-branch-id-and-name-and-asset', // for fetching department by branch ID, name and asset
    'department:fetch-by-branch-id-and-name-and-task', // for fetching department by branch ID, name and task
    'department:fetch-by-branch-id-and-name-and-report', // for fetching department by branch ID, name and report
    'department:fetch-by-branch-id-and-name-and-chat', // for fetching department by branch ID, name and chat
    'department:fetch-by-branch-id-and-location-and-lead', // for fetching department by branch ID, location and lead
    'department:fetch-by-branch-id-and-location-and-role', // for fetching department by branch ID, location and role
    'department:fetch-by-branch-id-and-location-and-user', // for fetching department by
    'department:fetch-by-branch-id-and-location-and-asset', // for fetching department by branch ID, location and asset
    'department:fetch-by-branch-id-and-location-and-task', // for fetching department by

    'department:fetch-by-branch-id-and-location-and-report', // for fetching department by branch ID, location and report
    'department:fetch-by-branch-id-and-location-and-chat', // for fetching department by
    'department:fetch-by-branch-id-and-lead-and-role', // for fetching department by branch ID, lead and role
    'department:fetch-by-branch-id-and-lead-and-user', // for fetching department by branch ID, lead and user
    'department:fetch-by-branch-id-and-lead-and-asset', // for fetching department by branch ID, lead and asset
    'department:fetch-by-branch-id-and-lead-and-task', // for fetching department
    'department:fetch-by-branch-id-and-lead-and-report', // for fetching department by branch ID, lead and report
    'department:fetch-by-branch-id-and-lead-and-chat', // for fetching department
    'department:fetch-by-branch-id-and-role-and-user', // for fetching department by branch ID, role and user
    'department:fetch-by-branch-id-and-role-and-asset', // for fetching department by branch ID, role and asset
    'department:fetch-by-branch-id-and-role-and-task', // for fetching department by branch ID, role and task
    'department:fetch-by-branch-id-and-role-and-report', // for fetching department by branch ID, role and report
    'department:fetch-by-branch-id-and-role-and-chat', // for fetching department by
    'department:fetch-by-branch-id-and-user-and-asset', // for fetching department by branch ID, user and asset
    'department:fetch-by-branch-id-and-user-and-task', // for fetching department by
    'department:fetch-by-branch-id-and-user-and-report', // for fetching department by branch ID, user and report
    'department:fetch-by-branch-id-and-user-and-chat', // for fetching department by
    'department:fetch-by-branch-id-and-asset-and-task', // for fetching department by branch ID, asset and task
    'department:fetch-by-branch-id-and-asset-and-report', // for fetching department
    'department:fetch-by-branch-id-and-asset-and-chat', // for fetching department by branch ID, asset and chat
    'department:fetch-by-branch-id-and-task-and-report', // for fetching department by branch ID, task and report
    'department:fetch-by-branch-id-and-task-and-chat', // for fetching department by branch ID, task and chat
    'department:fetch-by-branch-id-and-report-and-chat', // for fetching department by
    'department:fetch-by-branch-name-and-location-and-lead', // for fetching department by branch name, location and lead
    'department:fetch-by-branch-name-and-location-and-role', // for fetching department by branch name, location and role
    'department:fetch-by-branch-name-and-location-and-user', // for fetching department by
    'department:fetch-by-branch-name-and-location-and-asset', // for fetching department by branch name, location and asset
    'department:fetch-by-branch-name-and-location-and-task', // for fetching department by branch name, location and task
    'department:fetch-by-branch-name-and-location-and-report', // for fetching department by branch name, location and report
    'department:fetch-by-branch-name-and-location-and-chat', // for fetching department by branch name, location and chat
    'department:fetch-by-branch-name-and-lead-and-role', // for fetching department by branch name, lead and role
    'department:fetch-by-branch-name-and-lead-and-user', // for fetching department
    'department:fetch-by-branch-name-and-lead-and-asset', // for fetching department by branch name, lead and asset
    'department:fetch-by-branch-name-and-lead-and-task', // for fetching department
    'department:fetch-by-branch-name-and-lead-and-report', // for fetching department by branch name, lead and report
    'department:fetch-by-branch-name-and-lead-and-chat', // for fetching department
    'department:fetch-by-branch-name-and-role-and-user', // for fetching department by branch name, role and user
    'department:fetch-by-branch-name-and-role-and-asset', // for fetching department
    'department:fetch-by-branch-name-and-role-and-task', // for fetching department by branch name, role and task
    'department:fetch-by-branch-name-and-role-and-report', // for fetching department by branch name, role and report
    'department:fetch-by-branch-name-and-role-and-chat', // for fetching department by branch name, role and chat
    'department:fetch-by-branch-name-and-user-and-asset', // for fetching department
    'department:fetch-by-branch-name-and-user-and-task', // for fetching department by branch name, user and task
    'department:fetch-by-branch-name-and-user-and-report', // for fetching department by branch name, user and report
    'department:fetch-by-branch-name-and-user-and-chat', // for fetching department by branch name, user and chat
    'department:fetch-by-branch-name-and-asset-and-task', // for fetching department
    'department:fetch-by-branch-name-and-asset-and-report', // for fetching department by branch name, asset and report
    'department:fetch-by-branch-name-and-asset-and-chat', // for fetching department
    'department:fetch-by-branch-name-and-task-and-report', // for fetching department by branch name, task and report
    'department:fetch-by-branch-name-and-task-and-chat', // for fetching department by
    'department:fetch-by-branch-name-and-report-and-chat', // for fetching department by branch name, report and chat
    'department:fetch-by-branch-location-and-lead', // for fetching department by branch location and lead
    'department:fetch-by-branch-location-and-role', // for fetching department by branch location and role
    'department:fetch-by-branch-location-and-user', // for fetching department by branch location
    'department:fetch-by-branch-location-and-asset', // for fetching department by branch location and asset
    'department:fetch-by-branch-location-and-task', // for fetching department by branch location
    'department:fetch-by-branch-location-and-report', // for fetching department by branch location and report
    'department:fetch-by-branch-location-and-chat', // for fetching department by branch location and chat
    'department:fetch-by-branch-lead-and-role', // for fetching department by branch
    'department:fetch-by-branch-lead-and-user', // for fetching department by branch lead and user
    'department:fetch-by-branch-lead-and-asset', // for fetching department by
    'department:fetch-by-branch-lead-and-task', // for fetching department by branch lead and task
    'department:fetch-by-branch-lead-and-report', // for fetching department by branch lead and report
    'department:fetch-by-branch-lead-and-chat', // for fetching department by branch lead and chat
    'department:fetch-by-branch-role-and-user', // for fetching department by branch role and user
    'department:fetch-by-branch-role-and-asset', // for fetching department by branch role and asset
    'department:fetch-by-branch-role-and-task', // for fetching department by branch role and task
    'department:fetch-by-branch-role-and-report', // for fetching department by branch role and report
    'department:fetch-by-branch-role-and-chat', // for fetching department by branch role
    'department:fetch-by-branch-user-and-asset', // for fetching department by branch user and asset
    'department:fetch-by-branch-user-and-task', // for fetching department by branch user
    'department:fetch-by-branch-user-and-report', // for fetching department by branch user and report
    'department:fetch-by-branch-user-and-chat', // for fetching department by branch user and chat
    'department:fetch-by-branch-asset-and-task', // for fetching department by branch asset and task
    'department:fetch-by-branch-asset-and-report', // for fetching department by branch asset and report
    'department:fetch-by-branch-asset-and-chat', // for fetching department by branch asset and chat
    'department:fetch-by-branch-task-and-report', // for fetching department by branch task and report
    'department:fetch-by-branch-task-and-chat', // for fetching department by branch task and chat
    'department:fetch-by-branch-report-and-chat', // for fetching department by branch report
    'department:fetch-by-branch-id-and-name-and-location', // for fetching department by branch ID, name and location
    'department:fetch-by-branch-id-and-name-and-lead', // for fetching department by branch ID, name and lead
    'department:fetch-by-branch-id-and-name-and-role', // for fetching department by branch ID, name and role
    'department:fetch-by-branch-id-and-name-and-user', // for fetching department by branch ID, name and user
    'department:fetch-by-branch-id-and-name-and-asset', // for fetching department by branch ID, name and asset
    'department:fetch-by-branch-id-and-name-and-task', // for fetching department by branch ID, name and task
    'department:fetch-by-branch-id-and-name-and-report', // for fetching department by branch ID, name and report
    'department:fetch-by-branch-id-and-name-and-chat', // for fetching department by branch ID, name and chat
    'department:fetch-by-branch-id-and-location-and-lead', // for fetching department by branch ID, location and lead
    'department:fetch-by-branch-id-and-location-and-role', // for fetching department by branch ID, location and role
    'department:fetch-by-branch-id-and-location-and-user', // for fetching department by branch ID, location and user
    'department:fetch-by-branch-id-and-location-and-asset', // for fetching department by branch ID, location and asset
    'department:fetch-by-branch-id-and-location-and-task', // for fetching department by branch ID, location and task
    'department:fetch-by-branch-id-and-location-and-report', // for fetching department by branch ID, location and report
    'department:fetch-by-branch-id-and-location-and-chat', // for fetching department by branch ID, location and chat
    'department:fetch-by-branch-id-and-lead-and-role', // for fetching department by branch ID, lead and role
    'department:fetch-by-branch-id-and-lead-and-user', // for fetching department by branch ID, lead and user
    'department:fetch-by-branch-id-and-lead-and-asset', // for fetching department by branch ID, lead and asset
    'department:fetch-by-branch-id-and-lead-and-task', // for fetching department by branch ID, lead and task
    'department:fetch-by-branch-id-and-lead-and-report', // for fetching department by branch ID, lead and report
    'department:fetch-by-branch-id-and-lead-and-chat', // for fetching department by branch ID, lead and chat
    'department:fetch-by-branch-id-and-role-and-user', // for fetching department by branch ID, role and user
    'department:fetch-by-branch-id-and-role-and-asset', // for fetching department by branch ID, role and asset
    'department:fetch-by-branch-id-and-role-and-task', // for fetching department by branch ID, role and task
    'department:fetch-by-branch-id-and-role-and-report', // for fetching department by
    'department:fetch-by-branch-id-and-role-and-chat', // for fetching department by branch ID, role and chat
    'department:fetch-by-branch-id-and-user-and-asset', // for fetching department by branch ID, user and asset
    'department:fetch-by-branch-id-and-user-and-task', // for fetching department by branch ID, user and task
    'department:fetch-by-branch-id-and-user-and-report', // for fetching department by branch ID, user and report
    'department:fetch-by-branch-id-and-user-and-chat', // for fetching department by branch ID, user and chat
    'department:fetch-by-branch-id-and-asset-and-task', // for fetching department by branch ID, asset and task
    'department:fetch-by-branch-id-and-asset-and-report', // for fetching department by branch ID, asset and report
    'department:fetch-by-branch-id-and-asset-and-chat', // for fetching department by branch ID, asset and chat
    'department:fetch-by-branch-id-and-task-and-report', // for fetching department by

    'department:fetch-by-branch-id-and-task-and-chat', // for fetching department by branch ID, task and chat
    'department:fetch-by-branch-id-and-report-and-chat', // for fetching department by branch ID, report and chat
    'department:fetch-by-branch-name-and-location-and-lead', // for fetching department by branch name, location and lead
    'department:fetch-by-branch-name-and-location-and-role', // for fetching department by branch name, location and role
    'department:fetch-by-branch-name-and-location-and-user', // for fetching department by branch name, location and user
    'department:fetch-by-branch-name-and-location-and-asset', // for fetching department
    'department:fetch-by-branch-name-and-location-and-task', // for fetching department by branch name, location and task
    'department:fetch-by-branch-name-and-location-and-report', // for fetching department by branch name, location and report
    'department:fetch-by-branch-name-and-location-and-chat', // for fetching department by branch name, location and chat
    'department:fetch-by-branch-name-and-lead-and-role', // for fetching department by branch name, lead and role
    'department:fetch-by-branch-name-and-lead-and-user', // for fetching department by branch name, lead and user
    'department:fetch-by-branch-name-and-lead-and-asset', // for fetching department by branch name, lead and asset
    'department:fetch-by-branch-name-and-lead-and-task', // for fetching department by branch name, lead and task
    'department:fetch-by-branch-name-and-lead-and-report', // for fetching department by branch name, lead and report
    'department:fetch-by-branch-name-and-lead-and-chat', // for fetching department by branch name, lead and chat
    'department:fetch-by-branch-name-and-role-and-user', // for fetching department by branch name, role and user
    'department:fetch-by-branch-name-and-role-and-asset', // for fetching department by branch name, role and asset
    'department:fetch-by-branch-name-and-role-and-task', // for fetching department by branch name, role and task
    'department:fetch-by-branch-name-and-role-and-report', // for fetching department by branch name, role and report
    'department:fetch-by-branch-name-and-role-and-chat', // for fetching department by branch name, role and chat
    'department:fetch-by-branch-name-and-user-and-asset', // for fetching department by branch name, user and asset
    'department:fetch-by-branch-name-and-user-and-task', // for fetching department by branch name, user and task
    'department:fetch-by-branch-name-and-user-and-report', // for fetching department by branch name, user and report
    'department:fetch-by-branch-name-and-user-and-chat', // for fetching department by branch name, user and chat
    'department:fetch-by-branch-name-and-asset-and-task', // for fetching department by branch name, asset and task
    'department:fetch-by-branch-name-and-asset-and-report', // for fetching department by branch name, asset and report
    'department:fetch-by-branch-name-and-asset-and-chat', // for fetching department by branch name, asset and chat
    'department:fetch-by-branch-name-and-task-and-report', // for fetching department by branch name, task and report
    'department:fetch-by-branch-name-and-task-and-chat', // for fetching department by branch name, task and chat
    'department:fetch-by-branch-name-and-report-and-chat', // for fetching department by branch name, report and chat
    'department:fetch-by-branch-location-and-lead', // for fetching department by branch location and lead
    'department:fetch-by-branch-location-and-role', // for fetching department by branch location and role
    'department:fetch-by-branch-location-and-user', // for fetching department by branch location and user
    'department:fetch-by-branch-location-and-asset', // for fetching department by branch location and asset
    'department:fetch-by-branch-location-and-task', // for fetching department by branch location and task
    'department:fetch-by-branch-location-and-report', // for fetching department by branch location and report
    'department:fetch-by-branch-location-and-chat', // for fetching department by branch location and chat
    'department:fetch-by-branch-lead-and-role', // for fetching department by branch lead and role
    'department:fetch-by-branch-lead-and-user', // for fetching department by branch lead and user
    'department:fetch-by-branch-lead-and-asset', // for fetching department by branch lead and asset
    'department:fetch-by-branch-lead-and-task', // for fetching department by branch lead and task
    'department:fetch-by-branch-lead-and-report', // for fetching department by branch lead and report
    'department:fetch-by-branch-lead-and-chat', // for fetching department by branch lead and chat
    'department:fetch-by-branch-role-and-user', // for fetching department by branch role and user

    'department:fetch-by-branch-role-and-asset', // for fetching department by branch role and asset

    'department:fetch-by-branch-role-and-task', // for fetching department by branch role and task
    'department:fetch-by-branch-role-and-report', // for fetching department by branch role and report
    'department:fetch-by-branch-role-and-chat', // for fetching department by branch role and chat
    'department:fetch-by-branch-user-and-asset', // for fetching department by branch user and asset
    'department:fetch-by-branch-user-and-task', // for fetching department by branch user and task

    // add more as needed
  ],
  coordinator: [
    'user:read',
    'task:create',
    'task:read',
    'task:update',
    'task:delete', // maybe allow deleting own tasks
    'department:read',
    'department:hierarchy', // view department hierarchy
    'department:performance', // view department performance
    'department:map', // view department map
    'department:fetch-all', // fetch all departments with leads
    'department:fetch-by-id', // fetch
    'department:update-by-id', // update department by ID
    'department:delete-by-id', // delete department by ID
    'department:assign-leads', // assign leads to department
    'department:fetch-leads', // fetch leads of a department
    'department:fetch-hierarchy', // fetch department hierarchy
    'department:fetch-performance', // fetch department performance
    'department:fetch-map', // fetch department map
    'department:fetch-all-with-location', // fetch all departments with location
    'department:fetch-by-name', // fetch department by name
    'department:fetch-by-location', // fetch department by location
    'department:fetch-by-lead', // fetch department by lead
    'department:fetch-by-branch', // fetch department by branch
    'department:fetch-by-role', // fetch department by role
    'department:fetch-by-user', // fetch department by user
    'department:fetch-by-asset', // fetch department by asset
    'department:fetch-by-task', // fetch department by task
    'department:fetch-by-report', // fetch department by report
    'department:fetch-by-chat', // fetch department by chat
    'department:fetch-by-branch-id', // fetch department by branch ID
    'department:fetch-by-branch-name', // fetch department by branch name
    'department:fetch-by-branch-location', // fetch department by branch location
    'department:fetch-by-branch-lead', // fetch department by branch lead
    'department:fetch-by-branch-role', // fetch department by branch role
    'department:fetch-by-branch-user', // fetch department by branch user
    'department:fetch-by-branch-asset', // fetch department by branch asset
    'department:fetch-by-branch-task', // fetch department by branch task
    'department:fetch-by-branch-report', // fetch department by branch report

    // limited permissions compared to admin
  ],
  user: [
    'task:read',
    'task:update',
    'task:create',
    'user:read',
    'department:read',
    'department:hierarchy', // view department hierarchy
    'department:performance', // view department performance
    'department:map', // view department map
    
    // read department data
    
    // read own user data

     // create own tasks
     // own tasks maybe
  ],
};

module.exports = rolePermissions;
