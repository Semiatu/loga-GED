export class Paths {
  static base = '';
  static sep = '/';

  static login = 'login';
  static permission = Paths.join(Paths.base, 'permission');
  static skeleton = Paths.join(Paths.base, 'skeleton');
  static configuration = Paths.join(Paths.skeleton, 'configuration');


  private static paths = {
    'permission': Paths.permission,
    'skeleton': Paths.skeleton,
    'configuration': Paths.configuration,
  };

  static join(path1: string, path2: string): string {
    const sep = Paths.sep;
    if (path1.indexOf(sep) !== 0) {
      path1 = sep + path1;
    }
    return path1 + sep + path2;
  }

  static get(name: string, path2: string): string {
    return Paths.join(Paths.paths[name], path2);
  }

  static permissionPath(path: string): string {
    return Paths.get('permission', path);
  }

  static skeletonPath(path: string): string {
    return Paths.get('skeleton', path);
  }

  static configurationPath(path: string): string {
    return Paths.get('configuration', path);
  }
}
