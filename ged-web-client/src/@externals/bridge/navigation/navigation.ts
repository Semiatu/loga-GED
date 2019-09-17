import { ExtendedFuseNavigation } from '../types/extended.fuse.navigation';
import { Paths } from 'src/environments/paths';

export const navigation: ExtendedFuseNavigation[] = [
  {
    id: 'permission',
    title: 'Permission',
    translate: 'Permission',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'user',
        title: 'Utilisateurs',
        translate: 'Utilisateurs',
        type: 'item',
        icon: 'account_box',
        url: Paths.permissionPath('users'),
        role: 'user'
      },
      {
        id: 'profile',
        title: 'Profiles',
        translate: 'Profiles',
        type: 'item',
        icon: 'vpn_key',
        url: Paths.permissionPath('profiles'),
        role: 'profile'
      },
      {
        id: 'logs',
        title: 'Logs',
        translate: 'Logs',
        type: 'item',
        icon: 'grade',
        url: Paths.permissionPath('logs'),
        role: 'log'
      }
    ]
  },
  {
    id: 'Application',
    title: 'Application',
    translate: 'Application',
    type: 'group',
    icon: 'apps',
    children: [
      /*{
        id: 'Dummies',
        title: 'Dummy',
        translate: 'Dummy',
        type: 'item',
        icon: 'extension',
        url: Paths.configurationPath('dummies'),
        role: 'squeleton'
      },*/
        {
            id: 'Dossiers',
            title: 'ged',
            translate: 'Dossier',
            type: 'item',
            icon: 'folder',
            url: Paths.join(Paths.configurationPath('dossiers'), 'content/0'),
            role: 'squeleton'
        },
        {
            id: 'Dossiers',
            title: 'Corbeille',
            translate: 'Corbeille',
            type: 'item',
            icon: 'delete',
            url: Paths.configurationPath('corbeille'),
            role: 'squeleton'
        },
      /*  {
            id: 'Categories',
            title: 'Categorie',
            translate: 'Categorie',
            type: 'item',
            icon: 'library_books',
            url: Paths.configurationPath('categories'),
            role: 'squeleton'
        },
        {
            id: 'Langues',
            title: 'Langue',
            translate: 'Langue',
            type: 'item',
            icon: 'language',
            url: Paths.configurationPath('langues'),
            role: 'squeleton'
        },*/
        /* {
            id: 'Documents',
            title: 'Document',
            translate: 'Document',
            type: 'item',
            icon: 'description',
            url: Paths.configurationPath('documents'),
            role: 'squeleton'
        },*/
    ]
  }
];
