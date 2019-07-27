import {projectOption} from '../../../../environments/project.option';

export const locale = {
  lang: 'fr',
  data: {
    'ITEMS_PER_PAGE_LABEL': 'Items par page:',
    'NEXT_PAGE_LABEL': 'Page suivante',
    'PREVIOUS_PAGE_LABEL': 'Page précédente',
    'FIRST_PAGE_LABEL': 'Première page',
    'LAST_PAGE_LABEL': 'Dernière page',
    'RANGE_PAGE_LABEL_1': '0 de {{length}}',
    'RANGE_PAGE_LABEL_2': '{{startIndex}} - {{endIndex}} de {{length}}',

    'APP': {
      'SUCCESS': projectOption.successMessage,
      'ERROR': projectOption.errorMessage,
      'ADD': 'Ajout',
      'UPDATE': 'Mise à jour',
      'ADD_BTN': 'Ajouter',
        'ADD_BTN_Upload': 'Uploader',
      'REFRESH_BTN': 'Rafraichir',
      'UPDATE_BTN': 'Mettre à jour',
      'DELETE_BTN': 'Supprimer',
      'SAVE_BTN': 'Enregistrer',
      'DELETE_CONFIRM': 'Voulez-vous vraiment supprimer {{value}} ?',
      'UPDATE_CONFIRM': 'Voulez-vous vraiment supprimer {{value}} ?',
      'PROFILE': {
        'TITLE': 'Profiles',
        'SEARCH_TITLE': 'Chercher un profile',
        'ADD_TITLE': 'Nouveau profile',
        'EDIT_TITLE': 'Editer le profile',
        'LIST_TITLE': 'Liste des profiles',
      },
      'PROFILE_ROLE': {
        'TITLE': 'Droits du profile',
      },
      'USER': {
        'TITLE': 'Utilisateurs',
        'SEARCH_TITLE': 'Chercher un utilisateur',
        'ADD_TITLE': 'Nouvel utilisateur',
        'EDIT_TITLE': 'Editer l\'utilisateur',
        'LIST_TITLE': 'Liste des l\'utilisateurs',
      },
      'LOG': {
        'TITLE': 'Logs',
        'SEARCH_TITLE': 'Chercher un log',
      },
      'DUMMY': {
        'TITLE': 'Maquette',
        'SEARCH_TITLE': 'Chercher une maquette',
        'ADD_TITLE': 'Nouvelle maquette',
        'EDIT_TITLE': 'Editer la maquette',
        'LIST_TITLE': 'Liste des maquettes',
      },
        'DOSSIER': {
            'TITLE': 'Dossier',
            'SEARCH_TITLE': 'Chercher un dossier',
            'ADD_TITLE': 'Nouveau dossier',
            'EDIT_TITLE': 'Editer le dossier',
            'LIST_TITLE': 'Liste des dossiers',
            'CONTENTS': 'Contenus',
            'CONTENT': 'Contenu',
        },
        'DOCUMENT': {
            'TITLE': 'Documents',
            'TITLES': 'Documents',
            'SEARCH_TITLE': 'Chercher un document',
            'ADD_TITLE': 'Ajouter un fichier',
            'EDIT_TITLE': 'Editer le document',
            'LIST_TITLE': 'Liste des documents',
        },
    },

    'login': {
      'username': {
        'label': 'Nom d\'utilisateur',
        'required': 'Le nom d\'utilisateur est requis',
      },
      'password': {
        'label': 'Mot de passe',
        'required': 'Le mot de passe est requis',
      },
      'title': 'CONNEXION',
      'button': 'Se connecter',
    }
  }
};
