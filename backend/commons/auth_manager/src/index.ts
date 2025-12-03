export enum UserRoles {
  OPERATION_ADMIN = "OperationAdmin",
  OPERATION_SUB_ADMIN = "OperationSubAdmin",
  OPERATION_VIEWER = "OperationViewer",
  TENANT_ADMIN = "TenantAdmin",
  TENANT_SUB_ADMIN = "TenantSubAdmin",
  TENANT_VIEWER = "TenantViewer",
  TENANT_USER = "TenantUser",
}

function isOperationAdmin(userRole: UserRoles): boolean {
  return userRole === UserRoles.OPERATION_ADMIN
}

function isOperationSubAdmin(userRole: UserRoles): boolean {
  return userRole === UserRoles.OPERATION_SUB_ADMIN
}

function isOperationViewer(userRole: UserRoles): boolean {
  return userRole === UserRoles.OPERATION_VIEWER
}

function isSaaSProvider(userRole: UserRoles): boolean {
  return userRole === UserRoles.OPERATION_ADMIN || userRole === UserRoles.OPERATION_SUB_ADMIN || userRole === UserRoles.OPERATION_VIEWER
}

function isTenantAdmin(userRole: UserRoles): boolean {
  return userRole === UserRoles.TENANT_ADMIN
}

function isTenantSubAdmin(userRole: UserRoles): boolean {
  return userRole === UserRoles.TENANT_SUB_ADMIN
}

function isTenantViewer(userRole: UserRoles): boolean {
  return userRole === UserRoles.TENANT_VIEWER
}

function isTenantUser(userRole: UserRoles): boolean {
  return userRole === UserRoles.TENANT_USER
}

export default {
  isOperationAdmin,
  isOperationSubAdmin,
  isOperationViewer,
  isSaaSProvider,
  isTenantAdmin,
  isTenantSubAdmin,
  isTenantViewer,
  isTenantUser,
}