// ユーザーロールごとの許可された操作を定義
const rolePermissions: Record<UserGroups, string[]> = {
  OperationAdmin: ['*'], // 全権限
  OperationViewer: ['GET /tenants/*'], // 動的パス対応
  TenantAdmin: ['*'],
  TenantSubAdmin: [],
  TenantTeacher: [],
  TenantStudent: []
}

export enum UserGroups {
  OPERATION_ADMIN = "OperationAdmin",
  OPERATION_VIEWER = "OperationViewer",
  TENANT_ADMIN = "TenantAdmin",
  TENANT_SUB_ADMIN = "TenantSubAdmin",
  TENANT_TEACHER = "TenantTeacher",
  TENANT_STUDENT = "TenantStudent",
}

function isOperationAdmin(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.OPERATION_ADMIN)
}


function isOperationViewer(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.OPERATION_VIEWER)
}

function isSaaSProvider(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.OPERATION_ADMIN) || userGroups.includes(UserGroups.OPERATION_VIEWER)
}

function isTenantAdmin(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.TENANT_ADMIN)
}

function isTenantSubAdmin(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.TENANT_SUB_ADMIN)
}

function isTenantTeacher(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.TENANT_TEACHER)
}

function isTenantStudent(userGroups: UserGroups): boolean {
  return userGroups.includes(UserGroups.TENANT_STUDENT)
}


function isAuthorizedRoute(method: string, rawPath: string, userGroups: UserGroups): boolean {
  // グループが無い場合は不許可
  if (!userGroups || userGroups.length === 0) return false

  // 正規化（大文字メソッド＋スペース＋パス）
  const routeKey = `${method.toUpperCase()} ${rawPath}`

  const allowedRoutes = rolePermissions[userGroups] || []

  // ひとつでも一致すれば許可
  return allowedRoutes.some((pattern) => matchRoutePattern(routeKey, pattern))
}

function matchRoutePattern(routeKey: string, pattern: string): boolean {
  if (pattern === '*') return true

  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1) // '*' を除去
    return routeKey.startsWith(prefix)
  }

  if (pattern.includes('/:')) {
    return matchWithPathParams(routeKey, pattern) // 動的パス対応
  }

  return routeKey === pattern
}

function matchWithPathParams(routeKey: string, pattern: string): boolean {
  const [pmethod, ppath] = splitMethodAndPath(pattern)
  const [rmethod, rpath] = splitMethodAndPath(routeKey)

  if (pmethod !== rmethod) return false

  const pSegments = ppath.split('/').filter(Boolean)
  const rSegments = rpath.split('/').filter(Boolean)

  if (pSegments.length !== rSegments.length) return false

  for (let i = 0; i < pSegments.length; i++) {
    const ps = pSegments[i]
    const rs = rSegments[i]
    if (ps.startsWith(':')) {
      continue
    }
    if (ps !== rs) return false
  }

  return true
}

function splitMethodAndPath(routeKey: string): [string, string] {
  const spaceIdx = routeKey.indexOf(' ')
  if (spaceIdx < 0) return [routeKey.toUpperCase(), '/']
  const method = routeKey.slice(0, spaceIdx).toUpperCase()
  const path = routeKey.slice(spaceIdx + 1)
  return [method, path]
}


export default {
  isOperationAdmin,
  isOperationViewer,
  isSaaSProvider,
  isTenantAdmin,
  isTenantSubAdmin,
  isTenantTeacher,
  isTenantStudent,
  isAuthorizedRoute,
}