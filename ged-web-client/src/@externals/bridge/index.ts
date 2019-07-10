import { FuseConfig } from '../fuse/@fuse/types';

export const fuseTMConfig: FuseConfig = {
  // Color themes can be defined in src/app/app.theme.scss
  colorTheme: 'theme-default',
  customScrollbars: true,
  layout: {
    style: 'vertical-layout-1',
    width: 'fullwidth',
    navbar: {
      // primaryBackground: 'blue-700',
      primaryBackground: 'fuse-navy-700',
      // secondaryBackground: 'fuse-white-500',
      secondaryBackground: 'fuse-navy-900',
      folded: false,
      hidden: false,
      position: 'left',
      variant: 'vertical-style-1'
    },
    toolbar: {
      customBackgroundColor: false,
      background: 'fuse-white-500',
      hidden: false,
      position: 'below-static'
    },
    footer: {
      customBackgroundColor: true,
      // background: 'fuse-white-500',
      background: 'fuse-navy-900',
      hidden: false,
      position: 'below-fixed'
    },
    sidepanel: {
      hidden: false,
      position: 'right'
    }
  }
};
